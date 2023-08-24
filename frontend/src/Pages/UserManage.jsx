import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";
import { getAllUsers } from "../redux/apiRequest";
// import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { createAxios } from "../createInstance";

//Toast
import { Toast } from "../Components/ToastColor";

function UserManage() {
  const user = useSelector((state) => state.auth.login?.currentUser);

  // const alluser = useSelector((state) => state.user.users?.allUsers);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  // const refreshToken = async () => {
  //   try {
  //     const res = await axios.post("/v1/auth/refresh", {
  //       withCredentials: true,
  //     });
  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // //Kiểm tra khi AccessToken hết hạn
  // axiosJWT.interceptors.request.use(
  //   async (config) => {
  //     let date = new Date();
  //     const decodedToken = jwt_decode(user?.accessToken);
  //     if (decodedToken.exp < date.getTime() / 1000) {
  //       const data = await refreshToken();
  //       const refreshUser = {
  //         ...user,
  //         accessToken: data.accessToken,
  //       };
  //       dispatch(loginSuccess(refreshUser));
  //       config.headers["token"] = "Bearer" + data.accessToken;
  //     }
  //     return config;
  //   },
  //   (err) => {
  //     return Promise.reject(err);
  //   }
  // );

  useEffect(() => {
    //Cố tình viết đường dẫn vào
    if (!user) {
      Toast.fire({
        icon: "info",
        title: "Bạn chưa đăng nhập",
        text: "Hãy đăng nhập để đặt lịch !",
      });
      navigate("/login");
    }

    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h2>Đây là trang quản lý người dùng đã đăng nhập</h2>
      
    </>
  );
}

export default UserManage;
