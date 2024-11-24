import { UseFormRegisterReturn } from "react-hook-form";
type FormHelperType = {
  error?: string;
  type: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  id: string;
};
const FormHelper = ({
  id,
  type,
  error,
  label,
  placeholder,
  register,
}: FormHelperType) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <label htmlFor={id}>{label}</label>
        <input type={type} {...register} placeholder={placeholder} />
      </div>
      {error && <p className="text-red-500 text-xs">* {error}</p>}
    </div>
  );
};

export default FormHelper;
