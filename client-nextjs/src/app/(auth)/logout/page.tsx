"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ClientSessionToken } from "@/lib/http";
import authApiRequest from "@/src/apiRequests/auth";

export default function Logout() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (sessionToken === ClientSessionToken.value) {
      authApiRequest
        .logoutFromNextClientToNextServer(true, signal)
        .then((res) => {
          router.push(`/login?redirectFrom=${pathname}`);
        });
    }
    console.log("logout sessionToken", sessionToken);
    return () => controller.abort(); // cleanup: hủy request
  }, [sessionToken, router, pathname]);
  return <div>page</div>;
}
