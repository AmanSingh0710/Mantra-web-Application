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
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await Product.findById(productId);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock"
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    const itemData = {
      productId: product._id,
      name: product.productName,
      price: product.discountPrice > 0
        ? product.discountPrice
        : product.price,
      image: product.thumbnail?.url || "",
      quantity: Number(quantity),
      discountAmount: product.discountAmount || 0,
      discountType: product.discountType || "Flat",
      category: product.category,
      brand: product.brand,
      currentStock: product.stock
    };

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [itemData]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push(itemData);
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
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