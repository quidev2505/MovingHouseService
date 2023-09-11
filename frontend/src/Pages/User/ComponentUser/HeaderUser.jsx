import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";



import {
  FcUndo,
  FcCalendar,
  FcInspection,
  FcManager,
  FcSettings,
} from "react-icons/fc";

function HeaderUser() {
  const navigate = useNavigate();


  //Link Route
  const items = [
    {
      label: "Trở về",
      icon: <FcUndo />,
      key: "/",
    },
    {
      label: "Đặt lịch",
      icon: <FcCalendar />,
      key: "/user/booking",
    },
    {
      label: "Đơn hàng",
      icon: <FcInspection />,
      key: "/user/order",
    },
    {
      label: "Tài xế",
      icon: <FcManager />,
      key: "/user/driver",
    },
    {
      label: "Thông tin cá nhân",
      icon: <FcSettings />,
      key: "/user/info_user",
    },
  ];

  let defaultkey = localStorage.getItem("menu");
  if (!defaultkey) {
    defaultkey = localStorage.setItem("menu", items[0].key);
  }

  return (
    <div class="headerUser" style={{}}>
      <Menu
        className="menu_item fw-bold"
        defaultSelectedKeys={[defaultkey]}
        mode="horizontal"
        theme="light"
        onClick={(e) => {
          localStorage.setItem("menu", e.key);
          navigate(e.key);
        }}
        darkItemSelectedBg="red"
        items={items}
      />
    </div>
  );
}

export default HeaderUser;
