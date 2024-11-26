import axios from "axios";
import usePopToast from "./usePopToast";
import { useMutation } from "@tanstack/react-query";

interface PostVariables {
  option: string;
  value: string;
}
const usePostData = () => {
  const { popToast } = usePopToast();
  const postData = async ({ option, value }: PostVariables) => {
    const response = await axios.post(process.env.NEXT_PUBLIC_ADD_ROW ?? "", {
      [option]: value,
    });
    return response.data;
  };
  const { mutate: postDataToSheet, status } = useMutation({
    mutationFn: postData,
    onSuccess: () => {
      popToast({ type: "success", title: "데이터 전송에 성공했습니다!" });
    },
    onError: (error) => {
      popToast({ type: "error", title: `에러: ${error.message}` });
    },
  });

  return {
    postDataToSheet,
    status,
  };
};
export default usePostData;
