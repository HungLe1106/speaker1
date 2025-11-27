require('dotenv').config();
const { connectDB } = require('../config/database');
const Product = require('../models/ProductModel');

/**
 * Add discount to some products for testing
 */
async function addDiscountToProducts() {
  console.log('🏷️  Adding discount to products...\n');
  
  try {
    await connectDB();
    
    // Get all products
    const products = await Product.find({ status: 'active' }).limit(5);
    
    if (products.length === 0) {
      console.log('❌ No products found. Please run migration first.');
      process.exit(1);
    }
    
    console.log(`Found ${products.length} products. Adding discounts...\n`);
    
    // Add different discount levels
    const discounts = [23, 15, 30, 10, 45];
    
    for (let i = 0; i < Math.min(products.length, discounts.length); i++) {
      const product = products[i];
      const discount = discounts[i];
      
      // Update originalPrice and discount
      product.originalPrice = product.price;
      product.discount = discount;
      
      await product.save();
      
      const finalPrice = Math.round(product.price * (1 - discount / 100));
      const savings = product.price - finalPrice;
      
      console.log(`✅ ${product.productId}: ${product.title}`);
      console.log(`   Giá gốc: ${product.price.toLocaleString('vi-VN')} ₫`);
      console.log(`   Giảm giá: -${discount}%`);
      console.log(`   Giá sau giảm: ${finalPrice.toLocaleString('vi-VN')} ₫`);
      console.log(`   Tiết kiệm: ${savings.toLocaleString('vi-VN')} ₫\n`);
    }
    
    console.log('✅ Discount added successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Total products with discount: ${discounts.length}`);
    console.log(`   Discount range: ${Math.min(...discounts)}% - ${Math.max(...discounts)}%`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding discount:', error);
    process.exit(1);
  }
}

// Run the script
addDiscountToProducts();
