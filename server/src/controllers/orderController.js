const prisma = require('../config/prisma');

const SHIPPING_THRESHOLD = 999.0;
const FLAT_SHIPPING_FEE = 99.0;

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    if (!shippingAddress || !shippingAddress.recipientName || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ message: 'A complete delivery address is required.' });
    }

    // 1. Fetch current cart items from database
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Your shopping bag is empty.' });
    }

    // 2. Validate stock availability for each item
    for (const item of cartItems) {
      if (!item.product) {
        return res.status(400).json({ message: 'An item in your bag no longer exists.' });
      }
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}, in bag: ${item.quantity}.`,
        });
      }
    }

    // 3. Recalculate subtotals and totals on the server
    let subtotal = 0;
    const itemsData = cartItems.map((item) => {
      const unitPrice = Number(item.product.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      return {
        productId: item.product.id,
        productName: item.product.name,
        productImageUrl: item.product.imageUrl,
        priceAtPurchase: item.product.price,
        quantity: item.quantity,
        subtotal: lineTotal,
      };
    });

    const shippingAmount = subtotal >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
    const totalAmount = subtotal + shippingAmount;

    // Generate unique order number: e.g. ORD-847291
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-${randomDigits}`;

    // 4. Execute atomic transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // A. Decrement stock for all items
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // B. Create Order record
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount,
          shippingAmount,
          status: 'PENDING',
          paymentMethod,
          paymentStatus: paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
          shippingAddressSnapshot: shippingAddress,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // C. Clear purchased cart items
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return order;
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Security check: Only owner or admin can view order
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access forbidden: You cannot view another customer’s order.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
