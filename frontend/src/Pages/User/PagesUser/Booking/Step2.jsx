import React, { useState, useEffect } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Map from "./Map";

function Step2({ check_fill, setCheckFill }) {
  return (
    <div className="booking_step_2 row" style={{ margin: "30px -125px" }}>
      <div
        className="location col-lg-6"
        style={{ overflowY: "scroll", maxHeight: "430px" }}
      >
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "10px",
                color: "#9d9d9d",
                marginBottom: "5px",
              }}
            >
              <QuestionCircleOutlined />
            </span>
            <span style={{ fontWeight: "700", fontSize: "16px" }}>
              {" "}
              Địa điểm lấy hàng
            </span>
          </h3>
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
                display: "block",
                borderRadius: "5px",
                backgroundColor: "red",
                width: "28px",
                height: "28px",
                position: "absolute",
                top: "17px",
                left: "10px",
              }}
            >
              1
            </div>
            <input
              type="text"
              placeholder="Nhập vào điểm lấy hàng"
              style={{
                width: "100%",
                height: "60px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                padding: "7px",
                paddingLeft: "50px",
                backgroundColor: "#fbfafc",
              }}
            />
          </div>

          <span style={{ fontSize: "14px", fontWeight: "400" }}>
            Thông tin địa chỉ cụ thể:
          </span>
          <input
            type="text"
            placeholder="Nhập vào thông tin cụ thể..."
            style={{
              width: "100%",
              height: "100px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              padding: "7px",
              backgroundColor: "#fbfafc",
            }}
          />
        </div>

        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "10px",
                color: "#9d9d9d",
                marginBottom: "5px",
              }}
            >
              <QuestionCircleOutlined />
            </span>
            <span style={{ fontWeight: "700", fontSize: "16px" }}>
              {" "}
              Địa điểm nhận hàng
            </span>
          </h3>
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
                display: "block",
                borderRadius: "5px",
                backgroundColor: "#00bab3 ",
                width: "28px",
                height: "28px",
                position: "absolute",
                top: "17px",
                left: "10px",
              }}
            >
              2
            </div>
            <input
              type="text"
              placeholder="Nhập vào điểm nhận hàng"
              style={{
                width: "100%",
                height: "60px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                padding: "7px",
                paddingLeft: "50px",
                backgroundColor: "#fbfafc",
              }}
            />
          </div>

          <span style={{ fontSize: "14px", fontWeight: "400" }}>
            Thông tin địa chỉ cụ thể:
          </span>
          <input
            type="text"
            placeholder="Nhập vào thông tin cụ thể..."
            style={{
              width: "100%",
              height: "100px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              padding: "7px",

              backgroundColor: "#fbfafc",
            }}
          />
        </div>
      </div>
      <div className="image_ava col-lg-6">
        <Map/>
      </div>
    </div>
  );
}

export default Step2;
