import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  cakeSize: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large']
  },
  cakeFlavor: {
    type: String,
    required: true
  },
  cakeMessage: {
    type: String,
    trim: true
  },
  designOptions: {
    type: String,
    required: true
  },
  referenceImage: {
    type: String, // Path to the uploaded image
    required: false
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order; 