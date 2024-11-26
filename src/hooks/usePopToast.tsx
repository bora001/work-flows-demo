import { ToastPosition, toast } from "react-toastify";

//         popToast({ type: "success", title: "새로운 리스트를 추가했습니다 !" });

const usePopToast = () => {
  const popToast = ({
    type,
    title,
    position = "top-right",
  }: {
    type: "success" | "error";
    title: string;
    position?: ToastPosition;
  }) => {
    const options = { position, autoClose: 2000 };
    if (type === "success") {
      toast.success(title, options);
    }
    if (type === "error") {
      toast.error(title, options);
    }
  };

  return { popToast };
};

export default usePopToast;
