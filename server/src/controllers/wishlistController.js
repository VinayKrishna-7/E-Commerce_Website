const prisma = require('../config/prisma');

const getWishlist = async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId,
        productId,
      },
      include: { product: true },
    });

    res.status(200).json({
      success: true,
      message: 'Item saved to wishlist.',
      item,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    res.json({ success: true, message: 'Item removed from wishlist.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
