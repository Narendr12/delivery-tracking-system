import express from 'express';
import { UserModel } from '../models/User';
import { OrderModel } from '../models/Order';
import { authorize } from '../middleware/auth';

const router = express.Router();

// Update delivery partner location
router.post('/update', authorize('delivery'), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      {
        currentLocation: {
          latitude,
          longitude,
          timestamp: new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the delivery partner has an active order, update the order's current location
    if (user.currentOrder) {
      await OrderModel.findByIdAndUpdate(user.currentOrder, {
        currentLocation: {
          latitude,
          longitude,
          timestamp: new Date()
        }
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Error updating location' });
  }
});

// Get delivery partner's current location
router.get('/:deliveryPartnerId', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.deliveryPartnerId)
      .select('currentLocation name');

    if (!user) {
      return res.status(404).json({ error: 'Delivery partner not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching location' });
  }
});

export default router; 