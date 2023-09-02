import React, { useState } from "react";
import { Menu} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { FcBarChart, FcHome, FcAutomotive } from "react-icons/fc";

function SideMenuAdmin() {
  const navigate = useNavigate();

  //Link Route
  const items = [
    {
      label: "Thống kê",
      icon: <FcBarChart />,
      key: "/admin/dashboard",
    },
    {
      label: "Dịch vụ",
      icon: <FcHome />,
      key: "/admin/order",
    },
    {
      label: "Phương tiện",
      icon: <FcAutomotive />,
      key: "/admin/vehicle",
    },
  ];

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };



  return (
    <div class="SideMenuAdmin d-flex" style={{width: !collapsed ? '256px' : '80px',  paddingTop:"20px"}}>
      <Menu
        className="menu_item fw-bold"
        selectable="true"
        defaultSelectedKeys={[items[0].key]}
        // // // defaultOpenKeys={["sub1"]} //Mở các tab con bên dưới
        mode="inline"
        theme="light"
        onClick={({key}) => {
          navigate(key)
        }}
        inlineCollapsed={collapsed}
        items={items}
      />

      <div
        className="btn_collapse"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 20,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </div>
  );
}

export default SideMenuAdmin;
