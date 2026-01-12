"use client";
import React, { useState } from "react";
import { ClientSessionToken } from "@/lib/http";

export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  // Nếu console log ClientSessionToken.value ở đây sẽ là '' bởi vì trong Profile nó chạy trước thằng useLayoutEffect vì vậy nếu có console log thì xem trong profile
  // cũng có thể dùng useState bởi vì nó sẽ chạy 1 lần trước khi những component trong {children} được render
  useState(() => {
    if (typeof window !== "undefined") {
      ClientSessionToken.value = initialSessionToken;
    }
  });
  // useLayoutEffect(() => {
  //   ClientSessionToken.value = initialSessionToken;
  // }, [initialSessionToken]);
  return <>{children}</>;
}
