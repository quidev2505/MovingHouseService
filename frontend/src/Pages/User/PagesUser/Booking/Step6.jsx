import React, { useState, useEffect } from "react";

import { Toast } from "../../../../Components/ToastColor";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function Step6() {
  const nav = useNavigate();

  const success_order = () => {
    localStorage.removeItem("check_nav_booking");
    localStorage.removeItem("order_moving");
    nav("/user/order");
    localStorage.setItem("menu", "/user/order");
  };

  useEffect(() => {
    Toast.fire({
      icon: "success",
      title: "Hãy chờ 5s để chuyển qua trang đơn hàng !",
    });
    
    setTimeout(() => {
      success_order();
    },4300);
  }, []);

  return (
    <div className="booking_step_6 row">
      <div class="card">
        <div
          style={{
            borderRadius: "200px",
            height: "200px",
            width: "200px",
            background: "#F8FAF5",
            margin: "0 auto",
          }}
        >
          <i class="checkmark">✓</i>
        </div>
        <br></br>
        <h1>Đặt hàng thành công</h1>
        <br></br>
        <p>
          Cảm ơn quý khách đã đặt dịch vụ của chúng tôi ! Thông tin chi tiết hãy
          theo dõi ở mục{" "}
          <span style={{ color: "#fed03f", fontWeight: "bold" }}>Đơn hàng</span>
        </p>
      </div>
    </div>
  );
}

export default Step6;
