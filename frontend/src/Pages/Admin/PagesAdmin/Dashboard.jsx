import React from "react";
import { Space } from "antd";
import HeaderAdmin from "../ComponentAdmin/HeaderAdmin";
import SideMenuAdmin from "../ComponentAdmin/SideMenuAdmin";
import FooterAdmin from "../ComponentAdmin/FooterAdmin";

function DashBoard() {
  return (
    <>
      <div
        className="d-flex"
        style={{ flexDirection: "column", height: "100vh" }}
      >
        <HeaderAdmin />
        <Space className="SideMenuAndPageContent">
          <SideMenuAdmin></SideMenuAdmin>
          <div>DashBoard</div>
        </Space>
        <FooterAdmin />
      </div>
    </>
  );
}

export default DashBoard;
