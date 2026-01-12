import React from "react";
import { cookies } from "next/headers";
import Profile from "@/src/app/me/profile";
import accountApiRequest from "@/src/apiRequests/account";

export default async function MeProfile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");
  console.log("sessionToken", sessionToken);

  // sessionToken nó là 1 object vì vậy ?.value để lấy giá trị chuỗi bên trong
  const result = await accountApiRequest.me(sessionToken?.value ?? "");
  return (
    <div>
      <h1>Profile</h1>
      <div>Xin chào {result.payload?.data?.name}</div>
      <Profile />
    </div>
  );
}
