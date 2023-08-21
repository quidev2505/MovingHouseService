import React from "react";

function Footer() {
  return (
    <div className="footer container">
      <div className="top_footer d-flex">
        <div className="left_footer col-lg-6">
          <h2>Đặt dịch vụ dọn nhà trực tuyến.</h2>
          <h3 style={{ color: "#ffa579" }}>Liên hệ (+84) 907532754</h3>
        </div>
        <div className="right_footer d-flex col-lg-6">
          <div>
            <p className="fw-bold" style={{ color: "#6994f4" }}>
              Dịch vụ
            </p>
            <div className="contact_footer">
              <p>Cá nhân</p>
              <p>Bảng Giá Dịch Vụ</p>
              <p>Câu hỏi thường gặp</p>
            </div>

            <img
              src="./img/moving-truck.png"
              width="100px"
              height="100px"
            ></img>
          </div>
          <div>
            <p className="fw-bold" style={{ color: "#6994f4" }}>
              Thông tin
            </p>
            <div className="contact_footer">
              <p>Về chúng tôi</p>
              <p>Blog</p>
              <p>Liên hệ hỗ trợ</p>
            </div>

            <img src="./img/route.png" width="100px" height="100px"></img>
          </div>
          <div>
            <p className="fw-bold" style={{ color: "#6994f4" }}>
              Pháp lý
            </p>
            <div className="contact_footer">
              <p>Chính Sách Quyền Riêng Tư</p>
              <p>Chính Sách Cookie</p>
              <p>Điều Khoản và Điều Kiện</p>
            </div>
            <img src="./img/moving.png" width="100px" height="100px"></img>
          </div>
        </div>
      </div>
      <div
        className="bottom_footer d-flex"
        style={{
          borderTop: "1px solid #ccc",
          justifyContent: "space-between",
          height: "50px",
          alignItems: "center",
          paddingTop: "15px",
          color: "#77848f",
          fontWeight:"bold",
          fontSize: "13px",
        }}
      >
        <p>&copy; FASTMOVE 2023. ALL RIGHTS RESERVED</p>{" "}
        <p>
          <img
            src="/img/vietnam.png"
            width="50px"
            height="50px"
            style={{ marginTop: "10px" }}
          ></img>
        </p>
      </div>
    </div>
  );
}

export default Footer;
