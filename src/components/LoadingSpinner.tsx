import { HourglassEmpty } from "@mui/icons-material";

const LoadingSpinner = ({ style }: { style?: string }) => {
  return <HourglassEmpty className={`animate-spin ${style}`} />;
};

export default LoadingSpinner;
