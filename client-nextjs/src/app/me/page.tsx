import React from "react";
import { cookies } from "next/headers";
import accountApiRequest from "@/src/apiRequests/account";
import ProfileForm from "@/src/app/me/profile-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hồ sơ người dùng",
};

export default async function MeProfile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");
  console.log("sessionToken", sessionToken);

  // sessionToken nó là 1 object vì vậy ?.value để lấy giá trị chuỗi bên trong
  // Vì dùng cookie nên api này không được cached trên server
  const result = await accountApiRequest.me(sessionToken?.value ?? "");
  return (
    <div>
      <h1>Profile</h1>
      <ProfileForm profile={result.payload.data} />
    </div>
  );
}
