import React from "react";

const page = () => {
  return (
    <div className="center flex-col gap-5">
      <h1 className="title">이메일로 회원가입하기</h1>
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
          회원가입
        </button>
      </form>
    </div>
  );
};

export default page;
