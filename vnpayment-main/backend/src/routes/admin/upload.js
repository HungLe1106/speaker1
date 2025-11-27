const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminAuth = require('../../middleware/adminAuth');

// Apply admin authentication
router.use(adminAuth);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../public/uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + uniqueSuffix + ext);
  }
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

/**
 * POST /api/admin/upload/product-image - Upload single product image
 */
router.post('/product-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Không có file được upload'
      });
    }

    // Return the public URL path
    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    console.log(`Admin ${req.user.username} uploaded image: ${imageUrl}`);

    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      message: 'Upload ảnh thành công'
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/admin/upload/product-images - Upload multiple product images
 */
router.post('/product-images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Không có file được upload'
      });
    }

    // Return array of public URL paths
    const imageUrls = req.files.map(file => ({
      url: `/uploads/products/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    console.log(`Admin ${req.user.username} uploaded ${req.files.length} images`);

    res.json({
      success: true,
      data: imageUrls,
      message: `Upload ${req.files.length} ảnh thành công`
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/upload/product-image - Delete product image
 */
router.delete('/product-image', (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Filename is required'
      });
    }

    // Security: only allow deleting from uploads/products folder
    const filepath = path.join(uploadDir, path.basename(filename));

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        error: 'File không tồn tại'
      });
    }

    fs.unlinkSync(filepath);

    console.log(`Admin ${req.user.username} deleted image: ${filename}`);

    res.json({
      success: true,
      message: 'Xóa ảnh thành công'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File quá lớn. Kích thước tối đa là 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next();
});

module.exports = router;
