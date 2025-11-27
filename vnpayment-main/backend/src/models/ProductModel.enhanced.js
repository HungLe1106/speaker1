// Enhanced Product Model with images[], discount, rating, sold count
const SAMPLE_PRODUCTS = [
  {
    id: "p1",
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
    discount: 10, // 10% discount
    rating: 4.5,
    ratingCount: 125,
    sold: 350,
    brand: "JBL",
    specifications: {
      "Công suất": "20W",
      "Thời lượng pin": "12 giờ",
      "Chống nước": "IP67"
    }
  },
  {
    id: "p2",
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
    discount: 15, // 15% discount
    rating: 4.8,
    ratingCount: 342,
    sold: 890,
    brand: "Sony"
  },
  {
    id: "p3",
    title: "Dàn âm thanh Sony HT-A7000",
    desc: "Soundbar 7.1.2 kênh, Dolby Atmos, công suất 500W",
    price: 17900000,
    img: "https://picsum.photos/seed/soundbar1/600/600",
    images: [
      "https://picsum.photos/seed/soundbar1/600/600"
    ],
    stock: 10,
    category: "home-audio",
    discount: 0,
    rating: 4.6,
    ratingCount: 89,
    sold: 156,
    brand: "Sony"
  }
];

// Product class with enhanced methods
class ProductModel {
  constructor() {
    this.products = [...SAMPLE_PRODUCTS];
  }

  // Get all products with filters
  getAll(filters = {}) {
    let result = [...this.products];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.desc.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      products: result.slice(startIndex, endIndex),
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit)
    };
  }

  // Get product by ID
  getById(id) {
    return this.products.find(p => p.id === id);
  }

  // Create new product
  create(productData) {
    const newProduct = {
      id: `p${Date.now()}`,
      ...productData,
      images: productData.images || [productData.img],
      discount: productData.discount || 0,
      rating: 0,
      ratingCount: 0,
      sold: 0,
      createdAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // Update product
  update(id, updates) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.products[index];
  }

  // Delete product
  delete(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  // Update stock
  updateStock(id, quantity) {
    const product = this.getById(id);
    if (!product || product.stock < quantity) return false;
    
    product.stock -= quantity;
    product.sold += quantity;
    return true;
  }

  // Calculate discounted price
  getDiscountedPrice(product) {
    if (!product.discount || product.discount === 0) {
      return product.price;
    }
    return Math.round(product.price * (1 - product.discount / 100));
  }

  // Check stock for multiple items
  checkStock(items) {
    for (const item of items) {
      const product = this.getById(item.id);
      if (!product) {
        return {
          available: false,
          message: `Sản phẩm ID ${item.id} không tồn tại`,
          productId: item.id
        };
      }
      if (product.stock < item.qty) {
        return {
          available: false,
          message: `Sản phẩm "${product.title}" không đủ hàng (Còn ${product.stock})`,
          productId: item.id
        };
      }
    }
    return { available: true };
  }
}

module.exports = new ProductModel();
