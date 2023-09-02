import React from "react";
import { Badge, Space } from "antd";
import { BellFilled } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useDispatch } from "react-redux";
import { logOut } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";

function HeaderAdmin() {
  const items = [
    {
      label: "Đổi mật khẩu",
      key: "0",
    },
    {
      label: "Đăng xuất",
      key: "1",
    },
  ];

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onClick = ({ key }) => {
    // console.log('da nhấn' + key)
    if (key === '1') {
      // console.log('da nhan dang xuất')
      logOut(navigate, dispatch);
    }else if(key === '0'){
      navigate('/admin/change_password');
    }
  };
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
                <img
                  src="/img/buoc1.png"
                  class="img-thumbnail img_avatar"
                  alt="..."
                ></img>
              </div>
            </Space>
          </div>
        </Dropdown>
      </Space>
    </div>
  );
}

export default HeaderAdmin;
