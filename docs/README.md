# Quick Bite API - Documentation

## 📚 Documentation Index

### Authentication

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Complete JWT authentication system documentation
  - API endpoints and specifications
  - Security features
  - Setup instructions
  - Usage examples
  - Troubleshooting guide

### Migration

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guide for migrating from static token to JWT
  - Step-by-step migration process
  - Frontend integration examples
  - Testing checklist
  - Common issues and solutions
  - Rollback plan

## 🚀 Quick Start

### 1. Set Up Authentication

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 3. Add JWT_SECRET to .env
echo "JWT_SECRET=<your-generated-secret>" >> .env

# 4. Seed admin users
pnpm run seed:admin

# 5. Start the server
pnpm run dev
```

### 2. Test Authentication

**Login:**

```bash
curl -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

**Use Token:**

```bash
curl -X GET http://localhost:3001/api/admin/orders \
  -H "Authorization: Bearer <your-token>"
```

### 3. Import Postman Collection

Import `Quick-Bite-API-Authentication.postman_collection.json` to test all endpoints.

## 🔐 Default Credentials

**Admin:**

- Username: `admin`
- Password: `Admin123!`
- Role: `admin` (full access)

**Kitchen Staff:**

- Username: `kitchen`
- Password: `Kitchen123!`
- Role: `kitchen-staff` (limited access)

⚠️ **Change these passwords in production!**

## 📊 API Endpoints Summary

### Public Endpoints

- `POST /api/auth/admin/login` - Admin login

### Protected Endpoints (JWT Required)

- `GET /api/auth/admin/me` - Get current user
- `GET /api/admin/orders` - List orders (all roles)
- `PATCH /api/admin/orders/:id/status` - Update order (all roles)
- `GET /api/admin/menu` - List menu (admin only)
- `POST /api/admin/menu` - Create menu item (admin only)
- `PATCH /api/admin/menu/:id` - Update menu item (admin only)
- `DELETE /api/admin/menu/:id` - Delete menu item (admin only)
- `GET /api/admin/inventory` - List inventory (admin only)
- `PATCH /api/admin/inventory/:id` - Update stock (admin only)
- `GET /api/admin/analytics/dashboard` - Dashboard analytics (admin only)

## 🛡️ Security Features

- ✅ JWT token authentication (HS256)
- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ Rate limiting on login (5 attempts per 15 minutes)
- ✅ Role-based access control (RBAC)
- ✅ Token expiration (8 hours)
- ✅ Audit logging
- ✅ Request validation

## 🔧 Environment Variables

Required variables:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/quick-bite-api

# Authentication
JWT_SECRET=<64-character-secret-key>

# Business (optional)
TAX_RATE=0.08
SERVICE_FEE_RATE=0.05
SESSION_TIMEOUT_MINUTES=120
```

## 📦 Project Structure

```
src/
├── controllers/
│   ├── authController.ts           # Login, get current user
│   ├── adminOrderController.ts     # Order management
│   ├── adminMenuController.ts      # Menu management
│   ├── adminInventoryController.ts # Inventory management
│   └── adminAnalyticsController.ts # Analytics
├── middleware/
│   ├── authMiddleware.ts           # JWT validation & RBAC
│   └── errorHandler.ts             # Error handling
├── models/
│   ├── AdminUser.ts                # Admin user schema
│   ├── Order.ts                    # Order schema
│   ├── MenuItem.ts                 # Menu item schema
│   └── Session.ts                  # Session schema
├── routes/
│   ├── authRoutes.ts               # Auth endpoints
│   ├── adminRoutes.ts              # Admin endpoints
│   └── ...                         # Other routes
├── scripts/
│   ├── seedAdminUsers.ts           # Seed admin users
│   └── seedMenu.ts                 # Seed menu items
└── utils/
    ├── jwtUtils.ts                 # JWT helper functions
    └── billCalculator.ts           # Bill calculations
```

## 🧪 Testing

### Manual Testing

1. Import Postman collection
2. Run login request
3. Token is automatically saved
4. Test protected endpoints

### Automated Testing

```bash
# Run TypeScript compilation
pnpm run build

# Check for errors
pnpm run dev
```

## 🐛 Troubleshooting

### Token Issues

- **Invalid token:** Check JWT_SECRET is set correctly
- **Token expired:** Login again (tokens expire after 8 hours)
- **No token:** Include `Authorization: Bearer <token>` header

### Permission Issues

- **403 Forbidden:** User role doesn't have access to endpoint
- **401 Unauthorized:** Token is missing, invalid, or expired

### Login Issues

- **Rate limit:** Wait 15 minutes after 5 failed attempts
- **Invalid credentials:** Check username/password
- **Account disabled:** Contact administrator

## 📞 Support

For questions or issues:

1. Check documentation in `docs/`
2. Review error logs in console
3. Test with Postman collection
4. Contact development team

## 🎯 Next Steps

After setup:

1. ✅ Change default passwords
2. ✅ Generate secure JWT_SECRET
3. ✅ Test all endpoints
4. ✅ Update frontend integration
5. ✅ Enable HTTPS in production
6. ✅ Set up monitoring
7. ⏳ Implement token refresh (optional)
8. ⏳ Add password reset (optional)

## 📝 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/) - JWT debugger
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

**Last Updated:** December 1, 2025
**Version:** 1.0.0
**Maintained by:** Quick Bite Development Team
