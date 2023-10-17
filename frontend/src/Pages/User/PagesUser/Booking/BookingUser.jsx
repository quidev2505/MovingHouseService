import React, { useState, useEffect, useRef } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";

import { Steps, Tour } from "antd";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";

import { Toast } from "../../../../Components/ToastColor";
import axios from "axios";

function BookingUser() {
  const nav = useNavigate();
  const [current, setCurrent] = useState(0);
  const [check_fill, setCheckFill] = useState(false);

  //Thử nghiệm Tour
  const ref1 = useRef(null);
  const [open, setOpen] = useState(false);
  const steps = [
    {
      title: "Nhấn để hủy đơn",
      description: "Click vào đây đặt hàng lại !",
      target: () => ref1.current,
    },
  ];

  //Reset Order
  const [reset, setReset] = useState("");

  //Tổng giá đơn hàng
  const [totalOrder, setTotalOrder] = useState(0);

  const onChange = async (value) => {
    let check_navigate_arr = JSON.parse(
      localStorage.getItem("check_nav_booking")
    );

    if (check_navigate_arr) {
      if (!check_navigate_arr.includes(value)) {
        await Toast.fire({
          icon: "warning",
          title: "Bạn hãy hoàn thành bước hiện tại !",
        });
      } else {
        setCurrent(value);
      }
    }
  };

  useEffect(() => {
    let check_navigate_arr = localStorage.getItem("check_nav_booking");
    if (!check_navigate_arr) {
      let arr_init = [0];
      localStorage.setItem("check_nav_booking", JSON.stringify(arr_init));
    } else {
      let arr_new = JSON.parse(localStorage.getItem("check_nav_booking"));
      if (current === 4) {
        arr_new = [4];
        localStorage.setItem("check_nav_booking", JSON.stringify(arr_new));
        setOpen(true);
        setReset("Hủy bỏ đơn hàng");
      } else if (current === 5) {
        arr_new = [5];
        localStorage.setItem("check_nav_booking", JSON.stringify(arr_new));
        document.querySelector(".navigate_step").style.display = "none";
      } else if (arr_new[0] === 4) {
        setCurrent(4);
      } else {
        if (Array.isArray(arr_new)) {
          if (!arr_new.includes(current)) {
            arr_new.push(current);
          }
        }
        localStorage.setItem("check_nav_booking", JSON.stringify(arr_new));
      }
    }
  }, [current]);

  //Tạo đơn hàng
  const create_order = async () => {
    let data_from_local = JSON.parse(localStorage.getItem("order_moving"));
    const object_data = {
      totalOrder: data_from_local.totalOrder,
      service_name: data_from_local.step1.select_service,
      date_start: data_from_local.step1.moving_date,
      time_start: data_from_local.step1.moving_time,
      distance: data_from_local.step2.distance,
      duration: data_from_local.step2.duration,
      fromLocation: data_from_local.step2.fromLocation.name,
      fromLocation_detail: data_from_local.step2.from_location_detail,
      toLocation: data_from_local.step2.toLocation.name,
      toLocation_detail: data_from_local.step2.to_location_detail,
      price_vehicle: data_from_local.step3.priceStep3,
      vehicle_name: data_from_local.step3.vehicle_choose.vehicle_name,
      man_power_quantity: data_from_local.step4.man_power_count.quantity_man,
      man_power_price: data_from_local.step4.man_power_count.total_price_man,
      payment_method: data_from_local.step4.payment_method,
      note_driver: data_from_local.step4.noteDriver,
      customer_id: data_from_local.step4.customer_id,
      moving_fee: data_from_local.step4.moving_fee,
      service_fee: data_from_local.step4.service_fee,
      item_detail: data_from_local.step4.dataChooseItem,
    };

    if (object_data) {
      await axios
        .post("/v1/order/create_order", object_data)
        .then(async (data) => {
          await axios
            .post(`https://app.nativenotify.com/api/notification`, {
              appId: 13475,
              appToken: "xmmYdFdEmeO1apoZvNDbgd",
              title: "[🚛] Đơn hàng mới vừa được tạo ! [🚛]",
              body: `[📅] - ID đơn hàng: ${data.data.order_id} [📅]`,
              dateSent: Date.now(),
            })
            .then((data1) => {
              console.log(data1);
            })
            .catch((e) => {
              console.log(e);
            });
          setCurrent(current + 1);
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Đặt dịch vụ thất bại !",
            text: "Hãy thử lại !",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    }
  };

  return (
    <>
      <HeaderUser />
      <div className="bookingUser container" style={{ height: "1500px" }}>
        <div className="top_process">
          <Steps
            current={current}
            onChange={onChange}
            items={[
              {
                title: "Bước 1",
                description: "Thời gian vận chuyển",
              },
              {
                title: "Bước 2",
                description: "Thông tin vận chuyển",
              },
              {
                title: "Bước 3",
                description: "Chọn loại phương tiện",
              },
              {
                title: "Bước 4",
                description: "Dịch vụ thêm",
              },
              {
                title: "Bước 5",
                description: "Xem lại và thanh toán",
              },
              {
                title: "Bước 6",
                description: "Hoàn tất",
              },
            ]}
          />
        </div>

        <div
          className="form_step"
          style={{
            marginTop: "30px",
            margin: "30px 150px",
          }}
        >
          {current === 0 ? (
            <Step1 check_fill={check_fill} setCheckFill={setCheckFill} />
          ) : current === 1 ? (
            <Step2
              check_fill={check_fill}
              setCheckFill={setCheckFill}
              current={current}
              setCurrent={setCurrent}
            />
          ) : current === 2 ? (
            <Step3
              check_fill={check_fill}
              setCheckFill={setCheckFill}
              totalOrder={totalOrder}
              setTotalOrder={setTotalOrder}
            />
          ) : current === 3 ? (
            <Step4
              check_fill={check_fill}
              setCheckFill={setCheckFill}
              totalOrder={totalOrder}
              setTotalOrder={setTotalOrder}
            />
          ) : current === 4 ? (
            <Step5
              check_fill={check_fill}
              setCheckFill={setCheckFill}
              totalOrder={totalOrder}
              setTotalOrder={setTotalOrder}
            />
          ) : current === 5 ? (
            <Step6 />
          ) : (
            ""
          )}
        </div>

        <div className="navigate_step container">
          <div
            ref={ref1}
            className="btn_navigate_back"
            style={{ width: "fit-content" }}
            onClick={() => {
              if (current === 0) {
                nav("/");
              } else if (current === 4) {
                Swal.fire({
                  title: "Bạn muốn hủy bỏ đơn hàng",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Xác nhận",
                }).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem("check_nav_booking");
                    localStorage.removeItem("order_moving");
                    localStorage.removeItem("vehicle_count");
                    setTimeout(() => {
                      setTotalOrder(0);
                      nav("/user/booking");
                      setCurrent(0);
                      setCheckFill(false);
                    }, 1000);
                  }
                });
              } else {
                setCurrent(current - 1);
              }
            }}
          >
            {reset !== "" ? <DeleteOutlined /> : <ArrowLeftOutlined />}
            &nbsp;
            {reset !== "" ? reset : "Trở về"}
          </div>
          <Tour
            open={open}
            onClose={() => setOpen(false)}
            steps={steps}
            indicatorsRender={(current, total) => (
              <span>
                {current + 1} / {total}
              </span>
            )}
          />
          <div className="d-flex row">
            <div
              className="total_order col"
              style={{
                backgroundColor: "white",
                border: "1px solid rgb(204, 204, 204)",
                width: "400px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              <span
                style={{
                  color: "#ed883b",
                  fontSize: "14px",
                  fontWeight: "400",
                  width: "68px",
                }}
              >
                Tổng cộng
              </span>
              <h3
                style={{
                  fontWeight: "600",
                  marginLeft: "10px",
                  fontSize: "20px",
                }}
              >
                {totalOrder.toLocaleString()} đ
              </h3>
            </div>
            <div
              className="btn_navigate_to col"
              style={{
                display: check_fill ? "flex" : "none",
              }}
              onClick={() => {
                if (current === 3) {
                  Swal.fire({
                    title: "Bạn muốn đến bước 5 ?",
                    text: "Sẽ không thể thay đổi các lựa chọn trước đây",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Xác nhận",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      setCurrent(current + 1);
                    }
                  });
                } else if (current === 4) {
                  Swal.fire({
                    title: "Hoàn tất đơn hàng ?",
                    text:
                      "Nếu đã hoàn thành thông tin đặt hàng, hãy chọn Xác nhận !",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Xác nhận",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      create_order();
                    }
                  });
                } else {
                  setCurrent(current + 1);
                }
              }}
            >
              Tiếp tục
              <ArrowRightOutlined />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingUser;
