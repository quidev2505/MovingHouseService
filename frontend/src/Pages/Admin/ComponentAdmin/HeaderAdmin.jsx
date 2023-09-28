import React, { useState, useEffect } from "react";
import { Badge, Space } from "antd";
import { BellFilled } from "@ant-design/icons";
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
          <BellFilled style={{ fontSize: 20 }} />
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
