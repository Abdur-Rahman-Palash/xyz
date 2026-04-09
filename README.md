# XYZ - Notice & Event Management System

A full-stack production-ready web application built with Next.js (App Router), TypeScript, Tailwind CSS, and MongoDB for managing notices and events with an admin dashboard.

## 🚀 Features

### Public Features
- **Home Page**: Clean landing page with navigation to notices and events
- **Notices Page**: Browse and filter notices by category and priority
- **Events Page**: View upcoming and past events with filtering options
- **Responsive Design**: Mobile-first design using Tailwind CSS

### Admin Features
- **Secure Authentication**: JWT-based login system for admin users
- **Admin Dashboard**: Overview with statistics and quick actions
- **Notice Management**: Create, read, update, and delete notices
- **Event Management**: Complete CRUD operations for events
- **Protected Routes**: Middleware-based route protection
- **Real-time Statistics**: Dashboard with live data updates

### Technical Features
- **TypeScript**: Full type safety across the application
- **API Routes**: RESTful API with proper error handling
- **Database Integration**: MongoDB with Mongoose ODM
- **Environment Variables**: Secure configuration management
- **Reusable Components**: Modular UI component library
- **Toast Notifications**: User-friendly feedback system

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form
- **Utilities**: clsx, tailwind-merge

## 📁 Project Structure

```
xyz/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin routes
│   │   ├── dashboard/      # Admin dashboard
│   │   └── login/          # Admin login
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── notices/        # Notice CRUD endpoints
│   │   └── events/         # Event CRUD endpoints
│   ├── events/             # Public events pages
│   ├── notices/            # Public notices pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable UI components
│   └── ui/                # Base UI components
├── lib/                   # Utility libraries
│   ├── auth.ts             # Authentication utilities
│   ├── db.ts              # Database connection
│   └── utils.ts           # General utilities
├── models/                # Database models
│   ├── User.ts             # User model
│   ├── Notice.ts           # Notice model
│   └── Event.ts            # Event model
├── services/              # Business logic services
│   ├── noticeService.ts    # Notice service layer
│   └── eventService.ts     # Event service layer
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd xyz
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/xyz-app
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
   ```

4. **Start MongoDB**
   - For local MongoDB: `mongod`
   - Or use MongoDB Atlas for cloud hosting

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Authentication

#### POST `/api/auth/login`
Login an admin user and receive a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### POST `/api/auth/logout`
Logout the current user and clear the authentication cookie.

### Notices

#### GET `/api/notices`
Retrieve all notices with optional filtering.

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `category` (string): Filter by category
- `priority` (string): Filter by priority

**Response:**
```json
{
  "notices": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### POST `/api/notices`
Create a new notice (admin only).

**Request Body:**
```json
{
  "title": "Notice Title",
  "content": "Notice content",
  "category": "general",
  "priority": "medium",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### Events

#### GET `/api/events`
Retrieve all events with optional filtering.

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `type` (string): Filter by event type
- `status` (string): Filter by event status

#### POST `/api/events`
Create a new event (admin only).

**Request Body:**
```json
{
  "title": "Event Title",
  "description": "Event description",
  "type": "workshop",
  "startDate": "2024-12-01T10:00:00.000Z",
  "endDate": "2024-12-01T12:00:00.000Z",
  "location": "Conference Room A",
  "maxParticipants": 50,
  "isRegistrationRequired": true,
  "tags": ["workshop", "learning"]
}
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/xyz-app
JWT_SECRET=your-jwt-secret-key

# Optional
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### Database Setup

1. **Install MongoDB locally** or use MongoDB Atlas
2. **Create a database** named `xyz-app`
3. **Update the connection string** in `.env.local`

### Creating an Admin User

Currently, you'll need to create an admin user directly in the database. You can do this using MongoDB Compass or the MongoDB shell:

```javascript
// In MongoDB shell
use xyz-app
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$...", // Hashed password using bcrypt
  role: "admin"
})
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm run start
   ```

3. **Configure environment variables** on your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env.local`
   - Verify network connectivity

2. **Authentication Issues**
   - Clear browser cookies
   - Check JWT_SECRET is set
   - Verify admin user exists in database

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (18+ required)
   - Clear Next.js cache: `rm -rf .next`

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Create a new issue if you encounter a bug
- Join our community discussions

## 🎯 Roadmap

- [ ] User registration and authentication
- [ ] Email notifications for new notices/events
- [ ] File upload support for attachments
- [ ] Advanced search functionality
- [ ] Dark mode support
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Multi-language support

---

Built with ❤️ using Next.js and modern web technologies.
