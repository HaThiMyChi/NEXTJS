This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Khi đang dùng mà session token hết hạn thì sao?

Thì phải cho user đăng xuất

Nhưng nếu đang thực hiện chức năng quan trọng mà bắt user đăng xuất => không tốt về mặt UX

Cách tốt nhất để giải quyết là trong lúc người dùng đang dùng web thì chúng ta tăng thời gian hết hạn của session

Để làm được thì cần 2 yếu tố:

- Backend của bạn phải hỗ trợ chức năng Sliding Session, tức là tăng giá trị expire của session

- Frontend của bạn phải kiểm tra thời gian hết hạn của session token và tăng thời gian hết hạn của nó trước khi nó hết hạn. Vì session token hết hạn thì coi như vô dụng. Vậy nên cần refresh trước khi nó hết hạn

Ví dụ session token hết hạn sau 15 ngày thì mỗi khi thời gian hết hạn còn dưới 7 ngày refresh lại một lần.

Trong trường hợp người ta không mở website 15 ngày thì khi mở lên sẽ bị đăng xuất

Cách làm này gần giống với phương pháp refresh token, chỉ khác là khi refresh token chúng ta nhận lại cặp access token và refresh token mới. Còn khi dùng session này thì token vẫn giữ nguyên, chỉ là thời gian hết hạn của nó được tăng lên.
