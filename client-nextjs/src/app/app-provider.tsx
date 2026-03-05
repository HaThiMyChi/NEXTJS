"use client";
import React, { useState, createContext, useContext } from "react";
// import { ClientSessionToken } from "@/lib/http";
import { AccountResType } from "@/src/schemaValidations/account.schema";
import { isClient } from "@/lib/http";

type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  const [user, setUserState] = useState<User | null>(() => {
    if (isClient()) {
      const _user = localStorage.getItem("user");
      return _user ? JSON.parse(_user) : null;
    }
    return null;
  });
  const isAuthenticated = Boolean(user);
  const setUser = (user: User | null) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Nếu console log ClientSessionToken.value ở đây sẽ là '' bởi vì trong Profile nó chạy trước thằng useLayoutEffect vì vậy nếu có console log thì xem trong profile
  // cũng có thể dùng useState bởi vì nó sẽ chạy 1 lần trước khi những component trong {children} được render

  // useLayoutEffect(() => {
  //   ClientSessionToken.value = initialSessionToken;
  // }, [initialSessionToken]);
  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
}
