const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'Access forbidden: Administrative privileges required.',
    });
  }
  next();
};

module.exports = adminMiddleware;
