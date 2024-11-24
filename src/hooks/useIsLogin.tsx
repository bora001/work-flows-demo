import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
type LoginUserInfoType = {
  token: string | null;
  isLogin: boolean;
  email: string | null;
};
const useIsLogin = () => {
  const [hasUser, setHasUser] = useState<LoginUserInfoType>({
    token: null,
    isLogin: false,
    email: null,
  });
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        setHasUser({ token, isLogin: !!token, email: user.email });
      } else {
        setHasUser({ token: null, isLogin: false, email: null });
      }
    });
  }, []);

  return { ...hasUser };
};

export default useIsLogin;
