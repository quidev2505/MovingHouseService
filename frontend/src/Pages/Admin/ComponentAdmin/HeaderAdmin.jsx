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

  console.log(check_admin_login)

  const items = [
    {
      label: (
        <span style={{ color: "#f1a062" }}>{check_admin_login.username}</span>
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

  const call_notification = async () => {
    const data_call_api = await axios.get(`/v1/notification/showNotification`);

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
                  navigate("/admin/order");
                  localStorage.setItem("menu", "/admin/order");
                }}
              >
                {item.content} Mã đơn hàng:{" "}
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
        className="img-fluid"
        src="/img/logo_main.png"
        style={{
          width: "130px",
          height: "34px",
          objectFit: "contain",
        }}
        alt=""
      ></img>

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
