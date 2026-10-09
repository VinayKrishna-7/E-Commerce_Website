const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sampleProducts = [
  // --- Category: Audio & Electronics ---
  {
    name: 'Acoustic Precision Studio Headphones',
    description: 'Closed-back reference monitor headphones crafted with machined aluminum yokes, beryllium drivers, and supple sheepskin ear cushions for fatigue-free listening.',
    price: 14999.00,
    originalPrice: 17999.00,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 24,
    featured: true,
  },
  {
    name: 'Cast Brass Tabletop Radio & Speaker',
    description: 'Analog FM tuner integrated with lossless Bluetooth 5.3 architecture. Enclosed within hand-finished acoustic birch ply with solid milled brass knobs.',
    price: 9999.00,
    originalPrice: 12499.00,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 12,
    featured: true,
  },
  {
    name: 'Tactile Mechanical Keypad (Oatmeal)',
    description: 'Compact 68-key mechanical keyboard featuring custom lubed tactile switches, dye-sub PBT keycaps, and a dampening silicone internal structure.',
    price: 7499.00,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 18,
    featured: false,
  },
  {
    name: 'Minimalist Desk Lamp with Wireless Base',
    description: 'Dimmable warm 2700K LED task lamp with anodized aluminum gooseneck and integrated 15W Qi-certified induction charging stone base.',
    price: 4999.00,
    originalPrice: 5999.00,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 15,
    featured: false,
  },
  {
    name: 'Solid Walnut Dual Monitor Riser',
    description: 'Elevates dual screen setups to natural ergonomic height. Single-slab sustainable American walnut sealed with plant-based hardwax oil.',
    price: 8499.00,
    originalPrice: 9999.00,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 9,
    featured: false,
  },

  // --- Category: Apparel & Footwear ---
  {
    name: 'Heavyweight Loopback French Terry Crewneck',
    description: '450 GSM organic combed cotton sweater knit slowly on vintage loopwheel machines. Ribbed side gussets and flatlock seam construction.',
    price: 4499.00,
    originalPrice: 5499.00,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 30,
    featured: true,
  },
  {
    name: 'Selvedge Cotton Utility Overshirt',
    description: 'Woven from 12oz shuttle-loomed Japanese canvas. Features deep utilitarian cargo chest pockets, horn buttons, and reinforced elbow patches.',
    price: 6999.00,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 14,
    featured: true,
  },
  {
    name: 'Unstructured Relaxed Linen Chore Coat',
    description: 'Pre-washed Belgian flax linen tailored with soft dropped shoulders, patch pockets, and interior passport stash compartment.',
    price: 8999.00,
    originalPrice: 10999.00,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 8,
    featured: false,
  },
  {
    name: 'Goodyear Welted Suede Desert Boots',
    description: 'Supple snuff suede upper sourced from Charles F. Stead tannery, natural crepe rubber outsole, and fully rebuildable welted sole structure.',
    price: 11999.00,
    originalPrice: 14499.00,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 11,
    featured: false,
  },
  {
    name: 'Ribbed Merino Wool Watch Cap',
    description: 'Spun from extra-fine 19.5 micron Zque certified merino wool. Seamless circular knit that stays breathable across transitioning climates.',
    price: 1999.00,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 45,
    featured: false,
  },

  // --- Category: Home & Living ---
  {
    name: 'Hand-Thrown Speckled Stoneware Pour-Over',
    description: 'Slow-crafted on the pottery wheel using iron-flecked stoneware clay with an unglazed raw clay exterior and satin white food-safe interior.',
    price: 2499.00,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 20,
    featured: true,
  },
  {
    name: 'Double-Walled Borosilicate Glass Teapot',
    description: 'Heat-resistant borosilicate glass with removable ultra-fine micro-perforated stainless steel infuser basket and drip-free precision spout.',
    price: 2899.00,
    originalPrice: 3499.00,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 16,
    featured: false,
  },
  {
    name: 'Cast Iron Dutch Oven in Forest Enamel',
    description: 'Heavy gauge cast iron pot coated with durable matte vitreous enamel. Optimized moisture-retaining lid ridges for slow braising and artisan sourdough.',
    price: 7999.00,
    originalPrice: 9999.00,
    imageUrl: 'https://images.unsplash.com/photo-1584990347449-39b56f94770d?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 7,
    featured: false,
  },
  {
    name: 'Washed French Linen Bed Sheet Set (Ivory)',
    description: '100% certified Normandy flax softened through stone washing. Naturally thermo-regulating for cool summer nights and cozy winter warmth.',
    price: 9499.00,
    originalPrice: 11999.00,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 12,
    featured: false,
  },
  {
    name: 'Solid Brass Incense Burner & Tray',
    description: 'Precision milled solid brass burner designed for Japanese coreless incense sticks. Ages into an authentic, warm natural patina.',
    price: 1899.00,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 35,
    featured: false,
  },

  // --- Category: Carry & Accessories ---
  {
    name: 'Full Grain Vegetable-Tanned Leather Tote',
    description: 'Hand-stitched Tuscan vegetable-tanned harness leather with brass rivets, interior key leash, and dedicated 16-inch padded laptop partition.',
    price: 13999.00,
    originalPrice: 16499.00,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 10,
    featured: true,
  },
  {
    name: 'Waxed Canvas Commuter Daypack (Olive)',
    description: 'Water-repellent 18oz Scottish Martexin waxed cotton canvas, vegetable-tanned bridle leather straps, and heavy YKK Excella brass zippers.',
    price: 8999.00,
    originalPrice: 10499.00,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 17,
    featured: true,
  },
  {
    name: 'Minimalist Bifold Card Wallet',
    description: 'Ultra-slim Horween Chromexcel leather wallet with 6 card slots and central folded currency pocket. Glazed hand-burnished edges.',
    price: 2499.00,
    originalPrice: 2999.00,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 25,
    featured: false,
  },
  {
    name: 'Machined Brass Rollerball Pen',
    description: 'Well-balanced solid brass body that accommodates standard Schmidt and Pilot G2 ink refills. Smooth screw-on cap mechanism.',
    price: 2999.00,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 40,
    featured: false,
  },
  {
    name: 'Polarized Cellulose Acetate Sunglasses',
    description: 'Handcrafted Italian Mazzucchelli acetate frames fitted with scratch-resistant polarized mineral glass lenses offering 100% UV400 defense.',
    price: 6499.00,
    originalPrice: 7999.00,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 15,
    featured: false,
  },
];

async function main() {
  console.log('[Seed] Seeding database with initial records in Indian Rupees (INR)...');

  // 1. Create Default Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopease.com' },
    update: {
      name: 'ShopEase Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'ShopEase Admin',
      email: 'admin@shopease.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log(`[Seed] Admin user verified: ${admin.email} (password: Admin@12345)`);

  // 2. Create Default Customer User
  const customerPasswordHash = await bcrypt.hash('Customer@12345', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@shopease.com' },
    update: {
      name: 'Eleanor Vance',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
    create: {
      name: 'Eleanor Vance',
      email: 'customer@shopease.com',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });
  console.log(`[Seed] Demo customer verified: ${customer.email} (password: Customer@12345)`);

  // 3. Create Sample Delivery Address for customer
  const existingAddress = await prisma.address.findFirst({
    where: { userId: customer.id },
  });

  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customer.id,
        recipientName: 'Eleanor Vance',
        phone: '+91 98765 43210',
        addressLine: 'Flat 402, Lotus Residency, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        isDefault: true,
      },
    });
    console.log('[Seed] Customer default delivery address created.');
  }

  // 4. Create/Update Products
  console.log(`[Seed] Seeding ${sampleProducts.length} curated products...`);
  for (const prod of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { name: prod.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...prod,
          price: prod.price,
          originalPrice: prod.originalPrice,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          ...prod,
          price: prod.price,
          originalPrice: prod.originalPrice,
        },
      });
    }
  }

  // 5. Update or Seed Sample Historical Completed Order
  const existingOrder = await prisma.order.findFirst({
    where: { userId: customer.id },
  });

  if (!existingOrder) {
    const productsInDb = await prisma.product.findMany({ take: 2 });
    if (productsInDb.length >= 2) {
      const p1 = productsInDb[0];
      const p2 = productsInDb[1];
      const subtotal = Number(p1.price) + Number(p2.price);
      const shipping = subtotal >= 999 ? 0 : 99;
      const total = subtotal + shipping;

      await prisma.order.create({
        data: {
          orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          userId: customer.id,
          totalAmount: total,
          shippingAmount: shipping,
          status: 'DELIVERED',
          paymentMethod: 'Mock Card Payment',
          paymentStatus: 'PAID',
          shippingAddressSnapshot: {
            recipientName: 'Eleanor Vance',
            phone: '+91 98765 43210',
            addressLine: 'Flat 402, Lotus Residency, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560038',
          },
          items: {
            create: [
              {
                productId: p1.id,
                productName: p1.name,
                productImageUrl: p1.imageUrl,
                priceAtPurchase: p1.price,
                quantity: 1,
                subtotal: p1.price,
              },
              {
                productId: p2.id,
                productName: p2.name,
                productImageUrl: p2.imageUrl,
                priceAtPurchase: p2.price,
                quantity: 1,
                subtotal: p2.price,
              },
            ],
          },
        },
      });
      console.log('[Seed] Sample historical order created for Eleanor Vance.');
    }
  }

  console.log('[Seed] Database seeding finished successfully in Indian Rupees (INR)!');
}

main()
  .catch((e) => {
    console.error('[Seed] Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
