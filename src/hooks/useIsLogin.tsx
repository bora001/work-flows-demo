import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
type LoginUserInfoType = {
  token: string | null;
  isLogin: boolean;
  email: string | null;
  uid: string | null;
};
const useIsLogin = () => {
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [userInfo, setUserInfo] = useState<LoginUserInfoType>({
    token: null,
    isLogin: false,
    email: null,
    uid: null,
  });
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        setUserInfo({
          token,
          isLogin: !!token,
          email: user.email,
          uid: user.uid,
        });
      } else {
        setUserInfo({ token: null, isLogin: false, email: null, uid: null });
      }
      setLoading(false);
    });
  }, []);

  return { ...userInfo, loading };
};

export default useIsLogin;
