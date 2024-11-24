"use client";
import Link from "next/link";
import useIsLogin from "@/hooks/useIsLogin";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const HomePage = () => {
  const { isLogin, email } = useIsLogin();
  return (
    <>
      {isLogin ? (
        <div className="flex flex-col gap-4">
          <>Welcome {email}</>
          <button className="btn" onClick={() => signOut(auth)}>
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link href="/join" className="btn">
            회원가입
          </Link>
          <Link href="/login" className="btn">
            로그인
          </Link>
        </div>
      )}
    </>
  );
};

export default HomePage;
