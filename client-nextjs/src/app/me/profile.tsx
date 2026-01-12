"use client";

import React, { useEffect } from "react";

import accountApiRequest from "@/src/apiRequests/account";
// import { ClientSessionToken } from "@/lib/http";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      // const result = await accountApiRequest.me(ClientSessionToken.value || "");
      const result = await accountApiRequest.meClient();
      console.log("resultProfile", result);
    };
    fetchRequest();
  }, []);
  return <div>Profile</div>;
}
