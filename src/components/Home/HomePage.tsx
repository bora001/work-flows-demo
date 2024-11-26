"use client";
import Link from "next/link";
import useIsLogin from "@/hooks/useIsLogin";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import SignInWithGoogle from "../Login/SignInWithGoogle";
import LoadingSpinner from "../LoadingSpinner";

const HomePage = () => {
  const { isLogin, email, loading } = useIsLogin();
  if (loading) {
    return <LoadingSpinner style="text-blue-500" />;
  }
  return (
    <>
      {isLogin ? (
        <div className="flex flex-col gap-4">
          <>Welcome {email}</>
          <Link className="btn-white border text-center" href="workflows">
            Workflows
          </Link>
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
          <SignInWithGoogle />
        </div>
      )}
    </>
  );
};

export default HomePage;
