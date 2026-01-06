# Server Component

Đây là chế độ mặc định của component trong Next.js

Ưu điểm:

- Fetch data ở server => Nơi gần data center nên là sẽ nhanh hơn là fetch ở client => Giảm thiểu thời gian rendering, tăng UX
- Bảo mật: Server cho phép giữ các data nhạy cảm, logic đặc biệt không muốn public ở client
- caching: Vì được render ở server nên có thể lưu trữ cache cho nhiều người dùng khác nhau => Không cần render trên mỗi request
- Bundle size: Giảm thiểu JS bundle size vì client không cần tải về phần JS logic để render HTML
- Load trang lần đầu nhanh và chỉ số FCP (First contentful Paint) thấp do người dùng sẽ thấy content ngay lập tức.
- Search Engine Optimization and Social Network Shareability
- Streaming (phát trực tuyến)

-> Ưu tiên dùng Server component khi có thể
