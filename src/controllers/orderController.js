import Order from '../models/Order.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      referenceImage: req.file ? `/uploads/${req.file.filename}` : undefined
    };
    
    const order = new Order(orderData);
    await order.save();
    
    const transformedOrder = {
      ...order.toObject(),
      id: order._id
    };
    
    res.status(201).json({
      success: true,
      data: transformedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all orders (for admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      id: order._id
    }));
    res.status(200).json({
      success: true,
      count: orders.length,
      data: transformedOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const transformedOrder = {
      ...order.toObject(),
      id: order._id
    };

    res.status(200).json({
      success: true,
      data: transformedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update order status (for admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const transformedOrder = {
      ...order.toObject(),
      id: order._id
    };

    res.status(200).json({
      success: true,
      data: transformedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete order (for admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 