# Blog Backend - درخواست HTTP

> این فایل شامل نمونه‌های درخواست HTTP برای تمام endpoints است.

## Base URL

```
http://localhost:3000/api
```

## Headers

```http
Content-Type: application/json
```

## Users Endpoints

### ✅ Get All Users

```http
GET /users HTTP/1.1
Host: localhost:3000
```

**Query Parameters:**
```
?page=1&limit=10
```

### ✅ Get User by ID

```http
GET /users/{id} HTTP/1.1
Host: localhost:3000
```

### ✅ Create User

```http
POST /users HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

### ✅ Update User

```http
PATCH /users/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### ✅ Delete User

```http
DELETE /users/{id} HTTP/1.1
Host: localhost:3000
```

---

## Posts Endpoints

### ✅ Get All Posts

```http
GET /posts HTTP/1.1
Host: localhost:3000
```

**Query Parameters:**
```
?page=1&limit=10&published=true
```

### ✅ Get Post by ID

```http
GET /posts/{id} HTTP/1.1
Host: localhost:3000
```

### ✅ Create Post

```http
POST /posts HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post. It should be at least 10 characters long.",
  "excerpt": "A brief summary of the post",
  "categoryIds": [1, 2],
  "is_published": false
}
```

### ✅ Update Post

```http
PATCH /posts/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content here",
  "is_published": true
}
```

### ✅ Delete Post

```http
DELETE /posts/{id} HTTP/1.1
Host: localhost:3000
```

---

## Categories Endpoints

### ✅ Get All Categories

```http
GET /categories HTTP/1.1
Host: localhost:3000
```

### ✅ Get Category by ID

```http
GET /categories/{id} HTTP/1.1
Host: localhost:3000
```

### ✅ Create Category

```http
POST /categories HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Technology",
  "description": "Posts about technology and programming"
}
```

### ✅ Update Category

```http
PATCH /categories/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Tech News",
  "description": "Latest technology news"
}
```

### ✅ Delete Category

```http
DELETE /categories/{id} HTTP/1.1
Host: localhost:3000
```

---

## Response Format

### ✅ Success Response

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-04-27T12:00:00Z",
    "updated_at": "2024-04-27T12:00:00Z"
  }
}
```

### ❌ Error Response

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "Email already exists",
  "timestamp": "2024-04-27T12:00:00Z"
}
```

---

## Validation Errors

### Email Validation

```json
{
  "statusCode": 400,
  "message": "ایمیل معتبر نیست",
  "error": "Invalid email format",
  "timestamp": "2024-04-27T12:00:00Z"
}
```

### Password Validation

```json
{
  "statusCode": 400,
  "message": "رمز عبور باید حداقل 6 کاراکتر باشد",
  "error": "Password too short",
  "timestamp": "2024-04-27T12:00:00Z"
}
```

### Name Validation

```json
{
  "statusCode": 400,
  "message": "نام باید حداقل 2 کاراکتر باشد",
  "error": "Name too short",
  "timestamp": "2024-04-27T12:00:00Z"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
- `503` - Service Unavailable
