/**
 * Migration Script: Import existing data to MongoDB
 * 
 * This script will:
 * 1. Connect to MongoDB
 * 2. Import users from users.json
 * 3. Import products from Product.js (PRODUCTS array)
 * 4. Create default accounts if needed
 */

require('dotenv').config(); // Load .env file

const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');
const path = require('path');
const fs = require('fs');

// Import existing products data
const PRODUCTS = [
  {
    id: "p1",
    title: "Loa Bluetooth JBL Flip 6",
    desc: "Loa di động chống nước, pin 12 giờ, công suất 20W",
    price: 2290000,
    img: "https://picsum.photos/seed/speaker1/600/600",
    stock: 50,
    category: "speakers",
  },
  {
    id: "p19",
    title: "Guitar Acoustic Yamaha FG800",
    desc: "Đàn guitar acoustic dáng dreadnought, gỗ spruce nguyên tấm",
    price: 4500000,
    img: "https://picsum.photos/seed/guitar1/600/600",
    stock: 15,
    category: "instruments",
  },
  {
    id: "p20",
    title: "Keyboard Roland JUNO-DS88",
    desc: "Đàn synthesizer 88 phím có trọng lượng, 1200 âm sắc",
    price: 29900000,
    img: "https://picsum.photos/seed/keyboard1/600/600",
    stock: 5,
    category: "instruments",
  },
  {
    id: "p21",
    title: "Trống điện tử Roland TD-17KVX",
    desc: "Bộ trống điện tử cao cấp, cảm biến lưới, âm thanh thực",
    price: 35900000,
    img: "/images/qr_hop_le.png",
    stock: 3,
    category: "instruments",
  },
  {
    id: "p22",
    title: "Pioneer DDJ-1000SRT",
    desc: "Bàn DJ controller chuyên nghiệp cho Serato DJ Pro",
    price: 32900000,
    img: "https://picsum.photos/seed/dj1/600/600",
    stock: 6,
    category: "pro-audio",
  },
  // Add more products here... (abbreviated for brevity)
];

async function migrateUsers() {
  console.log('\n📝 Migrating Users...');
  
  try {
    // Read existing users.json if exists
    const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
    
    if (fs.existsSync(usersFilePath)) {
      const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
      
      for (const userData of usersData) {
        // Check if user already exists
        const existingUser = await User.findOne({ username: userData.username });
        
        if (!existingUser) {
          const user = new User({
            username: userData.username,
            salt: userData.salt,
            hash: userData.hash,
            role: userData.role || 'user',
            status: 'active'
          });
          
          await user.save();
          console.log(`  ✅ Migrated user: ${userData.username}`);
        } else {
          console.log(`  ⏭️  User already exists: ${userData.username}`);
        }
      }
      
      console.log(`✅ Users migration completed!`);
    } else {
      console.log('  ⚠️  users.json not found, creating default accounts...');
      
      // Create default accounts
      const salt1 = User.generateSalt();
      const hash1 = User.hashPassword('adminpass', salt1);
      await User.create({
        username: 'admin',
        salt: salt1,
        hash: hash1,
        role: 'admin',
        status: 'active'
      });
      console.log('  ✅ Created admin account (username: admin, password: adminpass)');
      
      const salt2 = User.generateSalt();
      const hash2 = User.hashPassword('userpass', salt2);
      await User.create({
        username: 'user',
        salt: salt2,
        hash: hash2,
        role: 'user',
        status: 'active'
      });
      console.log('  ✅ Created user account (username: user, password: userpass)');
    }
  } catch (error) {
    console.error('❌ Error migrating users:', error.message);
    throw error;
  }
}

async function migrateProducts() {
  console.log('\n📦 Migrating Products...');
  
  try {
    // Check if products already exist
    const existingCount = await Product.countDocuments();
    
    if (existingCount > 0) {
      console.log(`  ⚠️  ${existingCount} products already exist. Skipping...`);
      return;
    }
    
    // Import all products
    for (const productData of PRODUCTS) {
      const product = new Product({
        productId: productData.id,
        title: productData.title,
        desc: productData.desc,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        img: productData.img,
        images: [productData.img],
        sold: 0,
        status: 'active',
        featured: false,
        discount: 0
      });
      
      await product.save();
      console.log(`  ✅ Migrated product: ${productData.title}`);
    }
    
    console.log(`✅ Products migration completed! (${PRODUCTS.length} products)`);
  } catch (error) {
    console.error('❌ Error migrating products:', error.message);
    throw error;
  }
}

async function runMigration() {
  console.log('🚀 Starting MongoDB Migration...\n');
  console.log('=' .repeat(50));
  
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Run migrations
    await migrateUsers();
    await migrateProducts();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Database Statistics:');
    
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    console.log(`  👥 Users: ${userCount}`);
    console.log(`  📦 Products: ${productCount}`);
    console.log(`  🛒 Orders: ${orderCount}`);
    
    console.log('\n🎉 Your database is ready to use!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await disconnectDB();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration, migrateUsers, migrateProducts };
