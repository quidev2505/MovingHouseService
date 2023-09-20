import React, { useState } from "react";
import { Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  FcBarChart,
  FcHome,
  FcAutomotive,
  FcNews,
  FcDeployment,
  FcPaid,
  FcInTransit,
  FcFaq,
  FcBusinessman,
  FcMoneyTransfer,
} from "react-icons/fc";

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
      type: "group",
      label: "Dịch vụ",
      children: [
        {
          label: "Gói dịch vụ",
          icon: <FcHome />,
          key: "/admin/service",
        },
        {
          label: "Chi phí",
          icon: <FcMoneyTransfer />,
          key: "/admin/service_fee",
        },
      ],
    },
    {
      label: "Phương tiện",
      icon: <FcAutomotive />,
      key: "/admin/vehicle",
    },
    {
      label: "Blog",
      icon: <FcNews />,
      key: "/admin/blog",
    },
    {
      label: "Vật dụng",
      icon: <FcDeployment />,
      key: "/admin/item",
    },
    {
      label: "Đơn hàng",
      icon: <FcPaid />,
      key: "/admin/order",
    },
    {
      label: "Tài xế",
      icon: <FcInTransit />,
      key: "/admin/driver",
    },
    {
      label: "Hỗ trợ dịch vụ",
      icon: <FcFaq />,
      key: "/admin/service_support",
    },
    {
      label: "Quản trị viên",
      icon: <FcBusinessman />,
      key: "/admin/administrator",
    },
  ];

  const [collapsed, setCollapsed] = useState(false);
  // const [defautlKey, setDefaultKey] = useState(items[0].key);

  let defaultkey = localStorage.getItem("menu");
  if (!defaultkey) {
    defaultkey = localStorage.setItem("menu", items[0].key);
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      class="SideMenuAdmin d-flex"
      style={{ width: !collapsed ? "256px" : "80px", paddingTop: "20px" }}
    >
      <Menu
        className="menu_item fw-bold"
        selectable="true"
        defaultSelectedKeys={[defaultkey]}
        mode="inline"
        theme="light"
        onClick={(e) => {
          localStorage.setItem("menu", e.key);
          navigate(e.key);
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
