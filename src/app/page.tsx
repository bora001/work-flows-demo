import Link from "next/link";

export default function Home() {
  return (
    <div className="center flex-col gap-3">
      <h1 className="title">FLOW</h1>
      <div className="flex gap-3">
        <Link href="/join" className="btn">
          회원가입
        </Link>
        <Link href="/login" className="btn">
          로그인
        </Link>
      </div>
    </div>
  );
}
