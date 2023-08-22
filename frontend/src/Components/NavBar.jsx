import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/apiRequest";
import { useNavigate } from "react-router-dom";
// import { createAxios } from "../../createInstance";
// import { logOutSuccess } from "../../redux/authSlice";
//Icon
import { FaRegUser, FaCircleUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  // const id = user?._id;
  const navigate = useNavigate();
  // const accessToken = user?.accessToken;
  // let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const handleLogout = () => {
    logOut(navigate, dispatch);
    console.log("da nan");
  };


  return (
    <div className="Header_Navbar">
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{
          padding: "20px 60px",
          height: "90px",
          backgroundColor: "#fff",
        }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#" style={{ marginLeft: "29px" }}>
            <img
              alt=""
              src="./img/logo_main.png"
              style={{ width: "fit-content", height: "30px" }}
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar_header">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#">
                  Trang chủ
                </a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle dropdown_header"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Giá dịch vụ
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="#">
                      Bảng giá chi tiết
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Nhận báo giá
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">
                  Blog
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">
                  Liên hệ
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link">(+84) 907532754</a>
              </li>
            </ul>
          </div>

          {user ? (
            <>
              <div className="content_right d-flex fw-bold">
                <div className="btn_signIn d-flex">
                  Xin chào,&nbsp;
                  <span style={{ color: "#ff8268 " }}>{user.fullname}</span>
                </div>
                <div
                  className="btn_function d-flex"
                  style={{ cursor: "pointer" }}
                >
                  {/* //Đi đến trang cá nhân */}
                  <div className="col btn_info_user" style={{ color: "green" }}>
                    <FaCircleUser></FaCircleUser>
                  </div>
                  <div style={{ border: "1px solid #ff8268" }}></div>
                  <div className="col btn_logout" style={{ color: "red" }}>
                    <FiLogOut></FiLogOut>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* //Khi chưa đăng nhập */}
              <div className="content_right d-flex fw-bold">
                <div className="btn_signIn d-flex">
                  <FaRegUser></FaRegUser>
                  <span style={{ marginLeft: "10px" }}>
                    <Link
                      to="/login"
                      style={{
                        marginRight: "10px",
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      <span>Đăng nhập</span>
                    </Link>
                  </span>
                </div>
                <div className="btn_signUp" style={{ cursor: "pointer" }}>
                  <Link
                    to="/register"
                    style={{
                      marginRight: "10px",
                      textDecoration: "none",
                      color: "black",
                      display: "block",
                    }}
                  >
                    <span>Đăng ký</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
