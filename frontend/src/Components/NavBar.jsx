import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/apiRequest";
import { useNavigate } from "react-router-dom";
// import { createAxios } from "../../createInstance";
// import { logOutSuccess } from "../../redux/authSlice";
//Icon
import { FaRegUser, FaPhone } from "react-icons/fa6";
import { Tooltip } from "antd";
import { FiLogOut } from "react-icons/fi";
import { Badge } from "antd";
import {
  BellFilled,
  CloseSquareOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Avatar } from "antd";
import axios from "axios";

import * as moment from "moment";
import "moment/locale/vi";

import { Toast } from "./ToastColor";

const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  // const id = user?._id;
  const navigate = useNavigate();
  // const accessToken = user?.accessToken;
  // let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const handleLogout = () => {
    logOut(navigate, dispatch);
  };

  const [ava, setAva] = useState();

  const [domNotify, setDomNotify] = useState("");
  //Xử lí nhấn vào nút chuông
  const [numberNotify, setNumberNotify] = useState("");

  const [dataCustomer, setDataCustomer] = useState("");

  //Xóa thông báo
  const deleteNotify = async (id_input) => {
    await axios
      .delete(`/v1/notification/deleteNotify/${id_input}`)
      .then((data) => {
        Toast.fire({
          icon: "success",
          title: "Xóa thông báo thành công !",
        });
      })
      .catch((e) => {
        console.log(e);
        Toast.fire({
          icon: "warning",
          title: "Xóa thông báo thất bại!",
        });
      });
  };

  const call_notification = async (idCustomer) => {
    const data_call_api = await axios.get(
      `/v1/notification/showNotificationWithID/${idCustomer}`
    );

    // console.log(data_call_api);
    const data_notify = data_call_api.data;

    console.log(data_notify);
    setNumberNotify(data_notify.length);

    const DOM_NOTIFY = data_notify.map((item, index) => {
      return (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid #0dcaf0",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
              }}
            ></p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  color: "#3396c5",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  navigate("/user/order");
                  localStorage.setItem("menu", "/user/order");
                }}
              >
                <span
                  style={{
                    color:
                      item.content == "Có đơn hàng mới vừa được tạo !"
                        ? "#3396c5"
                        : "rgb(255, 78, 116)",
                  }}
                >
                  {item.content}
                </span>{" "}
                Mã đơn hàng:{" "}
                <span style={{ color: "red" }}>{item.order_id}</span>
              </p>
              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <p style={{ color: "#ccc", textAlign: "left" }}>
                  {moment(item.createdAt).fromNow()}
                </p>
                <CloseCircleFilled
                  style={{ fontSize: "17px", zIndex: "99999" }}
                  onClick={() => {
                    document.querySelector(".notify").style.display = "none";
                    deleteNotify(item._id);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      );
    });

    setDomNotify(DOM_NOTIFY);
  };

  const getInfoCustomer = async () => {
    if (user) {
      let id = user._id;

      await axios
        .get(`/v1/customer/get_customer_info/${id}`)
        .then((data) => {
          let data_customer = data.data;
          setDataCustomer(data_customer._id);
          //Chạy liên tục gọi thông báo
          call_notification(data_customer._id);
          setAva(data_customer.avatar);
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    getInfoCustomer();
    // eslint-disable-next-line
  }, []);

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
        <div className="container-fluid" style={{ height: "90px" }}>
          <Link to="/" className="nav-link" style={{ marginLeft: "29px" }}>
            <img
              alt=""
              src="./img/logo_new_version.png"
              style={{
                width: "fit-content",
                height: "30px",
                objectFit: "cover",
              }}
              className="img_logo"
            />
          </Link>

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
                <Link to="/" className="nav-link">
                  Trang chủ
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/service_price" className="nav-link">
                  Giá dịch vụ
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/blog" className="nav-link">
                  Blog
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/contact" className="nav-link">
                  Liên hệ
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link"
                  style={{
                    color: "#E16D2A",
                    backgroundColor: "#F2E6E6",
                    borderRadius: "20px",
                  }}
                >
                  <FaPhone></FaPhone> &nbsp;(+84) 992356425
                </Link>
              </li>
            </ul>
          </div>

          {user ? (
            <>
              <div className="content_right d-flex fw-bold">
                <div
                  className="btn_signIn d-flex"
                  style={{ flexDirection: "column" }}
                >
                  Xin chào, &nbsp;
                  <span style={{ color: "#ff8268 " }}>{user.fullname}</span>
                </div>
                <div
                  className="btn_function d-flex"
                  style={{ cursor: "pointer" }}
                >
                  {/* //Đi đến trang cá nhân */}
                  <Tooltip placement="bottom" title={"Trang cá nhân"}>
                    <Link
                      to="/user/booking"
                      className="col btn_info_user"
                      style={{
                        textDecoration: "none",
                        color: "#ff8268",
                        borderColor: "transparent",
                      }}
                    >
                      <Avatar src={ava} />
                    </Link>
                  </Tooltip>

                  <div style={{ border: "1px solid #ff8268" }}></div>
                  {/* //Thông báo */}
                  {numberNotify ? (
                    <div
                      className="col"
                      style={{ marginTop: "5px", marginLeft: "-5px" }}
                    >
                      <Badge count={numberNotify}>
                        <BellFilled
                          style={{
                            fontSize: 20,
                            position: "relative",
                            border: "1px solid transparent",
                            marginLeft: "10px",
                          }}
                          onClick={() => {
                            document.querySelector(".notify").style.display =
                              "block";
                            call_notification(dataCustomer);
                          }}
                        />
                        <div
                          className="notify"
                          style={{
                            position: "absolute",
                            width: "450px",
                            height: "400px",
                            border: "1px solid #ccc",
                            boxShadow: "1px 1px 2px #ccc",
                            backgroundColor: "white",
                            left: "-440px",
                            zIndex: 9999,
                            top: "40px",
                            overflow: "hidden",
                            borderRadius: "5px",
                            display: "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h2
                              style={{
                                width: "450px",
                                backgroundColor: "#b7b7b7",
                                color: "white",
                                fontSize: "20px",
                                padding: "10px",
                                borderRadius: "5px",
                              }}
                            >
                              THÔNG BÁO
                              <CloseSquareOutlined
                                style={{ float: "right" }}
                                onClick={() => {
                                  document.querySelector(
                                    ".notify"
                                  ).style.display = "none";
                                }}
                              />
                            </h2>
                          </div>
                          <div
                            style={{
                              overflowY: "scroll",
                              maxHeight: "350px",
                              backgroundColor: "white",
                              padding: "10px",
                            }}
                          >
                            {domNotify ? domNotify : ""}
                          </div>
                        </div>
                      </Badge>
                    </div>
                  ) : (
                    ""
                  )}

                  <div style={{ border: "1px solid #ff8268" }}></div>
                  <Tooltip placement="bottom" title={"Đăng xuất"}>
                    {/* Đăng xuất */}
                    <div
                      className="col btn_logout"
                      style={{ color: "red", fontSize: "20px" }}
                      onClick={() => handleLogout()}
                    >
                      <FiLogOut></FiLogOut>
                    </div>
                  </Tooltip>
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
