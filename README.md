# 🛒 VNPayment - E-commerce Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)

**Hệ thống E-commerce hoàn chỉnh với tích hợp thanh toán MoMo & VNPay**

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [Chạy dự án](#-chạy-dự-án)
- [API Endpoints](#-api-endpoints)
- [Admin Panel](#-admin-panel)
- [Testing](#-testing)
- [Demo Credentials](#-demo-credentials)

---

## 🎯 Giới thiệu

VNPayment là một hệ thống E-commerce hoàn chỉnh được xây dựng với kiến trúc MERN Stack (MongoDB, Express, React, Node.js). Hệ thống hỗ trợ đầy đủ các tính năng mua bán online bao gồm:

- Quản lý sản phẩm với hỗ trợ hình ảnh (upload và URL)
- Giỏ hàng và checkout
- Thanh toán qua MoMo và VNPay
- Admin panel quản lý đơn hàng và sản phẩm
- Chat real-time với Socket.IO
- Responsive design cho mobile

---

## ✨ Tính năng

### 🛍️ Khách hàng (Frontend)
- ✅ Xem danh sách sản phẩm với bộ lọc (giá, thương hiệu, danh mục)
- ✅ Tìm kiếm sản phẩm
- ✅ Giỏ hàng (thêm, sửa, xóa)
- ✅ Checkout với thông tin khách hàng
- ✅ Thanh toán qua MoMo eWallet
- ✅ Thanh toán qua VNPay
- ✅ Theo dõi trạng thái đơn hàng
- ✅ Chat real-time với shop

### 🔧 Quản trị (Admin Panel)
- ✅ Dashboard tổng quan
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Upload hình ảnh sản phẩm
- ✅ Hỗ trợ URL hình ảnh từ bên ngoài
- ✅ Quản lý đơn hàng
- ✅ Thống kê doanh thu
- ✅ Best-seller products

### 💳 Thanh toán
- ✅ MoMo eWallet (Sandbox)
- ✅ VNPay
- ✅ Webhook xử lý callback
- ✅ Xác thực signature
- ✅ Auto-retry khi timeout

### 🔐 Bảo mật
- ✅ JWT Authentication
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Input validation

---

## 🛠️ Công nghệ sử dụng

### Backend
| Package | Version | Mô tả |
|---------|---------|-------|
| Express | 4.18.x | Web framework |
| MongoDB/Mongoose | 8.0.x | Database |
| Socket.IO | 4.8.x | Real-time communication |
| JWT | 9.0.x | Authentication |
| Multer | 2.0.x | File upload |
| Helmet | 7.1.x | Security headers |

### Frontend
| Package | Version | Mô tả |
|---------|---------|-------|
| React | 18.2.x | UI Library |
| React Router | 6.20.x | Routing |
| Axios | 1.6.x | HTTP Client |
| Socket.IO Client | 4.8.x | Real-time client |
| React Toastify | 9.1.x | Notifications |

---

## 📁 Cấu trúc dự án

```
speaker1/
├── vnpayment-main/
│   ├── backend/                  # Node.js API Server
│   │   ├── src/
│   │   │   ├── config/          # Database & app config
│   │   │   ├── data/            # Seed data
│   │   │   ├── middleware/      # Auth, validation middleware
│   │   │   ├── models/          # Mongoose models
│   │   │   ├── routes/          # API routes
│   │   │   │   ├── admin/       # Admin routes
│   │   │   │   ├── products.js
│   │   │   │   ├── orders.js
│   │   │   │   ├── payment.js
│   │   │   │   └── webhooks.js
│   │   │   ├── services/        # Business logic
│   │   │   │   ├── MoMoPaymentService.js
│   │   │   │   ├── VNPayService.js
│   │   │   │   └── ChatService.js
│   │   │   └── server.js        # Entry point
│   │   ├── public/
│   │   │   ├── admin/           # Admin panel HTML
│   │   │   └── uploads/         # Uploaded images
│   │   └── package.json
│   │
│   └── frontend/                 # React Application
│       ├── src/
│       │   ├── components/      # Reusable components
│       │   ├── contexts/        # React Context (Cart, Auth)
│       │   ├── pages/           # Page components
│       │   ├── services/        # API services
│       │   └── utils/           # Helpers
│       ├── public/
│       └── package.json
│
├── golocal-frontend/            # Secondary frontend (Tailwind)
│
├── .gitignore
└── README.md
```

---

## 🚀 Cài đặt

### Yêu cầu hệ thống
- **Node.js** >= 16.0.0
- **MongoDB** >= 6.0 (local hoặc MongoDB Atlas)
- **npm** hoặc **yarn**

### 1. Clone repository
```bash
git clone <repository-url>
cd speaker1
```

### 2. Cài đặt dependencies

#### Backend
```bash
cd vnpayment-main/backend
npm install
```

#### Frontend
```bash
cd vnpayment-main/frontend
npm install
```

### 3. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `vnpayment-main/backend`:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/vnpayment

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# MoMo Sandbox
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

# VNPay (nếu sử dụng)
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret

# CORS
FRONTEND_URL=http://localhost:3000
```

---

## ▶️ Chạy dự án

### Phương pháp 1: Chạy thủ công

#### Terminal 1 - Backend
```bash
cd vnpayment-main/backend
npm start
# hoặc chế độ development
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd vnpayment-main/frontend
npm start
```

### Phương pháp 2: Chạy nhanh (Windows)

```powershell
# Backend
D:
cd "D:\speaker1\speaker1\vnpayment-main\backend"
npm start

# Frontend (new terminal)
D:
cd "D:\speaker1\speaker1\vnpayment-main\frontend"
npm start
```

### URLs sau khi chạy
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| Admin Panel | http://localhost:5001/admin |
| Health Check | http://localhost:5001/health |

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check |
| GET | `/api/products` | Danh sách sản phẩm |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| POST | `/api/orders` | Tạo đơn hàng |
| GET | `/api/orders/:id` | Chi tiết đơn hàng |

### Payment Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/payment/methods` | Các phương thức thanh toán |
| POST | `/api/payment/create` | Tạo URL thanh toán |
| GET | `/api/payment/status/:orderId` | Trạng thái thanh toán |
| POST | `/api/webhooks/momo` | MoMo IPN callback |
| GET | `/api/webhooks/momo` | MoMo return URL |

### Admin Endpoints (Protected)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/dashboard` | Thống kê tổng quan |
| GET | `/api/admin/products` | Danh sách sản phẩm |
| POST | `/api/admin/products` | Thêm sản phẩm |
| PUT | `/api/admin/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/admin/products/:id` | Xóa sản phẩm |
| POST | `/api/admin/upload` | Upload hình ảnh |

---

## 🔑 Admin Panel

### Truy cập
1. Mở trình duyệt: http://localhost:5001/admin
2. Đăng nhập với tài khoản admin

### Tính năng
- **Dashboard**: Tổng quan doanh thu, đơn hàng, sản phẩm bán chạy
- **Products**: Quản lý CRUD sản phẩm
- **Orders**: Xem và cập nhật trạng thái đơn hàng

---

## 🧪 Testing

### Test API với cURL

```bash
# Health check
curl http://localhost:5001/health

# Lấy danh sách sản phẩm
curl http://localhost:5001/api/products

# Tạo đơn hàng test
curl -X POST http://localhost:5001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "0123456789",
      "address": "123 Test Street"
    },
    "items": [{"id": "product-id", "qty": 1}]
  }'
```

### Test Payment Flow
1. Thêm sản phẩm vào giỏ hàng
2. Checkout và nhập thông tin
3. Chọn phương thức thanh toán (MoMo/VNPay)
4. Hoàn tất thanh toán trên sandbox
5. Kiểm tra callback và trạng thái đơn hàng

---

## 🔐 Demo Credentials

### MoMo Sandbox
```
Partner Code: MOMO
Access Key: F8BBA842ECF85
Secret Key: K951B6PE1waDMi640xX08PD3vg6EkVlz
```

### Admin Panel
```
Tạo tài khoản admin qua API hoặc seed data
```

---

## 📝 Ghi chú phát triển

### Khi deploy production cần:
1. Đổi `NODE_ENV=production`
2. Cập nhật các secret keys
3. Cấu hình SSL/HTTPS
4. Sử dụng MongoDB Atlas hoặc production database
5. Cấu hình reverse proxy (Nginx)
6. Setup monitoring và logging

### Troubleshooting phổ biến:
- **Port đã sử dụng**: Server tự động thử port tiếp theo (5001, 5002...)
- **MongoDB connection**: Kiểm tra MongoDB đang chạy và URI đúng
- **CORS error**: Kiểm tra `FRONTEND_URL` trong `.env`

---

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<div align="center">

**Made with ❤️ by VNPayment Team**

</div>
