"use client";

import { useForm } from "react-hook-form";
import FormHelper from "../FormHelper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FormData } from "@/constants/constants";

const JoinForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormData>();

  const handleSignUp = async (data: FormData) => {
    try {
      const { email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        router.push("/");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const validatePasswordMatch = (value: string) => {
    if (value !== getValues("password")) {
      return "비밀번호가 일치하지 않습니다."; // 비밀번호 불일치 메시지
    }
    return true;
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(handleSignUp)}>
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
      <FormHelper
        id="confirmPassword"
        type="password"
        label="비밀번호 확인"
        error={errors.confirmPassword?.message}
        register={{
          ...register("confirmPassword", {
            required: "비밀번호를 다시 입력해주세요",
            minLength: { value: 6, message: "6자 이상 입력해주세요" },
            validate: validatePasswordMatch,
          }),
        }}
        placeholder="비밀번호를 다시 입력하세요"
      />

      <button className="btn" type="submit" disabled={isSubmitting}>
        회원가입
      </button>
    </form>
  );
};

export default JoinForm;
