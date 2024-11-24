import JoinForm from "@/components/Join/JoinForm";

const Page = () => {
  return (
    <div className="center flex-col gap-5">
      <h1 className="title">이메일로 회원가입하기</h1>
      <JoinForm />
    </div>
  );
};

export default Page;
