"use client";
import { FormData } from "@/constants/constants";
import FormHelper from "../FormHelper";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
type LoginFormType = Omit<FormData, "confirmPassword">;
const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormType>();

  const loginByEmail = async (data: LoginFormType) => {
    const { email, password } = data;
    try {
      const userCredential = signInWithEmailAndPassword(auth, email, password);
      if ((await userCredential).user) {
        router.push("/");
      }
    } catch (err: unknown) {
      if (
        err instanceof FirebaseError &&
        err.code === "auth/invalid-credential"
      ) {
        setError("password", { message: "아이디나 비밀번호가 틀렸습니다." });
        console.log("Firebase Error:", err.message);
      } else {
        console.log("Unexpected Error:", err);
      }
    }
  };

  // const loginByGoogle = () => {
  //   console.log("ggggoo");
  // };

  return (
    <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
      <FormHelper
        id="email"
        type="email"
        label="이메일"
        error={errors.email?.message}
        register={{
          ...register("email", {
            required: "이메일을 입력해주세요.", // 이메일 필드의 required 메시지
          }),
        }}
        placeholder="이메일을 입력하세요"
      />
      <FormHelper
        id="password"
        type="password"
        label="비밀번호"
        error={errors.password?.message}
        register={{
          ...register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: { value: 6, message: "6자 이상 입력해주세요" },
          }),
        }}
        placeholder="비밀번호를 입력하세요"
      />
      <button
        className="btn"
        disabled={isSubmitting}
        onClick={handleSubmit(loginByEmail)}
      >
        이메일로 로그인
      </button>
    </form>
  );
};

export default LoginForm;
