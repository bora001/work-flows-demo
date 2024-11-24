"use client";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

const SignInWithGoogle = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      if (userCredential.user) {
        router.push("/");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <button className="btn-white border" onClick={signInWithGoogle}>
      구글 로그인
    </button>
  );
};

export default SignInWithGoogle;
