import React, { useState, useEffect } from "react";

import { QuestionCircleOutlined } from "@ant-design/icons";

import axios from "axios";

function Step3({ check_fill, setCheckFill, totalOrder, setTotalOrder }) {
  const [domvehicle_left, setDomVehicleLeft] = useState("");
  const [domvehicle_right, setDomVehicleRight] = useState("");

  const [selectVehicle, setSelectVehicle] = useState({});

  const get_list_vehicle = async () => {
    await axios
      .get(`/v1/vehicle/list_vehicle`)
      .then((data) => {
        let data_vehicle = data.data;
        let arr_data_vehicle_left = data_vehicle.map((item, index) => {
          let ob = {
            image: item.image,
            vehicle_name: item.vehicle_name,
            brand: item.brand,
            capacity: item.capacity,
            cago_size: item.cago_size,
            suitable_for: item.suitable_for,
            movingFee_id: item.movingFee_id,
            moving_ban_time: item.moving_ban_time,
          };

          return ob;
        });

        let DOM_VEHICLE_LEFT = arr_data_vehicle_left.map((item, index) => {
          return (
            <div
              onClick={() => chooseVehicle(item)}
              className="col-4 item_vehicle"
              style={{
                width: "120px",
                height: "110px",
                backgroundColor: "#f4f4f4",
                borderRadius: "5px",
                padding: "5px",
                margin: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              <img
                alt="anh_dai_dien_vehicle"
                src={item.image}
                style={{ width: "75px", height: "44px", objectFit: "contain" }}
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

  const chooseVehicle = (objectVehicle) => {
    setSelectVehicle(objectVehicle);
    let DOM_VEHICLE_RIGHT = (
      <div
        className="d-flex"
        style={{ flexDirection: "column", alignItems: "center" }}
      >
        <img
          alt="hinhanh"
          src={objectVehicle.image}
          style={{ width: "343px", height: "243px", objectFit: "contain" }}
        />
        <h6 style={{ fontSize: "16px", fontWeight: "700" }}>
          {objectVehicle.vehicle_name}
        </h6>
        <p>Thương hiệu: {objectVehicle.brand}</p>
        <div style={{ fontSize: "12px", fontWeight: "400" }}>
          <p>
            <span>Kích cỡ hàng hóa tối đa: {objectVehicle.cago_size}</span>|{" "}
            <span>Trọng lượng tối đa: {objectVehicle.capacity}</span>
          </p>
          <p className="fw-bold">Phù hợp cho: {objectVehicle.suitable_for}</p>
          <p>
            Thời gian cấm tải:{" "}
            <span className="fw-bold" style={{ color: "#ed883b " }}>
              {objectVehicle.moving_ban_time}
            </span>
          </p>
        </div>
      </div>
    );

    setDomVehicleRight(DOM_VEHICLE_RIGHT);

    //Tính giá tiền khi đã chọn loại xe
    //Lấy khoảng cách từ LocalStorage
    let data_localStorage = JSON.parse(localStorage.getItem("order_moving"));
    let distance = data_localStorage.step2.distance.split(" ")[0];
    calculatePrice(distance, objectVehicle.vehicle_name);
  };

  const calculatePrice = async (distance, selectVehicle) => {
    await axios
      .post("/v1/vehicle/moving_fee", { name_vehicle: selectVehicle })
      .then((data) => {
        let total_price = 0;
        if (distance < 10) {
          total_price = data.data.priceFirst10km;
        } else {
          if (distance - 10 < 45) {
            total_price =
              data.data.priceFirst10km +
              (distance - 10) * data.data.priceFrom11to45;
          } else {
            total_price =
              data.data.priceFirst10km +
              (distance - 10) * data.data.pricePer45km;
          }
        }

        setTotalOrder(total_price);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("order_moving")) {
      //Khi đã nhập rồi thì lấy dữ liệu ra trong localStorage
      let data = JSON.parse(localStorage.getItem("order_moving"));
      let step3 = data.step3;

      if (step3) {
        chooseVehicle(step3.vehicle_choose);
        setTotalOrder(data.totalOrder);
      }
      get_list_vehicle();
    }
  }, []);

  //Lưu dữ liệu vào LocalStorage
  useEffect(() => {
    if (totalOrder !== undefined && selectVehicle !== undefined) {
      setCheckFill(true);
      //Tạo object lưu vào local cũ
      const object_order_local = JSON.parse(
        localStorage.getItem("order_moving")
      );

      object_order_local.totalOrder = totalOrder;

      const step3 = {
        vehicle_choose: selectVehicle,
      };

      object_order_local.step3 = step3;
      object_order_local.step3.priceStep3 = totalOrder

      localStorage.setItem("order_moving", JSON.stringify(object_order_local));
    }
  }, [totalOrder, selectVehicle]);

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

        <div className="choose_vehicle">
          <div className="row">{domvehicle_left}</div>
        </div>
      </div>
      <div className="info_vehicle col" style={{ textAlign: "center" }}>
        {domvehicle_right ? (
          domvehicle_right
        ) : (
          <img
            src="./img/xe_trong.png"
            style={{
              objectFit: "contain",
              width: "400px",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              margin: "0 auto",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Step3;
