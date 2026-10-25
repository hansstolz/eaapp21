"use client";

import { createContext, useContext } from "react";

const UsernameContext = createContext("");

export function AuthSessionProvider({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  return (
    <UsernameContext.Provider value={username}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useSessionUsername() {
  return useContext(UsernameContext);
}
