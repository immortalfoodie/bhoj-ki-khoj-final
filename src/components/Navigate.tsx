
import { Navigate as RouterNavigate, NavigateProps } from "react-router-dom";

export const Navigate = (props: NavigateProps) => {
  return <RouterNavigate {...props} />;
};

export default Navigate;
