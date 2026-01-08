# Quản lý Auth trong Next.js

Để xác thực một request thì backend thường sẽ xác thực qua 2 cách:

1. FE gửi token qua header của request như `Authorization: Bearer <token>` (token thường được lưu trong localStorage của trình duyệt)
2. FE gửi token qua cookie của request (sự thật là cookie cũng nằm trong header của request)

Cách dùng cookie có ưu điểm là an toàn hơn 1 chút so với cách dùng localstorage, nhưng đòi hỏi setup giữa backend và frontend phức tạp hơn.

Next.js chúng ta có thể dùng 2 cách trên, nhung nó phức tạp hơn so với React.js Client Side Rendering (CSR) truyền thống vì Next.js có cả Server và Client.

# Cách 1: Dùng localstorage

Cách này chỉ áp dụng cho server check authentication dựa vào header Authorization của request.

- Tại trang login, chúng ta gọi api /api/login để đăng nhập. Nếu đăng nhập thành công, server sẽ trả về token, chúng ta lưu token vào localstorage. Việc này chúng ta sẽ làm ở phía client hoàn toàn.

- Tại những trang không cần authenticated, chúng ta có thể gọi api ở cả server và client của next.js mà không cần phải làm gì thêm.

# Cách 2: Dùng cookie

Cách này áp dụng cho Server check token dựa vào cookie hay header Authorization đều được.

Tại trang login chúng ta gọi api là /api/login từ Server Action để đăng nhập. Chúng ta dùng Server Action để làm proxy, trong server action, khi login thành công, chúng ta sẽ set cookie token vào trình duyệt và trả về token cho client để client set vào Context API hoặc caching react tùy thích (phục vụ nếu cần gọi api ở client)
