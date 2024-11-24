import React from "react";
import GoogleIcon from "@mui/icons-material/Google";

const page = () => {
  return (
    <div className="center flex-col gap-5">
      <h1 className="title">로그인</h1>
      <form className="flex flex-col gap-3">
        <div className="flex gap-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <button className="btn" type="submit">
          이메일로 로그인
        </button>
        <button className="btn-white flex gap-3 justify-center">
          구글 로그인
        </button>
      </form>
    </div>
  );
};

export default page;
