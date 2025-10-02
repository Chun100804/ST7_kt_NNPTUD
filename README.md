# User & Role Management API

Ứng dụng Node.js quản lý User và Role sử dụng Express, MongoDB và Mongoose.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình môi trường:
- Copy file `config.env` và cập nhật các thông tin cần thiết
- Đảm bảo MongoDB đang chạy

3. Chạy ứng dụng:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### User APIs

#### Lấy tất cả users
- **GET** `/api/users`
- **Query params**: `username`, `fullName` (filter theo regex)
- **Response**: Danh sách users (không bao gồm password)

#### Lấy user theo ID
- **GET** `/api/users/:id`
- **Response**: Thông tin user

#### Lấy user theo username
- **GET** `/api/users/username/:username`
- **Response**: Thông tin user

#### Tạo user mới
- **POST** `/api/users`
- **Body**:
```json
{
  "username": "string (required, unique)",
  "password": "string (required)",
  "email": "string (required, unique)",
  "fullName": "string (optional)",
  "avatarUrl": "string (optional)",
  "role": "ObjectId (required)"
}
```

#### Cập nhật user
- **PUT** `/api/users/:id`
- **Body**: Các field cần cập nhật

#### Xóa user (soft delete)
- **DELETE** `/api/users/:id`

#### Kích hoạt user
- **POST** `/api/users/activate`
- **Body**:
```json
{
  "email": "string (required)",
  "username": "string (required)"
}
```

### Role APIs

#### Lấy tất cả roles
- **GET** `/api/roles`
- **Response**: Danh sách roles

#### Lấy role theo ID
- **GET** `/api/roles/:id`
- **Response**: Thông tin role

#### Tạo role mới
- **POST** `/api/roles`
- **Body**:
```json
{
  "name": "string (required, unique)",
  "description": "string (optional)"
}
```

#### Cập nhật role
- **PUT** `/api/roles/:id`
- **Body**: Các field cần cập nhật

#### Xóa role (soft delete)
- **DELETE** `/api/roles/:id`

## Response Format

Tất cả API đều trả về JSON với format:

```json
{
  "status": "success|error",
  "message": "string",
  "data": "object|array (optional)",
  "error": "string (optional)"
}
```

## Models

### User Schema
- `username`: String (unique, required)
- `password`: String (required, hashed)
- `email`: String (unique, required)
- `fullName`: String (default: "")
- `avatarUrl`: String (default: "")
- `status`: Boolean (default: false)
- `role`: ObjectId -> Role (required)
- `loginCount`: Number (default: 0, min: 0)
- `isDelete`: Boolean (default: false)
- `timestamp`: Date (default: Date.now)

### Role Schema
- `name`: String (unique, required)
- `description`: String (default: "")
- `isDelete`: Boolean (default: false)
- `timestamp`: Date (default: Date.now)

## Health Check

- **GET** `/health` - Kiểm tra trạng thái server