import React from "react";
import HeaderAdmin from "../ComponentAdmin/HeaderAdmin";
import SideMenuAdmin from "../ComponentAdmin/SideMenuAdmin";

function LayoutAdmin(props) {
  return (
    <div
      className="d-flex"
      style={{ flexDirection: "column", height: "100vh" }}
    >
      <HeaderAdmin />
      <div className="SideMenuAndPageContent d-flex">
        <SideMenuAdmin></SideMenuAdmin>
        <div className="PageContent col">{props.children}</div>
      </div>
    </div>
  );
}

export default LayoutAdmin;
