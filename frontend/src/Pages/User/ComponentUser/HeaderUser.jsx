import React from "react";
import { Link } from "react-router-dom";

function HeaderUser() {
  const clickNavBar = (navInput) => {
    document.querySelectorAll('.item_nav_user')[navInput].style.borderBottom = "2px solid red"
  }


  return (
    <div className="headerUser d-flex">
      <div className="NavPage d-flex" style={{ alignItems: "center" }}>
        <img
          src="/img/logo_main.png"
          alt="..."
          style={{
            width: "117px",
            height: "50px",
            objectFit: "contain",
            marginLeft: "14px",
            marginRight: "50px",
          }}
        ></img>
        <div
          className="item_nav_user"
          onClick={() => clickNavBar("1")}
        >
          <Link to="/user/booking" className="navBar_User ">
            <span>

            Đặt lịch
            </span>
          </Link>
        </div>
        <div
          className="item_nav_user"
          onClick={() => clickNavBar("2")}
        >
          <Link to="/user/order" className="navBar_User">
            <span>
            Đơn hàng

            </span>
          </Link>
        </div>
        <div className="item_nav_user">
          <Link to="" className="navBar_User">
            Tài xế
          </Link>
        </div>
      </div>
      <div className="settingIcon">Icon</div>
    </div>
  );
}

export default HeaderUser;
