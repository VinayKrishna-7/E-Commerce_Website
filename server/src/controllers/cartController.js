const prisma = require('../config/prisma');

const getCart = async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: 'This item is currently out of stock.' });
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let cartItem;
    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Cannot add more than available stock (${product.stock} units).`,
        });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
        include: { product: true },
      });
    } else {
      if (qty > product.stock) {
        return res.status(400).json({
          message: `Requested quantity exceeds available stock (${product.stock} units).`,
        });
      }

      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: qty,
        },
        include: { product: true },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item added to bag.',
      item: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    if (qty > item.product.stock) {
      return res.status(400).json({
        message: `Only ${item.product.stock} units available in stock.`,
      });
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: qty },
      include: { product: true },
    });

    res.json({
      success: true,
      message: 'Quantity updated.',
      item: updated,
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({ success: true, message: 'Item removed from bag.' });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });

    res.json({ success: true, message: 'Shopping bag cleared.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
