import React from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadset,
  faRobot,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

function Contact() {
  return (
    <>
      <Header />
      <div className="topContact" style={{marginBottom:"130px"}}>
        <div className="imgService container d-flex" style={{alignItems:"center", justifyContent:"center"}}>
          <h1
            className="col-lg-3"
            style={{ fontSize: "90px", fontWeight: "600" }}
          >
            Liên hệ hỗ trợ
          </h1>
          <img
            src="./img/lienhe.jpg"
            class="img-fluid col-lg"
            alt="..."
            style={{ height: "300px", width: "100%", objectFit: "cover" }}
          ></img>
        </div>
      </div>

      <div className="bottom_contact" style={{ marginBottom:"200px" }}>
        <div className="container d-flex">
          <div className="col text-center" style={{ marginRight: "20px" }}>
            <FontAwesomeIcon
              icon={faHeadset}
              style={{ color: "#ff671d", fontSize: "90px" }}
            />
            <h4
              style={{
                color: "#ff671d",
                fontWeight: "600",
                margin: "10px 0px",
              }}
            >
              Hỗ trợ dịch vụ
            </h4>
            <p style={{ fontSize: "15px" }}>
              Hãy liên hệ với Dịch vụ chăm sóc khách hàng của chúng tôi tại{" "}
              <span>mục Chat</span> tại đơn hàng của bạn để được bộ phận tư vấn
              cụ thể.
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
            <p>
              Khi cần tư vấn về dịch vụ dọn nhà, chatbot sẽ đưa ra các gợi ý và
              thông tin liên quan đến câu hỏi của bạn về dịch vụ của chúng tôi.
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
            <p style={{ textAlign: "left" }}>
              <span className="fw-bold">Tại Cần Thơ:</span> Khu II, Đ. 3 Tháng
              2, Xuân Khánh, Ninh Kiều, Cần Thơ
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
