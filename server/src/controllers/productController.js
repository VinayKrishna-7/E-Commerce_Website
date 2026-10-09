const prisma = require('../config/prisma');

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * take;

    const where = {};

    // Search filter across name and description
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (category && category !== 'All Products') {
      where.category = category;
    }

    // Price range filters
    if (minPrice !== undefined && minPrice !== '') {
      where.price = {
        ...(where.price || {}),
        gte: parseFloat(minPrice),
      };
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      where.price = {
        ...(where.price || {}),
        lte: parseFloat(maxPrice),
      };
    }

    // Featured filter
    if (featured !== undefined) {
      where.featured = featured === 'true' || featured === true;
    }

    // Sorting
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take) || 1;

    res.json({
      success: true,
      products,
      total,
      totalPages,
      page: pageNum,
      limit: take,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
};
