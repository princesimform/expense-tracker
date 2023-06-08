import React, {
  ReactComponentElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Services/auth";
import { User } from "@firebase/auth";
import Navbar from "../Pages/Navbar";
import { Box } from "@mui/system";
interface PropType {
  component: ReactNode;
}
function AuthGuards({ component }: PropType) {
  const [status, setStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkToken();
  }, [component]);

  const checkToken = async () => {
    try {
      if (typeof AuthService.getProfile != "boolean") {
        let user: User = await AuthService.getProfile(true);
        if (!user) {
          navigate(`/login`);
        }
        setStatus(true);
      }
    } catch (error) {
      navigate(`/login`);
    }
  };

  return status ? (
    <React.Fragment>
      <Navbar />
      <Box sx={{ height : 70}}></Box>
      {component}
    </React.Fragment>
  ) : (
    <React.Fragment></React.Fragment>
  );
}

export default AuthGuards;