import React from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";
import TopCssContent from "../TopCssContent";

import {
  FaMoneyCheckDollar,
  FaTruckFront,
  FaUserTie,
  FaBuildingUser,
} from "react-icons/fa6";

function DashBoardAdmin() {
  return (
    <>
      <LayoutAdmin>
        <div className="dash_board_admin">
          <TopCssContent>
            <div
              className="top_dashboard d-flex row"
              style={{ justifyContent: "space-between" }}
            >
              <div
                className="item_top_dashboard d-flex col"
                style={{ justifyContent: "space-between" }}
              >
                <div className="icon_top_dashboard">
                  <FaMoneyCheckDollar></FaMoneyCheckDollar>
                </div>

                <div className="content_top_dashboard">
                  <p>0đ</p>
                  <p>Tổng doanh thu</p>
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "#4ab89f",
                }}
              >
                <div className="icon_top_dashboard">
                  <FaTruckFront></FaTruckFront>
                </div>
                <div className="content_top_dashboard">
                  <p>0</p>
                  <p>Tổng số đơn hàng</p>
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "#3396c5",
                }}
              >
                <div className="icon_top_dashboard">
                  <FaUserTie></FaUserTie>
                </div>
                <div className="content_top_dashboard">
                  <p>0</p>
                  <p>Tài xế</p>
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "#dbd956",
                }}
              >
                <div className="icon_top_dashboard">
                  <FaBuildingUser></FaBuildingUser>
                </div>
                <div className="content_top_dashboard">
                  <p>0</p>
                  <p>Khách hàng</p>
                </div>
              </div>
            </div>
          </TopCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default DashBoardAdmin;
