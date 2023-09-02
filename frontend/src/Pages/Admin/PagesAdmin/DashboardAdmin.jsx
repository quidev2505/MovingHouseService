import React from "react";
import LayoutAdmin from "../ComponentAdmin/LayoutAdmin";
import TopCssContent from "./TopCssContent";

function DashBoardAdmin() {
  return (
    <>
      <LayoutAdmin>
        <div className="dash_board_admin">
          <TopCssContent>
            <h2>Dashboard</h2>
          </TopCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default DashBoardAdmin;
