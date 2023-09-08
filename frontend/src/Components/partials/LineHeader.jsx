import React from 'react'
import { Link } from "react-router-dom";

function LineHeader() {
  return (
    <div style={{ marginTop: "90px" }}>
      <p
        style={{
          lineHeight: "44px",
          backgroundColor: "#f5f7f9",
          textAlign: "center",
          position:"relative",
          zIndex:"998"
        }}
      >
        Chúng tôi mang đến sự lựa chọn hợp lý nhất cho bạn !
        <span className="fw-bold">
          &nbsp; Dịch vụ dọn nhà chuyên nghiệp hàng đầu.{" "}
        </span>
        <Link
          to="/userManage"
          style={{ textDecoration: "none", color: "#ff671d" }}
        >
          Đặt lịch ngay bây giờ !
        </Link>
      </p>
    </div>
  );
}

export default LineHeader