"use client";

import React, { useState } from "react";

export default function loginPage() {
  const [email, setEmail] = useState("duthanhduoc@gmail.com");

  return (
    <div>
      test login
      {email}
    </div>
  );
}
