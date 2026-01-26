"use client";
import React, { useState, createContext, useContext } from "react";
import { ClientSessionToken } from "@/lib/http";
import { AccountResType } from "@/src/schemaValidations/account.schema";

type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
export default function AppProvider({
  children,
  initialSessionToken = "",
  user: userProp,
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
  user: User | null;
}) {
  const [user, setUser] = useState<User | null>(userProp);
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
  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
