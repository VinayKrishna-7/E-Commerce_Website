const prisma = require('../config/prisma');

const getStats = async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueAggregate] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { not: 'CANCELLED' },
        },
      }),
    ]);

    const totalRevenue = revenueAggregate._sum.totalAmount || 0;

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: Number(totalRevenue),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * take;

    const where = {};
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (category && category !== 'All Products') {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / take) || 1,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, originalPrice, imageUrl, category, stock, featured } = req.body;

    if (!name || !description || price === undefined || !imageUrl || !category) {
      return res.status(400).json({ message: 'Title, description, price, category, and image URL are required.' });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        imageUrl: imageUrl.trim(),
        category: category.trim(),
        stock: parseInt(stock, 10) || 0,
        featured: !!featured,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, originalPrice, imageUrl, category, stock, featured } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
        ...(imageUrl && { imageUrl: imageUrl.trim() }),
        ...(category && { category: category.trim() }),
        ...(stock !== undefined && { stock: parseInt(stock, 10) }),
        ...(featured !== undefined && { featured: !!featured }),
      },
    });

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await prisma.product.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Product deleted from active catalog.',
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: status.toUpperCase() },
      include: { items: true, user: true },
    });

    res.json({
      success: true,
      message: `Order status changed to ${status}.`,
      order: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
};
