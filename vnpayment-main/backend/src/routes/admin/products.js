const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../../models/ProductModel'); // ✅ Changed to MongoDB model
const adminAuth = require('../../middleware/adminAuth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../public/uploads/products');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

// Apply admin authentication to all routes
router.use(adminAuth);

/**
 * GET /api/admin/products - Get all products (including inactive)
 * For admin management page
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform MongoDB format to match frontend expectations
    const transformedProducts = products.map(p => ({
      id: p.productId,
      title: p.title,
      desc: p.desc,
      price: p.price,
      stock: p.stock,
      category: p.category,
      img: p.img,
      images: p.images || [],
      discount: p.discount || 0,
      rating: p.rating?.average || 0,
      ratingCount: p.rating?.count || 0,
      sold: p.sold || 0,
      brand: p.brand,
      status: p.status
    }));
    
    res.json({
      success: true,
      data: {
        products: transformedProducts,
        total: transformedProducts.length
      },
      admin: req.user.username
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/admin/products - Create new product
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      desc,
      price,
      stock,
      category,
      img,
      images,
      brand,
      specifications,
      discount
    } = req.body;
    
    // Validate required fields
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        error: 'Title and price are required'
      });
    }
    
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be greater than 0'
      });
    }
    
    // Generate unique productId
    const productId = `p${Date.now()}`;
    
    const product = await Product.create({
      productId,
      title,
      desc: desc || '',
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category: category || brand || 'general',
      img: img || '/images/default-product.jpg',
      images: images || [],
      brand: brand || category || '',
      specifications: specifications || {},
      discount: parseInt(discount) || 0,
      status: 'active'
    });
    
    console.log(`Admin ${req.user.username} created product:`, product.productId);
    
    // Transform response to match frontend format
    const transformedProduct = {
      id: product.productId,
      title: product.title,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      category: product.category,
      img: product.img,
      images: product.images,
      discount: product.discount,
      brand: product.brand,
      status: product.status
    };
    
    res.status(201).json({
      success: true,
      data: { product: transformedProduct },
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/products/:id - Update product
 */
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    
    // Prevent updating productId
    delete updateData.productId;
    delete updateData.id;
    
    // Validate price if provided
    if (updateData.price !== undefined && updateData.price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be greater than 0'
      });
    }
    
    // Validate stock if provided
    if (updateData.stock !== undefined && updateData.stock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock cannot be negative'
      });
    }
    
    const product = await Product.findOneAndUpdate(
      { productId: productId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    console.log(`Admin ${req.user.username} updated product:`, productId);
    
    // Transform response
    const transformedProduct = {
      id: product.productId,
      title: product.title,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      category: product.category,
      img: product.img,
      images: product.images,
      discount: product.discount,
      brand: product.brand,
      status: product.status
    };
    
    res.json({
      success: true,
      data: { product: transformedProduct },
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/products/:id - Delete (soft delete) product
 */
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    const product = await Product.findOneAndDelete({ productId: productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    console.log(`Admin ${req.user.username} deleted product:`, productId);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/products/stats - Get product statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const products = Product.getAllProductsAdmin();
    
    const stats = {
      total: products.length,
      inStock: products.filter(p => p.stock > 0).length,
      outOfStock: products.filter(p => p.stock === 0).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      categories: {}
    };
    
    // Count by category
    products.forEach(p => {
      stats.categories[p.category] = (stats.categories[p.category] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PATCH /api/admin/products/:id/stock - Update stock only
 */
router.patch('/:id/stock', async (req, res) => {
  try {
    const productId = req.params.id;
    const { stock, action } = req.body; // action: 'set' | 'add' | 'subtract'
    
    if (stock === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Stock value is required'
      });
    }
    
    const product = Product.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    let newStock = parseInt(stock);
    if (action === 'add') {
      newStock = product.stock + parseInt(stock);
    } else if (action === 'subtract') {
      newStock = Math.max(0, product.stock - parseInt(stock));
    }
    
    const updated = Product.updateProduct(productId, { stock: newStock });
    
    console.log(`Admin ${req.user.username} updated stock for product ${productId}: ${product.stock} → ${newStock}`);
    
    res.json({
      success: true,
      data: { product: updated },
      message: 'Stock updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/admin/products/:id/images - Upload multiple images
 */
router.post('/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ productId: productId });
    
    if (!product) {
      // Delete uploaded files
      if (req.files) {
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }
    
    // Generate image URLs
    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
    
    // Add images to product using MongoDB $push
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      { $push: { images: { $each: imageUrls } } },
      { new: true }
    );
    
    console.log(`Admin ${req.user.username} uploaded ${req.files.length} images to product ${productId}`);
    
    res.json({
      success: true,
      data: {
        product: updatedProduct,
        uploadedImages: imageUrls
      },
      message: `Uploaded ${req.files.length} images successfully`
    });
  } catch (error) {
    console.error('Upload images error:', error);
    
    // Delete uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          console.error('Error deleting file:', e);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to upload images'
    });
  }
});

/**
 * POST /api/admin/products/:id/images/url - Add images by URL
 */
router.post('/:id/images/url', async (req, res) => {
  try {
    const productId = req.params.id;
    const { imageUrls } = req.body;
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Image URLs array is required'
      });
    }
    
    // Validate URLs
    const validUrls = imageUrls.filter(url => {
      if (typeof url !== 'string') return false;
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
    });
    
    if (validUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid URLs provided'
      });
    }
    
    // Find product
    const product = await Product.findOne({ productId: productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Add URLs to product images using MongoDB $push
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      { $push: { images: { $each: validUrls } } },
      { new: true }
    );
    
    console.log(`Admin ${req.user.username} added ${validUrls.length} URL images to product ${productId}`);
    
    res.json({
      success: true,
      data: {
        product: updatedProduct,
        addedImages: validUrls
      },
      message: `Added ${validUrls.length} images by URL successfully`
    });
  } catch (error) {
    console.error('Add URL images error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add images by URL'
    });
  }
});

/**
 * DELETE /api/admin/products/:id/images - Remove an image
 */
router.delete('/:id/images', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }
    
    console.log(`🗑️ Removing image: ${imageUrl} from product: ${req.params.id}`);
    
    // Find product by productId and remove image
    const product = await Product.findOne({ productId: req.params.id });
    
    if (!product) {
      console.log(`❌ Product not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Remove image from images array
    const originalLength = product.images.length;
    product.images = product.images.filter(img => img !== imageUrl);
    const newLength = product.images.length;
    
    console.log(`📊 Images before: ${originalLength}, after: ${newLength}`);
    
    if (originalLength === newLength) {
      return res.status(404).json({
        success: false,
        error: 'Image not found in product'
      });
    }
    
    // Save updated product
    await product.save();
    console.log(`✅ Product updated successfully`);
    
    // Try to delete physical file
    if (imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../../public', imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted file: ${filePath}`);
      }
    }
    
    console.log(`✅ Admin ${req.user.username} removed image from product ${req.params.id}`);
    
    res.json({
      success: true,
      data: { 
        product: {
          productId: product.productId,
          title: product.title,
          images: product.images
        }
      },
      message: 'Image removed successfully'
    });
  } catch (error) {
    console.error('❌ Remove image error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove image'
    });
  }
});

/**
 * PUT /api/admin/products/:id/main-image - Set main thumbnail
 */
router.put('/:id/main-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }
    
    const updatedProduct = Product.setMainImage(req.params.id, imageUrl);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    console.log(`Admin ${req.user.username} set main image for product ${req.params.id}`);
    
    res.json({
      success: true,
      data: { product: updatedProduct },
      message: 'Main image set successfully'
    });
  } catch (error) {
    console.error('Set main image error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set main image'
    });
  }
});

module.exports = router;
