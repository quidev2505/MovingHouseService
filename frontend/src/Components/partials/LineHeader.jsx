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
        }}
      >
        Chúng tôi mang đến sự lựa chọn hợp lý nhất cho bạn !
        <span className='fw-bold'>
        &nbsp; Dịch vụ dọn nhà
        chuyên nghiệp hàng đầu.{" "}
        </span>
        <Link to="/register" style={{ textDecoration: "none", color: "#ff671d" }}>
          Đăng ký sử dụng ngay
        </Link>
      </p>
    </div>
  );
}

export default LineHeader