import express from 'express';
import { OrderModel } from '../models/Order';
import { UserModel } from '../models/User';
import { authorize } from '../middleware/auth';

const router = express.Router();

// Create a new order (Customer only)
router.post('/', authorize('customer'), async (req, res) => {
  try {
    const { vendorId, pickupLocation, deliveryLocation } = req.body;
    
    const order = new OrderModel({
      vendorId,
      customerId: req.userId,
      pickupLocation,
      deliveryLocation,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Error creating order' });
  }
});

// Get vendor's orders (Vendor only)
router.get('/vendor', authorize('vendor'), async (req, res) => {
  try {
    const orders = await OrderModel.find({ vendorId: req.userId })
      .populate('customerId', 'name')
      .populate('deliveryPartnerId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get delivery partner's orders (Delivery only)
router.get('/delivery', authorize('delivery'), async (req, res) => {
  try {
    const orders = await OrderModel.find({ deliveryPartnerId: req.userId })
      .populate('vendorId', 'name storeName')
      .populate('customerId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get customer's orders (Customer only)
router.get('/customer', authorize('customer'), async (req, res) => {
  try {
    const orders = await OrderModel.find({ customerId: req.userId })
      .populate('vendorId', 'name storeName')
      .populate('deliveryPartnerId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Assign delivery partner to order (Vendor only)
router.patch('/:orderId/assign', authorize('vendor'), async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    const order = await OrderModel.findOneAndUpdate(
      { _id: req.params.orderId, vendorId: req.userId },
      { 
        deliveryPartnerId,
        status: 'assigned'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update delivery partner's status
    await UserModel.findByIdAndUpdate(deliveryPartnerId, {
      currentOrder: order._id,
      isAvailable: false
    });

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Error assigning delivery partner' });
  }
});

// Update order status (Delivery only)
router.patch('/:orderId/status', authorize('delivery'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderModel.findOneAndUpdate(
      { _id: req.params.orderId, deliveryPartnerId: req.userId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'delivered') {
      // Free up the delivery partner
      await UserModel.findByIdAndUpdate(req.userId, {
        currentOrder: null,
        isAvailable: true,
        currentLocation: null
      });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Error updating order status' });
  }
});

// Get single order details (All authenticated users)
router.get('/:orderId', async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId)
      .populate('vendorId', 'name storeName')
      .populate('customerId', 'name')
      .populate('deliveryPartnerId', 'name currentLocation');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user has access to this order
    if (![
      order.vendorId._id.toString(),
      order.customerId._id.toString(),
      order.deliveryPartnerId?._id.toString()
    ].includes(req.userId)) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
});

export default router; 