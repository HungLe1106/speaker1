require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const { connectDB } = require('../config/database');

const sampleProducts = [
  {
    productId: "p1",
    title: "Loa Bluetooth JBL Flip 6",
    desc: "Loa di động chống nước, pin 12 giờ, công suất 20W",
    price: 2290000,
    img: "https://picsum.photos/seed/speaker1/600/600",
    images: [
      "https://picsum.photos/seed/speaker1/600/600",
      "https://picsum.photos/seed/speaker1a/600/600",
      "https://picsum.photos/seed/speaker1b/600/600"
    ],
    stock: 50,
    category: "speakers",
    discount: 10,
    status: 'active',
    brand: 'JBL',
    sold: 350
  },
  {
    productId: "p2",
    title: "Tai nghe Sony WH-1000XM4",
    desc: "Tai nghe chống ồn cao cấp, Bluetooth 5.0, pin 30 giờ",
    price: 5600000,
    img: "https://picsum.photos/seed/headphone1/600/600",
    images: [
      "https://picsum.photos/seed/headphone1/600/600",
      "https://picsum.photos/seed/headphone1a/600/600"
    ],
    stock: 25,
    category: "headphones",
    discount: 15,
    status: 'active',
    brand: 'Sony',
    sold: 180
  },
  {
    productId: "p3",
    title: "Dàn âm thanh Sony HT-A7000",
    desc: "Soundbar 7.1.2 kênh, Dolby Atmos, công suất 500W",
    price: 17900000,
    img: "https://picsum.photos/seed/soundbar1/600/600",
    images: [
      "https://picsum.photos/seed/soundbar1/600/600"
    ],
    stock: 10,
    category: "home-audio",
    discount: 5,
    status: 'active',
    brand: 'Sony',
    sold: 45
  },
  {
    productId: "p4",
    title: "Loa Karaoke JBL PartyBox 310",
    desc: "Loa di động công suất lớn, đèn LED, pin 18 giờ",
    price: 11990000,
    img: "https://picsum.photos/seed/party1/600/600",
    images: [
      "https://picsum.photos/seed/party1/600/600"
    ],
    stock: 15,
    category: "karaoke",
    discount: 8,
    status: 'active',
    brand: 'JBL',
    sold: 92
  },
  {
    productId: "p5",
    title: "Guitar Acoustic Yamaha FG800",
    desc: "Đàn guitar acoustic dáng dreadnought, gỗ spruce nguyên tấm",
    price: 4500000,
    img: "https://picsum.photos/seed/guitar1/600/600",
    images: [
      "https://picsum.photos/seed/guitar1/600/600",
      "https://picsum.photos/seed/guitar1a/600/600"
    ],
    stock: 15,
    category: "instruments",
    discount: 0,
    status: 'active',
    brand: 'Yamaha',
    sold: 68
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Starting seed process...\n');
    
    await connectDB();
    
    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing products\n`);
    
    // Insert sample data
    const insertResult = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${insertResult.length} products successfully!\n`);
    
    // Display seeded products
    console.log('📦 Seeded Products:');
    insertResult.forEach(p => {
      console.log(`  - ${p.productId}: ${p.title} (${p.stock} in stock)`);
    });
    
    console.log('\n✨ Seed complete! You can now view products in admin panel.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedProducts();
