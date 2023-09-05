import React, { useState, useEffect } from "react";
import HeaderAdmin from "../ComponentAdmin/HeaderAdmin";
import SideMenuAdmin from "../ComponentAdmin/SideMenuAdmin";
import LoadingOverlayComponent from "../../../Components/LoadingOverlayComponent";

function LayoutAdmin(props) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setIsActive(false);
  }, []);
  return (
    <div
      className="d-flex"
      style={{ flexDirection: "column", height: "100vh" }}
    >
      <HeaderAdmin />
      <div className="SideMenuAndPageContent d-flex">
        <SideMenuAdmin></SideMenuAdmin>
        <div className="PageContent col">
          <LoadingOverlayComponent status={isActive}>
            {props.children}
          </LoadingOverlayComponent>
        </div>
      </div>
    </div>
  );
}

export default LayoutAdmin;
