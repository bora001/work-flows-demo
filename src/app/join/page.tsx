import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="center flex-col gap-3">
      <h1 className="title">회원가입</h1>
      <div className="flex gap-3">
        <Link href="/join/google" className="btn">
          구글로 가입하기
        </Link>
        <Link href="/join/email" className="btn">
          이메일로 가입하기
        </Link>
      </div>
    </div>
  );
};

export default page;
