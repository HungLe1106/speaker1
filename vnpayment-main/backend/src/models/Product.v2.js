const Product = require('./ProductModel');

/**
 * Get all products with pagination and filtering
 */
async function getAllProducts(page = 1, limit = 12, category = null, search = null) {
  try {
    const query = { status: 'active' };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search in title and description
    if (search) {
      query.$text = { $search: search };
    }

    // Count total documents
    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated products
    const skip = (page - 1) * limit;
    let productsQuery = Product.find(query)
      .select('productId title desc price stock category img sold rating discount')
      .skip(skip)
      .limit(limit);

    // Sort by relevance if searching, otherwise by newest
    if (search) {
      productsQuery = productsQuery.sort({ score: { $meta: 'textScore' } });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const products = await productsQuery;

    // Transform to match old format
    const transformedProducts = products.map(p => ({
      id: p.productId,
      title: p.title,
      desc: p.desc,
      price: p.price,
      img: p.img,
      stock: p.stock,
      category: p.category,
      sold: p.sold,
      rating: p.rating?.average || 0,
      discount: p.discount || 0
    }));

    return {
      products: transformedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    console.error('getAllProducts error:', error);
    throw error;
  }
}

/**
 * Get product by ID (old format like "p1")
 */
async function getProductById(id) {
  try {
    const product = await Product.findOne({ productId: id });
    if (!product) {
      return null;
    }

    return {
      id: product.productId,
      title: product.title,
      desc: product.desc,
      price: product.price,
      img: product.img,
      images: product.images,
      stock: product.stock,
      category: product.category,
      sold: product.sold,
      rating: product.rating?.average || 0,
      ratingCount: product.rating?.count || 0,
      reviews: product.reviews,
      discount: product.discount || 0,
      brand: product.brand,
      specifications: product.specifications
    };
  } catch (error) {
    console.error('getProductById error:', error);
    return null;
  }
}

/**
 * Update product stock
 */
async function updateStock(id, quantity) {
  try {
    const product = await Product.findOne({ productId: id });
    if (!product) {
      return false;
    }

    if (product.stock < quantity) {
      return false;
    }

    product.stock -= quantity;
    product.sold += quantity;
    
    // Update status if out of stock
    if (product.stock === 0) {
      product.status = 'out_of_stock';
    }

    await product.save();
    return true;
  } catch (error) {
    console.error('updateStock error:', error);
    return false;
  }
}

/**
 * Check if products are in stock
 */
async function checkStock(items) {
  try {
    for (const item of items) {
      const product = await Product.findOne({ productId: item.id });
      
      if (!product || product.status !== 'active') {
        return {
          available: false,
          message: `Sản phẩm "${item.id}" không tồn tại hoặc không còn bán`,
          productId: item.id
        };
      }

      if (product.stock < item.qty) {
        return {
          available: false,
          message: `Sản phẩm "${product.title}" không đủ hàng (còn ${product.stock})`,
          productId: item.id
        };
      }
    }

    return { available: true };
  } catch (error) {
    console.error('checkStock error:', error);
    return {
      available: false,
      message: 'Lỗi kiểm tra tồn kho'
    };
  }
}

/**
 * Create new product (admin)
 */
async function createProduct(productData) {
  try {
    // Generate product ID
    const count = await Product.countDocuments();
    const productId = productData.productId || `p${count + 1}`;

    const product = new Product({
      ...productData,
      productId
    });

    await product.save();

    return {
      id: product.productId,
      title: product.title,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      category: product.category
    };
  } catch (error) {
    console.error('createProduct error:', error);
    throw error;
  }
}

/**
 * Update product (admin)
 */
async function updateProduct(id, updateData) {
  try {
    const product = await Product.findOne({ productId: id });
    if (!product) {
      throw new Error('Product not found');
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'productId') {
        product[key] = updateData[key];
      }
    });

    await product.save();

    return {
      id: product.productId,
      title: product.title,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      category: product.category
    };
  } catch (error) {
    console.error('updateProduct error:', error);
    throw error;
  }
}

/**
 * Delete product (admin)
 */
async function deleteProduct(id) {
  try {
    const product = await Product.findOne({ productId: id });
    if (!product) {
      throw new Error('Product not found');
    }

    // Soft delete - change status to inactive
    product.status = 'inactive';
    await product.save();

    return true;
  } catch (error) {
    console.error('deleteProduct error:', error);
    throw error;
  }
}

/**
 * Get product statistics
 */
async function getProductStats() {
  try {
    const totalProducts = await Product.countDocuments({ status: 'active' });
    const outOfStock = await Product.countDocuments({ status: 'out_of_stock' });
    const lowStock = await Product.countDocuments({ status: 'active', stock: { $lt: 10 } });

    const topSelling = await Product.find({ status: 'active' })
      .sort({ sold: -1 })
      .limit(5)
      .select('productId title sold');

    return {
      totalProducts,
      outOfStock,
      lowStock,
      topSelling: topSelling.map(p => ({
        id: p.productId,
        title: p.title,
        sold: p.sold
      }))
    };
  } catch (error) {
    console.error('getProductStats error:', error);
    return null;
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  updateStock,
  checkStock,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
};
