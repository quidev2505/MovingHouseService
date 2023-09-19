import React, { useState, useEffect } from "react";

import { QuestionCircleOutlined } from "@ant-design/icons";

import axios from "axios";

function Step3({ check_fill, setCheckFill }) {
  const [domvehicle_left, setDomVehicleLeft] = useState();

  const get_list_vehicle = async () => {
    await axios
      .get(`/v1/vehicle/list_vehicle`)
      .then((data) => {
        let data_vehicle = data.data;
        let arr_data_vehicle_left = data_vehicle.map((item, index) => {
          let ob = {
            img: item.image,
            vehicle_name: item.vehicle_name,
          };

          return ob;
        });

        let DOM_VEHICLE_LEFT = arr_data_vehicle_left.map((item, index) => {
          return (
            <div
              className="col-4"
              style={{
                width: "120px",
                height: "96px",
                backgroundColor: "#f4f4f4",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
								cursor:"pointer"
              }}
            >
              <img
                alt="anh_dai_dien_vehicle"
                src={item.img}
                style={{ width: "75px", height: "44px" }}
              />
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  marginTop: "5px",
                }}
              >
                {item.vehicle_name}
              </p>
            </div>
          );
        });

        setDomVehicleLeft(DOM_VEHICLE_LEFT);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    get_list_vehicle();
  }, []);
  return (
    <div className="booking_step_3 row">
      <div className="time_choose col-5">
        <h3
          style={{
            fontSize: "18px",
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
          Loại phương tiện bạn cần là gì ?
        </h3>
        <p style={{ fontSize: "14px", fontWeight: "400" }}>
          Nhân công bốc vác không thể chọn ở đây, bạn có thể chọn ở dịch vụ thêm
        </p>

        <br></br>

        <div className="choose_vehicle">
          <div className="row">{domvehicle_left}</div>
        </div>
      </div>
      <div className="image_ava col">
        <img
          src="./img/step1.avif"
          style={{ width: "550px", height: "300px", objectFit: "contain" }}
          alt="anh"
        />
        <p
          style={{
            fontSize: "14px",
            fontWeight: "400",
            width: "300px",
            margin: "0 auto",
          }}
        >
          Tùy chỉnh đơn đặt dịch vụ của bạn. Thêm vào loại phương tiện, dịch vụ
          thêm, và các dịch vụ khác.
        </p>
      </div>
    </div>
  );
}

export default Step3;
