import React, { useState, useEffect } from "react";
import { Badge, Space } from "antd";
import { BellFilled, CloseSquareOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useDispatch } from "react-redux";
import { logOutAdmin } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "antd";
import { useSelector } from "react-redux";

function HeaderAdmin() {
  const check_admin_login = useSelector(
    (state) => state.admin.login?.currentAdmin
  );
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

  useEffect(() => {
    // react-hooks/exhaustive-deps;
    setLoading(false);
  }, []);

  //Xử lí nhấn vào nút chuông
  const showNotify = () => {};

  return (
    <div className="HeaderAdmin">
      <img
        className="img-fluid"
        src="/img/logo_main.png"
        style={{ width: "130px", height: "34px", objectFit: "contain" }}
        alt=""
      ></img>

      <Space style={{ cursor: "pointer" }}>
        <Badge count={2}>
          <BellFilled
            style={{ fontSize: 20, position: "relative" }}
            onClick={() => showNotify()}
          />
          <div
            className="notify"
            style={{
              position: "absolute",
              width: "450px",
              height: "400px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              left: "-440px",
              zIndex: 9999,
              top: "25px",
              overflow: 'hidden',
              borderRadius: "5px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                <CloseSquareOutlined style={{ float: "right" }} />
              </h2>
            </div>

            <div
              style={{
                overflowY: "scroll",
                minHeight: "400px",
                backgroundColor: "white",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  border: "1px solid #0dcaf0",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderRadius: "10px",
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
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p style={{ color: "#3396c5", fontWeight: "bold" }}>
                    Có đơn hàng mới vừa được cập nhật. Mã đơn hàng: XDSS
                  </p>
                  <p style={{ color: "#ccc" }}>Khoảng vài phút trước</p>
                </div>
              </div>
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
