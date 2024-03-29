import React, { useState, useEffect } from "react";
import { Badge, Space } from "antd";
import {
  BellFilled,
  CloseSquareOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { useDispatch } from "react-redux";
import { logOutAdmin } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
//Khu vực code thông báo thời gian thực
// import io from "socket.io-client";
//Khu vực thông báo thời gian thực
// const socket = io("http://localhost:3000");

import * as moment from "moment";
import "moment/locale/vi";

import { Toast } from "../../../Components/ToastColor";

function HeaderAdmin() {
  // const showNotify = (dataOrderSend) => {
  //   alert("Khách vừa đặt đơn");
  // };

  // //Xử lý khi có đơn hàng mới sẽ hiện thông báo lên
  // socket.on("notify_new_order", showNotify);

  const check_admin_login = useSelector(
    (state) => state.admin.login?.currentAdmin
  );

  //Gắn access Token vào request header gắn 1 cái không cần gắn riêng nhưng ảnh hưởng đến các lời gọi API phía dưới
  // axios.defaults.headers = {
  //   token: `Bearer ${check_admin_login.accessToken}`,
  // };

  //Token attach request header
  const ob_token_header = {
    headers: {
      token: `Bearer ${check_admin_login.accessToken}`,
    },
  };

  const items = [
    {
      label: (
        <span style={{ color: "#f1a062" }}>
          {check_admin_login.username} ({check_admin_login.department})
        </span>
      ),
      key: "0",
    },
    {
      label: "Đổi mật khẩu",
      key: "1",
    },
    {
      label: "Đăng xuất",
      key: "2",
    },
  ];

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onClick = ({ key }) => {
    // console.log('da nhấn' + key)
    if (key === "2") {
      // console.log('da nhan dang xuất')
      logOutAdmin(navigate, dispatch);
    } else if (key === "1") {
      navigate(`/admin/change_password/${check_admin_login._id}`);
    }
  };

  const [loading, setLoading] = useState(true);

  const [domNotify, setDomNotify] = useState("");
  //Xử lí nhấn vào nút chuông
  const [numberNotify, setNumberNotify] = useState(0);

  //Xóa thông báo
  const deleteNotify = async (id_input) => {
    try {
      await axios
        .delete(`/v1/notification/deleteNotify/${id_input}`, ob_token_header)
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
    } catch (e) {
      console.log(e);
    }
  };

  const call_notification = async () => {
    try {
      const data_call_api = await axios.get(
        `/v1/notification/showNotification`,
        ob_token_header
      );

      const data_notify = data_call_api.data;

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
                    navigate(`/admin/order/${item.order_id}`);
                    localStorage.setItem("menu", "/admin/order");
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
                  </span>
                  Mã đơn hàng:{" "}
                  <span style={{ color: "red" }}>{item.order_id}</span>
                </p>
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "#ccc" }}>
                    {moment(item.createdAt).fromNow()}
                  </p>
                  <CloseCircleFilled
                    style={{
                      fontSize: "17px",
                      zIndex: "99999",
                    }}
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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // react-hooks/exhaustive-deps;
    setLoading(false);
    //Chạy liên tục gọi thông báo
    call_notification();
  }, []);

  return (
    <div className="HeaderAdmin">
      <img
        src="./img/logo_new_version.png"
        alt="anh_logo"
        style={{
          width: "123px",
          height: "117px",
          objectFit: "cover",
          marginBottom: "-38px",
          marginTop: "-29px",
        }}
      />

      <Space style={{ cursor: "pointer" }}>
        <Badge count={numberNotify}>
          <BellFilled
            style={{
              fontSize: 20,
              position: "relative",
              border: "1px solid transparent",
            }}
            onClick={() => {
              document.querySelector(".notify").style.display = "block";
              call_notification();
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
              top: "25px",
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
                    document.querySelector(".notify").style.display = "none";
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

        <Dropdown
          menu={{
            items,
            onClick,
          }}
          trigger={["click"]}
        >
          <div>
            <Space>
              <div className="container_info_admin d-flex">
                <Skeleton
                  loading={loading}
                  avatar
                  style={{ marginTop: "80px" }}
                >
                  <img
                    src={check_admin_login.avatar}
                    class="img-thumbnail img_avatar"
                    alt="..."
                  ></img>
                </Skeleton>
              </div>
            </Space>
          </div>
        </Dropdown>
      </Space>
    </div>
  );
}

export default HeaderAdmin;
