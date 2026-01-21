import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/products">Sản phẩm</Link>
        </li>
        <li>
          <Link href="/login">Đăng nhập</Link>
        </li>
        <li>
          <Link href="/register">Đăng ký</Link>
        </li>
        {/* Do tạo button logout này ở client component nên không thể đặt trong này giống như đăng nhập, đăng ký (nếu để Link giống thì mình phải chuyển hết component này thành use client */}
        <li>
          <ButtonLogout />
        </li>
      </ul>
      <ModeToggle />
    </div>
  );
}
