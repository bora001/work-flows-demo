import LoginForm from "@/components/Login/LoginForm";
import React from "react";

const page = () => {
  return (
    <div className="center flex-col gap-5">
      <h1 className="title">로그인</h1>
      <LoginForm />
    </div>
  );
};

export default page;
