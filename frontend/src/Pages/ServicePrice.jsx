import React from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

// Ant Design
import { InputNumber } from "antd";

//Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";


function ServicePrice() {
  return (
    <>
      <Header />
      {/* Công cụ tra cứu giá cước thuê xe tải - Start Service Search Price Hire Lorry*/}
      <div className="tool_search_price_hireLorry">
        <div className="imgService container d-flex">
          <h1
            className="col-lg-4"
            style={{ fontSize: "80px", fontWeight: "900" }}
          >
            Giá dịch vụ dọn nhà
          </h1>
          <img
            src="./img/giadichvu.jpg"
            class="img-fluid col-lg"
            alt="..."
            style={{ height: "300px", width: "100%", objectFit: "cover" }}
          ></img>
        </div>
        <div className="tool_calculator container">
          <div
            className="header_tool"
            style={{
              backgroundColor: "#e16c27",
              color: "#fff",
              height: "70px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <h1>Công cụ tính giá cước thuê xe tải</h1>
          </div>
          <div
            className="container_Input_result row container"
            style={{
              border: "1px solid #e16c27",
              borderRadius: "5px",
              padding: "10px",
              margin:"10px 0"
            }}
          >
            <div>
              <div className="d-flex">
                <h5 style={{ color: "#e16c27" }}>
                  Nhập vào số Kilomet cần vận chuyển: &nbsp;
                </h5>
                <div className="col left_input">
                  <InputNumber
                    min={1}
                    max={99999}
                    defaultValue={1}
                    placeholder="Số km..."
                  />
                </div>
              </div>

              <p style={{ fontStyle: "italic" }}>
                Lưu ý: Từ 45km trở lên sẽ được tính là xe đường dài
              </p>
            </div>

            <div>
              <FontAwesomeIcon
                icon={faCircleRight}
                style={{ color: "#e16c27" }}
              />
            </div>

            <div className="right_result"></div>
          </div>
        </div>
      </div>
      {/* End Service Search Price Hire Lorry */}
      <Footer />
    </>
  );
}

export default ServicePrice;
