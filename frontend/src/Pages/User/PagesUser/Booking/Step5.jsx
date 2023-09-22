import React, { useState, useEffect } from "react";

import { Tag, Space } from "antd";

import { useSelector } from "react-redux";

function Step5({ check_fill, setCheckFill, totalOrder, setTotalOrder }) {
  const user = useSelector((state) => state.auth.login.currentUser); //Lấy User hiện tại ra

  //Thanh toán trực tuyến
  const [onlineMethod, setOnlineMethod] = useState(true);

  //Phương thức thanh toán
  const [choosemethod, setChooseMethod] = useState("Thanh toán cho tài xế");

  const [dataStep5, setDataStep5] = useState({});
  //Lấy dữ liệu từ localStorage ra hiển thị
  const get_data_from_local = () => {
    let data_from_local = JSON.parse(localStorage.getItem("order_moving"));
    const object_data = {
      service_name: data_from_local.step1.select_service,
      moving_date: data_from_local.step1.moving_date,
      moving_time: data_from_local.step1.moving_time,
      distance: data_from_local.step2.distance,
      fromLocation: data_from_local.step2.fromLocation.name,
      from_location_detail: data_from_local.step2.from_location_detail,
      toLocation: data_from_local.step2.toLocation.name,
      to_location_detail: data_from_local.step2.to_location_detail,
      price_vehicle: data_from_local.step3.priceStep3,
      name_vehicle: data_from_local.step3.vehicle_choose.vehicle_name,
      man_power: {
        quantity: data_from_local.step4.man_power_count.quantity_man,
        price: data_from_local.step4.man_power_count.total_price_man,
      },
      moving_fee: data_from_local.step4.moving_fee,
      service_fee: data_from_local.step4.service_fee,
      noteDriver: data_from_local.step4.noteDriver,
      dataChooseItem: data_from_local.step4.dataChooseItem,
      totalOrder: data_from_local.totalOrder,
    };

    console.log(object_data);

    if (object_data) {
      setDataStep5(object_data);
    }

    setTotalOrder(object_data.totalOrder);
  };

  useEffect(() => {
    get_data_from_local();
  }, []);

  return (
    <div
      className="booking_step_5 row"
      style={{ margin: "40px -210px 0 -210px" }}
    >
      <div className="info_order_left col-6" style={{ width: "650px" }}>
        <div
          className="step1and2"
          style={{
            border: "1px solid #ccc",
            borderRadius: "7px",
            overflow: "hidden",
            height: "fit-content",
            marginBottom: "10px",
          }}
        >
          <div
            className="top_step1and2 d-flex"
            style={{
              height: "70px",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              backgroundColor: "#ed883b",
              color: "white",
            }}
          >
            <h5 style={{ fontSize: "20px", fontWeight: "700" }}>
              {dataStep5.service_name}
            </h5>
            <h6 style={{ fontSize: "14px", fontWeight: "700" }}>
              {dataStep5.moving_date} @ {dataStep5.moving_time}
            </h6>
          </div>
          <div className="content_step1and2" style={{ padding: "20px" }}>
            <h6
              style={{
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              Thông tin vận chuyển
            </h6>
            <div className="row">
              <div className="col">
                <div className="d-flex">
                  <span
                    style={{
                      width: "25px",
                      height: "25px",
                      backgroundColor: "red",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      color: "white",
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}
                  >
                    1
                  </span>
                  <p>{dataStep5.fromLocation}</p>
                </div>
                <br></br>
                <div className="d-flex">
                  <span
                    style={{
                      width: "25px",
                      height: "25px",
                      backgroundColor: "#00bab3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      color: "white",
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}
                  >
                    2
                  </span>
                  <p>{dataStep5.toLocation}</p>
                </div>
              </div>
              <div className="col">
                <div>
                  <p style={{ color: "#a6acb7" }}>
                    {dataStep5.from_location_detail}
                  </p>
                  <br></br>
                </div>
                <div>
                  <p style={{ color: "#a6acb7" }}>
                    {dataStep5.to_location_detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="step3and4"
          style={{
            border: "1px solid #ccc",
            borderRadius: "7px",
            overflow: "hidden",
            height: "fit-content",
            padding: "20px",
          }}
        >
          <div className="vehicle_choose">
            <p style={{ fontSize: "16px", fontWeight: "700" }}>
              Phương tiện vận chuyển
            </p>
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <span>
                {dataStep5.name_vehicle}&nbsp; ({dataStep5.distance})
              </span>
              <span className="fw-bold">
                {dataStep5.price_vehicle
                  ? dataStep5.price_vehicle.toLocaleString()
                  : ""}{" "}
                đ
              </span>
            </div>
          </div>

          <hr></hr>

          <div className="extra_service">
            <p style={{ fontSize: "16px", fontWeight: "700" }}>Dịch vụ thêm</p>
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <span>
                Nhân công bốc xếp &nbsp; (x
                {dataStep5.man_power ? dataStep5.man_power.quantity : ""})
              </span>
              <span className="fw-bold">
                {dataStep5.man_power
                  ? dataStep5.man_power.price.toLocaleString()
                  : ""}{" "}
                đ
              </span>
            </div>
            {dataStep5.moving_fee &&
              dataStep5.moving_fee.map((item, index) => (
                <>
                  <div
                    className="d-flex"
                    style={{ justifyContent: "space-between" }}
                  >
                    <span>{item.name.split("(")[0]} &nbsp;</span>
                    <span className="fw-bold">
                      {item.price ? item.price.toLocaleString() : ""} đ
                    </span>
                  </div>
                </>
              ))}

            {dataStep5.service_fee &&
              dataStep5.service_fee.map((item, index) => (
                <>
                  <div
                    className="d-flex"
                    style={{ justifyContent: "space-between" }}
                  >
                    <span>{item.name.split("(")[0]} &nbsp;</span>
                    <span className="fw-bold">
                      {item.price ? item.price.toLocaleString() : ""} đ
                    </span>
                  </div>
                </>
              ))}
          </div>

          <hr></hr>

          <div className="note_driver">
            <p style={{ fontSize: "16px", fontWeight: "700" }}>
              Ghi chú cho tài xế
            </p>
            <div>
              <span>{dataStep5.noteDriver}</span>
            </div>
          </div>

          <hr></hr>
          <div className="item_detail">
            <p style={{ fontSize: "16px", fontWeight: "700" }}>
              Chi tiết hàng hóa
            </p>
            <div>
              <Space size={[0, 8]} wrap>
                {dataStep5.dataChooseItem &&
                  dataStep5.dataChooseItem.map((item, index) => (
                    <Tag color="orange">{item}</Tag>
                  ))}
              </Space>
            </div>
          </div>
        </div>
      </div>
      <div className="payment_method_right col" style={{ marginLeft: "40px" }}>
        <div className="account_detail">
          <h4 style={{ fontWeight: "700", fontSize: "16px" }}>
            Chi tiết tài khoản
          </h4>
          <div
            className="d-flex"
            style={{
              justifyContent: "space-between",
              fontWeight: "400",
              fontSize: "14px",
              width: "300px",
            }}
          >
            <span style={{ color: "#a6acb7" }}>Tên khách hàng:</span>
            <span>{user.fullname}</span>
          </div>
          <div
            className="d-flex"
            style={{
              justifyContent: "space-between",
              width: "300px",
              fontWeight: "400",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#a6acb7" }}>Email: </span>
            <span>{user.email}</span>
          </div>
          <div
            className="d-flex"
            style={{
              justifyContent: "space-between",
              width: "300px",
              fontWeight: "400",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#a6acb7" }}>Số điện thoại:</span>
            <span>{user.phonenumber}</span>
          </div>
        </div>
        <hr></hr>
        <div className="payment">
          <h4
            style={{
              fontWeight: "700",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            Thanh toán
          </h4>
          <div
            className="total_order d-flex"
            style={{
              justifyContent: "space-between",
              border: "1px solid #ccc",
              padding: "5px",
              borderRadius: "5px",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "20px", fontWeight: "400", color: "#e89f67" }}
            >
              Tổng tiền
            </span>
            <span
              className="fw-bold"
              style={{ fontSize: "30px", fontWeight: "700" }}
            >
              {dataStep5.totalOrder && dataStep5.totalOrder.toLocaleString()} đ
            </span>
          </div>
        </div>

        <h4
          style={{
            fontWeight: "700",
            fontSize: "16px",
            marginBottom: "20px",
            marginTop: "30px",
          }}
        >
          Vui lòng chọn phương thức thanh toán
        </h4>

        <div className="d-flex">
          <div
            onClick={() => {
              setChooseMethod("Thanh toán cho tài xế");
              setCheckFill(true);
              setOnlineMethod(true);
            }}
            className="col-4 item_vehicle"
            style={{
              width: "fit-content",
              height: "110px",
              backgroundColor: "#f4f4f4",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "5px",
              margin: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              cursor: "pointer",
              marginRight: "20px",
            }}
          >
            <img
              alt="anh_dai_dien_vehicle"
              src="./img/ondelivery.png"
              style={{ width: "75px", height: "44px", objectFit: "contain" }}
            />
            <p
              style={{
                fontSize: "14px",
                fontWeight: "700",
                marginTop: "5px",
                color: "#266c26",
              }}
            >
              Thanh toán cho tài xế
            </p>
          </div>

          <div
            onClick={() => {
              setChooseMethod("Thanh toán trực tuyến");
              setCheckFill(false);
              setOnlineMethod(false);
            }}
            className="col-4 item_vehicle"
            style={{
              width: "fit-content",
              height: "110px",
              backgroundColor: "#f4f4f4",
              border: "1px solid #ccc",
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
              src="./img/pngwing.com.png"
              style={{ width: "75px", height: "44px", objectFit: "contain" }}
            />
            <p
              style={{
                fontSize: "14px",
                fontWeight: "700",
                marginTop: "5px",
                color: "#179bd7",
              }}
            >
              Thanh toán trực tuyến
            </p>
          </div>


          {/* Đây là thanh toán trực tuyến */}
          <div>
            <div
              className="btn_navigate_to col"
              style={{
                display: onlineMethod ? "none" : "flex",
                padding: "10px",
                backgroundColor: "#fed03f",
                borderRadius: "5px",
                color: "white",
                marginLeft: "100px",
                cursor: "pointer",
                width:"100px",
                alignItems:"center",
                justifyContent:"center"
              }}
              id="online_method_payment"
            >
              <img
                src="./img/payment.jpg"
                width="100px"
                height="100px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          {choosemethod === "Thanh toán cho tài xế" ? (
            <>
              <h4 style={{ color: "#266c26", fontWeight: "bold" }}>
                Thanh toán cho tài xế
              </h4>
              <p>
                Chỉ cần thanh toán cho tài xế sau khi đã hoàn thành công việc.
              </p>
            </>
          ) : (
            <>
              <h4 style={{ color: "#179bd7", fontWeight: "bold" }}>
                Thanh toán trực tuyến
              </h4>
              <p>Thanh toán đơn giản với Paypal !</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step5;
