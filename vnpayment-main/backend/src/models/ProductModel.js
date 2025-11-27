const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: true,
    index: true,
    default: 'general'
  },
  img: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  sold: {
    type: Number,
    default: 0,
    min: 0
  },
  purchaseCount: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  specifications: {
    type: Map,
    of: String
  },
  tags: [String],
  brand: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ title: 'text', desc: 'text' }); // Full-text search
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, price: 1 }); // Brand filter
productSchema.index({ sold: -1 }); // Best sellers
productSchema.index({ 'rating.average': -1 }); // Top rated
productSchema.index({ featured: 1 });

// Virtual for discounted price
productSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Method to update rating
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = { average: 0, count: 0 };
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = {
      average: sum / this.reviews.length,
      count: this.reviews.length
    };
  }
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
