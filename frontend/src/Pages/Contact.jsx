import React from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
  faRobot,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

//Import Component Chatbot
import ChatBotIcon from "../Components/ChatBotIcon";

function Contact() {
  return (
    <>
      <Header />
      <div className="topContact" style={{ marginBottom: "95px" }}>
        <ChatBotIcon />
        <div
          className="imgService container d-flex"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <h1
            className="col-lg-3"
            style={{ fontSize: "90px", fontWeight: "600" }}
          >
            Liên hệ hỗ trợ
          </h1>
          <img
            src="./img/lh.jpg"
            class="img-fluid col-lg"
            alt="..."
            style={{ height: "300px", width: "100%", objectFit: "cover" }}
          ></img>
        </div>
      </div>

      <div className="bottom_contact" style={{ marginBottom: "200px" }}>
        <div className="container d-flex">
          <div className="col text-center" style={{ marginRight: "20px" }}>
            <FontAwesomeIcon
              icon={faBoxesPacking}
              style={{ color: "#ff671d", fontSize: "90px" }}
            />
            <h4
              style={{
                color: "#ff671d",
                fontWeight: "600",
                margin: "10px 0px",
              }}
            >
              Theo dõi đơn hàng
            </h4>
            <p style={{ fontSize: "15px" }}>
              Bạn không biết rõ đơn hàng của mình đã đến đâu ?<br />
              Hãy tải xuống ứng dụng giao hàng{" "}
              <span className="fw-bold">FastMove</span> về máy của bạn !{" "}
            </p>
          </div>
          <div className="col text-center" style={{ marginRight: "20px" }}>
            <FontAwesomeIcon
              icon={faRobot}
              style={{ color: "#ff671d", fontSize: "90px" }}
            />
            <h4
              style={{
                color: "#ff671d",
                fontWeight: "600",
                margin: "10px 0px",
              }}
            >
              Chatbot
            </h4>
            <p style={{ fontSize: "15px" }}>
              Chatbot ...Calling...Calling !
              <p>
                Cùng trò chuyện để đưa ra gợi ý chọn dịch vụ dọn nhà tiết kiệm
                nhất cho bạn ! Hãy nhấn vào biểu tượng <span className="fw-bold">Chat</span> nằm ở
                gốc phải bên dưới !
              </p>
            </p>
          </div>
          <div className="col text-center">
            <FontAwesomeIcon
              icon={faMapLocationDot}
              style={{ color: "#ff671d", fontSize: "90px" }}
            />
            <h4
              style={{
                color: "#ff671d",
                fontWeight: "600",
                margin: "10px 0px",
              }}
            >
              Văn phòng chúng tôi
            </h4>
            <p style={{ textAlign: "center", fontSize: "15px" }}>
              <span className="fw-bold">Tại Cần Thơ</span> <br />
              Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
