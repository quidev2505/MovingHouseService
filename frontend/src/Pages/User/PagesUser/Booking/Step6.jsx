import React, { useState, useEffect } from "react";

import { Toast } from "../../../../Components/ToastColor";

import { useNavigate } from "react-router-dom";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";

function Step6() {
  const nav = useNavigate();

  const [isActive, setIsActive] = useState(true);

  const success_order = () => {
    setIsActive(false);
    localStorage.removeItem("check_nav_booking");
    localStorage.removeItem("order_moving");
    localStorage.removeItem("success_payment_vnpay");;
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
    }, 3900);
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
        <h1>Đặt dịch vụ thành công</h1>
        <br></br>
        <p>
          Chúng tôi sẽ liên hệ đến bạn sớm nhất ! Thông tin chi tiết hãy theo
          dõi ở mục{" "}
          <span style={{ color: "#fed03f", fontWeight: "bold" }}>Đơn hàng</span>
        </p>
        <LoadingOverlayComponent status={isActive}></LoadingOverlayComponent>
      </div>
    </div>
  );
}

export default Step6;
