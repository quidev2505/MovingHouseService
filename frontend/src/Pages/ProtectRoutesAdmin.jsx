import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { Toast } from "../Components/ToastColor";

const useAuth = () => {
  const check_user_login = useSelector(
    (state) => state.auth.login?.currentUser
  );
  
  if(!check_user_login){
    return false;
  }

  let check = false;

  if (check_user_login.role === "admin") {
    check = true;
  }
  //   const check = check_user_login !== null;
  // console.log(check)
  const user = { loggedIn: check === true };
  return user && user.loggedIn;
};

const ProtectRoutes = () => {
  const isAuth = useAuth();
  if (!isAuth) {
    Toast.fire({
      icon: "info",
      title: "Địa chỉ bạn nhập không hợp lệ",
      text: "Vui lòng nhập vào địa chỉ khác !",
    });
    return <Navigate to="*" />;
  }

  return <Outlet />;
};

export default ProtectRoutes;
