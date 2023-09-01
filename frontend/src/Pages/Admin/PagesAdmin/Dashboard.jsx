import React from "react";
import LayoutAdmin from "../ComponentAdmin/LayoutAdmin";
import FooterAdmin from "../ComponentAdmin/FooterAdmin";

function DashBoard() {
  return (
    <>
      <LayoutAdmin>
        <div className="dash_board">
          <h2>Đây là trang Dashboard</h2>
        </div>
        <FooterAdmin />
      </LayoutAdmin>
    </>
  );
}

export default DashBoard;
