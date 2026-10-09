const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sampleProducts = [
  // --- Category: Vintage & Collectibles ---
  {
    name: 'Vintage 35mm Film Rangefinder Camera',
    description: 'Classic mechanical 35mm film rangefinder with manual shutter speed dial, f/2.0 coated glass lens, and authentic textured leatherette grip.',
    price: 1899.00,
    originalPrice: 2499.00,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 18,
    featured: true,
  },
  {
    name: 'Vintage Turntable Vinyl Record Player',
    description: 'Suitcase-style retro vinyl record player with belt-drive system, built-in stereo dynamic speakers, and brass corner protectors.',
    price: 2499.00,
    originalPrice: 3299.00,
    imageUrl: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 15,
    featured: true,
  },
  {
    name: 'Vintage Mechanical Skeleton Pocket Watch',
    description: 'Antique engraved brass casing with visible winding movement gear train, Roman numeral dial, and detachable 14-inch pocket fob chain.',
    price: 899.00,
    originalPrice: 1299.00,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 24,
    featured: true,
  },
  {
    name: 'Vintage Emerald Banker Desk Lamp',
    description: 'Iconic library banker lamp featuring solid antique brass construction, traditional bead pull-chain switch, and hand-blown emerald green glass shade.',
    price: 1199.00,
    originalPrice: 1699.00,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 14,
    featured: true,
  },
  {
    name: 'Vintage Portable Manual Typewriter',
    description: '1960s mechanical metal typewriter featuring crisp tactile key action, dual-color ink ribbon mechanism, and hard protective carrying case.',
    price: 2199.00,
    originalPrice: 2899.00,
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 10,
    featured: true,
  },
  {
    name: 'Vintage Brass Nautical Compass & Sundial',
    description: 'Solid antiqued brass directional magnetic compass paired with folding sundial latitude arm, housed in a polished rosewood presentation box.',
    price: 649.00,
    originalPrice: 999.00,
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 32,
    featured: false,
  },
  {
    name: 'Vintage Distressed Leather Satchel Bag',
    description: 'Handcrafted full-grain oiled saddle leather briefcase with antique bronze hardware, adjustable shoulder strap, and padded tablet partition.',
    price: 1599.00,
    originalPrice: 2199.00,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 20,
    featured: false,
  },
  {
    name: 'Vintage Gold-Nib Classic Fountain Pen',
    description: 'Hand-polished resin fountain pen fitted with an iridium-tipped gold-plated medium nib and screw-piston converter mechanism.',
    price: 599.00,
    originalPrice: 899.00,
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 35,
    featured: false,
  },
  {
    name: 'Vintage Twin-Bell Mechanical Alarm Clock',
    description: 'Retro mint green twin-bell alarm clock with authentic hammer bell chime, silent sweep quartz movement, and glow-in-the-dark numeral indicators.',
    price: 499.00,
    originalPrice: 749.00,
    imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 28,
    featured: false,
  },
  {
    name: 'Vintage Brass Extendable Spyglass Telescope',
    description: 'Three-draw collapsible pirate marine spyglass crafted from solid polished brass with hand-stitched leather protective casing.',
    price: 999.00,
    originalPrice: 1499.00,
    imageUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 16,
    featured: false,
  },
  {
    name: 'Vintage Copper Gooseneck Drip Kettle',
    description: 'Heavy gauge pure hammered copper stovetop water kettle with ergonomic solid walnut stay-cool handle and precision pouring spout.',
    price: 1099.00,
    originalPrice: 1599.00,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 22,
    featured: false,
  },
  {
    name: 'Vintage 1970s Gold Aviator Sunglasses',
    description: 'Timeless teardrop wire-rimmed sunglasses with military green polarized mineral glass lenses and tortoiseshell acetate temple tips.',
    price: 699.00,
    originalPrice: 999.00,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 25,
    featured: false,
  },
  {
    name: 'Vintage Deckle Edge Leather Bound Journal',
    description: '240 pages of tree-free recycled antique handmade deckle cotton paper wrapped in rustic full-grain buffalo hide with wrap-around tie strap.',
    price: 549.00,
    originalPrice: 799.00,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 40,
    featured: false,
  },
  {
    name: 'Vintage Portable Cassette Player & Radio',
    description: 'Retro 80s Walkman-style personal tape cassette player with built-in AM/FM tuner, external recording microphone, and retro foam headphones.',
    price: 1299.00,
    originalPrice: 1799.00,
    imageUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 15,
    featured: false,
  },
  {
    name: 'Vintage Brass Nautical Sand Hourglass',
    description: 'Solid brass gimbaled 30-minute rotating hourglass timer mounted on an engraved brass compass pedestal with natural white sand.',
    price: 599.00,
    originalPrice: 849.00,
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80',
    category: 'Vintage & Collectibles',
    stock: 26,
    featured: false,
  },

  // --- Category: Audio & Electronics (Price Reduced) ---
  {
    name: 'Acoustic Precision Studio Headphones',
    description: 'Closed-back reference monitor headphones crafted with machined aluminum yokes, beryllium drivers, and supple sheepskin ear cushions for fatigue-free listening.',
    price: 1499.00,
    originalPrice: 1999.00,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 24,
    featured: true,
  },
  {
    name: 'Cast Brass Tabletop Radio & Speaker',
    description: 'Analog FM tuner integrated with lossless Bluetooth 5.3 architecture. Enclosed within hand-finished acoustic birch ply with solid milled brass knobs.',
    price: 1199.00,
    originalPrice: 1599.00,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 12,
    featured: true,
  },
  {
    name: 'Tactile Mechanical Keypad (Oatmeal)',
    description: 'Compact 68-key mechanical keyboard featuring custom lubed tactile switches, dye-sub PBT keycaps, and a dampening silicone internal structure.',
    price: 899.00,
    originalPrice: 1299.00,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 18,
    featured: false,
  },
  {
    name: 'Minimalist Desk Lamp with Wireless Base',
    description: 'Dimmable warm 2700K LED task lamp with anodized aluminum gooseneck and integrated 15W Qi-certified induction charging stone base.',
    price: 649.00,
    originalPrice: 899.00,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 15,
    featured: false,
  },
  {
    name: 'Solid Walnut Dual Monitor Riser',
    description: 'Elevates dual screen setups to natural ergonomic height. Single-slab sustainable American walnut sealed with plant-based hardwax oil.',
    price: 799.00,
    originalPrice: 1099.00,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Electronics',
    stock: 9,
    featured: false,
  },

  // --- Category: Apparel & Footwear (Price Reduced) ---
  {
    name: 'Heavyweight Loopback French Terry Crewneck',
    description: '450 GSM organic combed cotton sweater knit slowly on vintage loopwheel machines. Ribbed side gussets and flatlock seam construction.',
    price: 599.00,
    originalPrice: 899.00,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 30,
    featured: true,
  },
  {
    name: 'Selvedge Cotton Utility Overshirt',
    description: 'Woven from 12oz shuttle-loomed Japanese canvas. Features deep utilitarian cargo chest pockets, horn buttons, and reinforced elbow patches.',
    price: 749.00,
    originalPrice: 999.00,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 14,
    featured: true,
  },
  {
    name: 'Unstructured Relaxed Linen Chore Coat',
    description: 'Pre-washed Belgian flax linen tailored with soft dropped shoulders, patch pockets, and interior passport stash compartment.',
    price: 899.00,
    originalPrice: 1299.00,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 8,
    featured: false,
  },
  {
    name: 'Goodyear Welted Suede Desert Boots',
    description: 'Supple snuff suede upper sourced from Charles F. Stead tannery, natural crepe rubber outsole, and fully rebuildable welted sole structure.',
    price: 1299.00,
    originalPrice: 1799.00,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 11,
    featured: false,
  },
  {
    name: 'Structured Heavyweight Pocket Tee (Sage)',
    description: '280 GSM heavyweight dry-hand organic jersey tee. Pre-shrunk with a durable bound ribbed collar and subtle bar-tacked chest pocket.',
    price: 399.00,
    originalPrice: 599.00,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel & Footwear',
    stock: 45,
    featured: false,
  },

  // --- Category: Home & Living (Price Reduced) ---
  {
    name: 'Artisan Brass & Walnut Pour-Over Stand',
    description: 'Precision brewing station combining hand-machined solid brass uprights with a chamfered American walnut base sealed against moisture.',
    price: 599.00,
    originalPrice: 849.00,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 16,
    featured: true,
  },
  {
    name: 'Hand-Thrown Speckled Ceramic Mug Set',
    description: 'Set of two 350ml stoneware mugs hand-thrown in Kyoto. Coated in a matte reactive feldspar glaze with raw unglazed foot detail.',
    price: 449.00,
    originalPrice: 699.00,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 22,
    featured: true,
  },
  {
    name: 'Waffle Knit Organic Wool Throw Blanket',
    description: 'Spun from 100% fine Merino wool in an airy three-dimensional waffle weave. Exceptional thermal warmth with zero scratchiness.',
    price: 699.00,
    originalPrice: 999.00,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 14,
    featured: false,
  },
  {
    name: 'French Washed Linen Table Runner (Oat)',
    description: 'Natural unbleached linen with subtle slub texture and hand-frayed edges. Adds tactile calm to everyday dining tables.',
    price: 349.00,
    originalPrice: 499.00,
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 25,
    featured: false,
  },
  {
    name: 'Architectural Cast Stoneware Planter',
    description: 'Fluted architectural cylindrical vessel with concealed drainage tray. Cast in concrete-stone composite with smooth sanded rim.',
    price: 399.00,
    originalPrice: 599.00,
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
    stock: 19,
    featured: false,
  },

  // --- Category: Carry & Accessories (Price Reduced) ---
  {
    name: 'Vegetable-Tanned Minimalist Card Holder',
    description: 'Precision cut from 1.5mm Italian Buttero leather. Holds up to six cards and folded currency with beveled and beeswax-burnished edges.',
    price: 399.00,
    originalPrice: 599.00,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 35,
    featured: true,
  },
  {
    name: 'Waxed Canvas & Bridle Leather Duffel',
    description: '38-liter travel holdall built with 18oz Scottish waxed cotton canvas, solid cast brass rivets, and storm-flap YKK two-way zipper.',
    price: 1399.00,
    originalPrice: 1899.00,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 12,
    featured: true,
  },
  {
    name: 'Solid Brass Hexagonal Rollerball Pen',
    description: 'CNC machined from a solid rod of untreated naval brass. Develops a personal natural patina over years of dedicated daily writing.',
    price: 499.00,
    originalPrice: 699.00,
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 28,
    featured: false,
  },
  {
    name: 'Moulded Leather Catchall Valet Tray',
    description: 'Wet-moulded single piece of bridle leather shaped with gently sloping walls. The ideal landing pad for keys, watch, and coins.',
    price: 349.00,
    originalPrice: 499.00,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 40,
    featured: false,
  },
  {
    name: 'Everyday Heavy Canvas Tote Bag',
    description: 'Constructed from durable 20oz duck canvas with reinforced cross-stitched handles, internal key clip, and zippered phone pouch.',
    price: 399.00,
    originalPrice: 599.00,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    category: 'Carry & Accessories',
    stock: 40,
    featured: false,
  },
  {
    name: 'Polarized Cellulose Acetate Sunglasses',
    description: 'Handcrafted Italian Mazzucchelli acetate frames fitted with scratch-resistant polarized mineral glass lenses offering 100% UV400 defense.',
    price: 649.00,
    originalPrice: 899.00,
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
          stock: prod.stock,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          ...prod,
          price: prod.price,
          originalPrice: prod.originalPrice,
          stock: prod.stock,
        },
      });
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
