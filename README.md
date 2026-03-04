# TagAlong - Ship Smarter

TagAlong is a peer-to-peer shipping platform that connects travelers with people who need to send parcels. Ship your items affordably, safely, and sustainably by leveraging existing travel routes.

## 🚀 Features

- **Trip Management**: Create and search for trips between locations
- **Parcel Requests**: Request travelers to carry your parcels
- **Real-time Chat**: Communicate with travelers/senders via encrypted messaging
- **Payment Integration**: Secure payments via Stripe
- **User Verification**: Aadhaar-based verification system
- **Admin Dashboard**: Analytics and management tools
- **File Uploads**: Secure document and image uploads

## 📋 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- React Router (Routing)
- Socket.IO Client (Real-time communication)
- Stripe React (Payments)
- GSAP (Animations)

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO (WebSocket server)
- Stripe (Payment processing)
- JWT (Authentication)
- Multer (File uploads)
- Tesseract.js (OCR for document verification)

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TagAlong-main
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your-jwt-secret-key
   ENCRYPTION_KEY=your-32-character-key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start Development Servers**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📦 Deployment

We've prepared comprehensive deployment guides for you:

### Quick Start (Recommended for Beginners)
👉 **[QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)** - Get deployed in ~20 minutes

### Comprehensive Guide
👉 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions

### Deployment Checklist
👉 **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist

### Recommended Deployment Stack

**For Quick Deployment:**
- **Frontend**: Vercel (Free tier available)
- **Backend**: Railway or Render (Free tier available)
- **Database**: MongoDB Atlas (Free tier available)

**For AWS Deployment (Student/Free Tier):**
- **Frontend**: AWS S3 + CloudFront (Free tier available)
- **Backend**: AWS EC2 t2.micro (Free tier - 750 hours/month)
- **Database**: MongoDB Atlas (Free tier available)
- 👉 **[AWS_QUICK_START.md](./AWS_QUICK_START.md)** - Step-by-step AWS deployment guide
- 👉 **[AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)** - Comprehensive AWS guide

**For Production/Scale:**
- **Frontend**: Vercel Pro or AWS CloudFront + S3
- **Backend**: AWS EC2, DigitalOcean, or Railway
- **Database**: MongoDB Atlas (Paid plans for better performance)
- **File Storage**: AWS S3 or Cloudinary

## 📁 Project Structure

```
TagAlong-main/
├── backend/
│   ├── src/
│   │   ├── app.js              # Main server file
│   │   ├── controllers/        # Route controllers
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Auth & validation
│   │   └── utils/              # Helper functions
│   ├── uploads/                # Uploaded files
│   ├── package.json
│   └── .env                    # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React contexts
│   │   ├── types/              # TypeScript types
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── .env                    # Environment variables
│
├── DEPLOYMENT_GUIDE.md         # Comprehensive deployment guide
├── QUICK_START_DEPLOYMENT.md   # Quick deployment guide
├── DEPLOYMENT_CHECKLIST.md     # Deployment checklist
└── README.md                   # This file
```

## 🔐 Environment Variables

### Backend (.env)
See `backend/env.example.txt` for all required variables.

Key variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `ENCRYPTION_KEY` - 32-character encryption key
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
See `frontend/env.example.txt` for all required variables.

Key variables:
- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_SOCKET_URL` - Socket.IO server URL

## 🧪 Testing

### Test Production Build Locally

```bash
# Build frontend
cd frontend
npm run build
npm run preview

# Test backend
cd ../backend
npm start
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Trips
- `GET /api/trip` - Get all trips
- `POST /api/trip` - Create trip
- `GET /api/trip/:id` - Get trip by ID
- `PUT /api/trip/:id` - Update trip
- `DELETE /api/trip/:id` - Delete trip

### Parcels
- `GET /api/parcel` - Get user parcels
- `POST /api/parcel` - Create parcel request
- `PUT /api/parcel/:id` - Update parcel status

### Payments
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/webhook` - Stripe webhook handler

### Chat
- Real-time via Socket.IO
- `GET /api/chat/:userId` - Get chat history

## 🐳 Docker Deployment

Docker files are included for containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d
```

See `Dockerfile.backend` and `Dockerfile.frontend` for individual container builds.

## 🔧 Configuration Files

- `backend/ecosystem.config.js` - PM2 configuration
- `backend/nginx.conf.example` - Nginx reverse proxy config
- `docker-compose.yml` - Docker Compose configuration
- `Dockerfile.backend` - Backend Docker image
- `Dockerfile.frontend` - Frontend Docker image

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Socket.IO Documentation](https://socket.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For deployment help, refer to:
- [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md) - Quick deployment guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Comprehensive guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Deployment checklist

## 🎯 Next Steps After Deployment

1. Set up custom domain
2. Configure SSL certificates
3. Set up monitoring and error tracking
4. Configure automated backups
5. Set up CI/CD pipeline
6. Optimize performance
7. Set up analytics

---

**Built with ❤️ for efficient and sustainable shipping**

