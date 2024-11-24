import JoinForm from "@/components/Join/JoinForm";

const page = () => {
  return (
    <div className="center flex-col gap-3">
      <h1 className="title">이메일로 회원가입하기</h1>
      <JoinForm />
    </div>
  );
};

export default page;
