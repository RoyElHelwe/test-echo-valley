import Login from "@/components/Private/Login/form";
import { GetCurrentSession } from "@/util/sessions";
import React from "react";

const LoginPage = async () => {
  const sessions = await GetCurrentSession();

  if (!sessions)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Login />
      </div>
    );

  return <div className="flex items-center justify-center">You are already logged in</div>;
};

export default LoginPage;
