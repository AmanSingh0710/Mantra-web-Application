const Cart = require("../../models/Cart");
const Product = require("../../models/VendorProduct");

// GET user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD / UPDATE product in cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Fetch product profile
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found in system database" });
    }

    // Dynamic base URL resolver for production vs local
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

    // 1. Safe Price Lookup
    const targetPrice = product.price !== undefined ? product.price : product.unitPrice;
    const targetStock = product.stock !== undefined ? product.stock : product.currentStock;

    if (targetPrice === undefined || targetPrice === null) {
      return res.status(400).json({
        message: "Validation failed: Selected product entry does not contain a price definition."
      });
    }

    // 🌟 2. RESILIENT IMAGE FALLBACK CHECK:
    // This scans every possible field name where your image string might live.
    let rawImage = product.image || product.thumbnail || product.imageUrl || product.imagePath;

    // 🚨 Safety Check: If it's still empty, try checking inside product.data or nested fields if any
    if (!rawImage && product.images && product.images.length > 0) {
      rawImage = product.images[0]; // fallback to first image in a gallery array
    }

    // If completely missing from the database record, assign a production placeholder so it NEVER crashes Mongoose
    if (!rawImage) {
      console.warn(`⚠️ Warning: Product ID ${productId} is missing an image asset field.`);
      rawImage = "placeholder.jpg"; 
    }

    // Cleanly append upload directory path if it's a relative file string
    let resolvedImage = rawImage;
    if (resolvedImage && !resolvedImage.startsWith("http://") && !resolvedImage.startsWith("https://")) {
      resolvedImage = `${baseUrl}/uploads/${resolvedImage}`;
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    // Constructed payload mapping
    const itemData = {
      productId: product._id,
      name: product.name,
      price: Number(targetPrice), 
      image: resolvedImage, // 🌟 Guaranteed to be a filled string token now!
      quantity: Number(quantity) || 1,
      discountAmount: product.discountAmount || 0,
      discountType: product.discountType || 'Flat',
      category: product.category || "General",
      brand: product.brand || "Generic",
      currentStock: targetStock !== undefined ? Number(targetStock) : 0
    };

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [itemData] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += (Number(quantity) || 1);
      } else {
        cart.items.push(itemData);
      }
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Backend Production AddToCart Error Trace:", error);
    res.status(500).json({ message: error.message });
  }
};

// REMOVE product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};