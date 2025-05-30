# Real-Time Delivery Tracking System

A real-time location tracking system for a multivendor marketplace platform, built with Next.js, Node.js, and MongoDB.

## Features

- Real-time location tracking using Socket.IO
- Role-based authentication (Vendor, Delivery Partner, Customer)
- Interactive maps with Leaflet.js
- Order management system
- Real-time notifications
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Socket.IO Client
- Leaflet.js
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication

## Prerequisites

- Node.js 18+
- MongoDB 6+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/delivery-tracking-system.git
cd delivery-tracking-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up environment variables:

Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/delivery-tracker
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

1. Start MongoDB:
   - Make sure MongoDB service is running
   - Create data directory: `C:\\data\\db` (Windows) or `/data/db` (Unix)

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd frontend
npm run dev
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Order Endpoints
- POST /api/orders - Create new order
- GET /api/orders/vendor - Get vendor orders
- GET /api/orders/delivery - Get delivery partner orders
- GET /api/orders/customer - Get customer orders
- PATCH /api/orders/:orderId/assign - Assign delivery partner
- PATCH /api/orders/:orderId/status - Update order status

### Location Endpoints
- POST /api/location/update - Update delivery partner location
- GET /api/location/:deliveryPartnerId - Get delivery partner location

## WebSocket Events

- `location-update` - Send location updates
- `track-order` - Start tracking an order
- `location-updated` - Receive location updates

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.  
