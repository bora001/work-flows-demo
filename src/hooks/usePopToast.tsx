import { ToastPosition, toast } from "react-toastify";

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
