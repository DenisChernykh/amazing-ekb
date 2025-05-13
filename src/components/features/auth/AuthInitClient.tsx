"use client";
import { useAuthorizeWithTelegram } from "@/hooks/useAuthorizeWithTelegram";


const AuthInitClient = () => {

  useAuthorizeWithTelegram();
  return null;
};

export default AuthInitClient;
