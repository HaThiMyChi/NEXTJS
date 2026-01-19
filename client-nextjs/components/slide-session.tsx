"use client";

import { ClientSessionToken } from "@/lib/http";
import authApiRequest from "@/src/apiRequests/auth";
import React, { useEffect } from "react";
import { differenceInHours } from "date-fns";

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(
      async () => {
        // Decode JWT Access Token để lấy được giá trị exp
        // Từ đó chúng ta có thể biết được thời gian hết hạn của Access Token
        // Ví dụ: nó có thời gian hết hạn là ngày 27/4/2024 10:00:00
        // Mà hiện tại là 27/4/2024 17:00:00
        const now = new Date();
        const expiresAt = new Date(ClientSessionToken.expiresAt);
        if (differenceInHours(expiresAt, now) < 1) {
          const res =
            await authApiRequest.slideSessionFromNextClientToNextServer();
          ClientSessionToken.expiresAt = res.payload.data.expiresAt;
        }
      },
      1000 * 60 * 60,
    );
    return () => clearInterval(interval);
  }, []);
  return null;
}
