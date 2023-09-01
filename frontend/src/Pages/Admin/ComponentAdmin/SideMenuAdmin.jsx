import React, { useState } from "react";
import { Menu, Button } from "antd";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function SideMenuAdmin() {
  const navigate = useNavigate();

  //Link Route
  const items = [
    {
      label: "Dashboard",
      icon: <AppstoreOutlined />,
      key: "/admin/dashboard",
    },
    {
      label: "Order",
      icon: <ShoppingCartOutlined />,
      key: "/admin/order",
    },
  ];

  const [collapsed, setCollapsed] = useState(false);


  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigate = (e) => {

    navigate(e);
  };

  return (
    <div class="SideMenuAdmin d-flex">
      <Menu
        // className="menu_item"
        // selectable="true"
        // defaultSelectedKeys={items[0].key}
        // // // defaultOpenKeys={["sub1"]} //Mở các tab con bên dưới
        // mode="inline"
        // theme="dark"
        onClick={(item) => {
          handleNavigate(item.key);
        }}
        inlineCollapsed={collapsed}
        items={items}
      />

      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    </div>
  );
}

export default SideMenuAdmin;
