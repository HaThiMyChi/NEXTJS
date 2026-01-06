# Dự án: Shop bán hàng đơn giản

# Công nghệ: Backend Fastify (Node.js + Fastify + Sqlite) và Frontend Next.js

Chức năng:

- Đăng ký, đăng nhập
- Thêm sửa xóa sản phẩm
- Xem sản phẩm
- SEO cơ bản
- Quản lý authentication

Với các API POST, PUT thông thường thì body gửi lên phải là JSON và phải có header `Content-Type: application/json`

Đặc biệt API upload hình ảnh thì phải gửi dưới dạng `form-data` key là `file`, value là file hình ảnh.

API xác thực người dùng thông qua session token, session token này là một JWT, secret key JWT này sẽ được lưu trong file `.env` và được sử dụng để tạo và verify token.

Đối với các API cần xác thực người dùng như bên cụm API về Account thì bạn có 2 cách để server biết bạn là ai:

1. Gửi Session token thông qua header `sessionToken`
2. Để cookie tự gửi lên (vì khi gọi api login hay register thì server sẽ set cookie cho bạn)

Khi register, login thành công thì server sẽ tự động set cookie cho domain là `localhost` với tên là `sessionToken`

Khi logout thì server của mình sẽ tự động remove cookie `sessionToken` đi
