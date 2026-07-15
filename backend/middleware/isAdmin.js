//middleware/isAdmin.js
module.exports = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Authorization error"
      });
    }
  };
};