"use client";

import { ClientSessionToken } from "@/lib/http";
import authApiRequest from "@/src/apiRequests/auth";
import React, { useEffect } from "react";
import { differenceInHours } from "date-fns";

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(
      async () => {
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
