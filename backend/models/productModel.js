import { Schema, model } from 'mongoose';

// Define the product schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  images: {
    type: [String], // Array of image URLs
    required: true,
  },
  ratings: {
    type: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for who rated the product
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      review: {
        type: String,
      },
    }],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = model('Product', productSchema);

export default Product;
