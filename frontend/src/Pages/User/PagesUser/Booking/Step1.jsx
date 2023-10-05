import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { TimePicker } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { Toast } from "../../../../Components/ToastColor";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";

import axios from "axios";

function Step1({ check_fill, setCheckFill }) {
  const [isActive, setIsActive] = useState(true);
  const [date, setDate] = useState();

  const [selectService, setSelectService] = useState("Chuyển nhà theo yêu cầu");

  const handleChange_Date = (newDate) => {
    setDate(newDate);
  };

  const disabledDate = (current) => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 18) {
      // Can not select days before today and today -> Chuyển qua ngày hôm sau
      return current && current < dayjs().endOf("day");
    } else {
      // Can not select days before yesterday and yesterday -> Có thể chọn ngày hiện tại
      return (
        current &&
        current <
          dayjs()
            .subtract(1, "day")
            .endOf("day")
      );
    }
  };

  const [time, setTime] = useState();

  const disabledDateTime = () => ({
    disabledHours: () => range(8, 21),
  });

  const range = (start, end) => {
    const result = [];
    for (let i = 0; i < start; i++) {
      result.push(i);
    }

    for (let j = end; j < 24; j++) {
      result.push(j);
    }

    return result;
  };

  const handleChange_Time = (newTime) => {
    setTime(newTime);
  };

  useEffect(() => {
    if (date !== undefined && time !== undefined && selectService !== "") {
      let date_choose = document.querySelector("#date_choose").value;
      let time_choose = document.querySelector("#time_choose").value;

      let today = document.querySelector("#date_choose").value;
      let today_split = today.slice(0, 2);

      const ngayhomnay = new Date();
      const result_homnay = ngayhomnay.getDate();

      if (today_split == result_homnay) {
        //Lấy giờ hiện tại
        const now = new Date();
        const hour = now.getHours();

        //Xử lý giờ chọn
        let hour_choose = time_choose.split(":")[0];

        if (hour_choose < hour) {
          //Trường hợp giờ nhỏ hơn giờ hiện tại
          Toast.fire({
            icon: "warning",
            title: "Vui lòng chọn giờ lớn hơn giờ hiện tại !",
          });
          document.querySelector("#time_choose").value = "";
        } else {
          setCheckFill(true);

          const object_order = {
            step1: {
              select_service: selectService,
              moving_date: date_choose,
              moving_time: time_choose,
            },
          };

          localStorage.setItem("order_moving", JSON.stringify(object_order));
        }
      } else {
        setCheckFill(true);

        const object_order = {
          step1: {
            select_service: selectService,
            moving_date: date_choose,
            moving_time: time_choose,
          },
        };

        localStorage.setItem("order_moving", JSON.stringify(object_order));
      }
    }
  }, [date, time, selectService]);

  const [dataService, setDataService] = useState([]);
  const get_service = async () => {
    await axios
      .get(`/v1/service/list_service`)
      .then((data) => {
        let data_solve = data.data;
        let arr_result = data_solve.map((item, index) => {
          return item.name;
        });

        setDataService(arr_result);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("order_moving")) {
      let data = JSON.parse(localStorage.getItem("order_moving"));
      setTimeout(() => {
        if (
          document.querySelector("#date_choose") &&
          document.querySelector("#time_choose")
        ) {
          document.querySelector("#date_choose").value = data.step1.moving_date;
          document.querySelector("#time_choose").value = data.step1.moving_time;
        }
      }, 3000);
    }

    if (localStorage.getItem("you_choose_service")) {
      let data_service_Choose = JSON.parse(
        localStorage.getItem("you_choose_service")
      );

      setSelectService(data_service_Choose);
    }
    get_service();
    setIsActive(false);
  }, []);

  return (
    <LoadingOverlayComponent status={isActive}>
      <div className="booking_step_1 row">
        <div className="time_choose col">
          <p
            style={{
              fontSize: "12px",
              fontWeight: "400",
              color: "#9d9d9d",
              marginBottom: "5px",
            }}
          >
            Loại dịch vụ
          </p>
          <p
            style={{ fontSize: "18px", fontWeight: "400px", color: "#ed883b" }}
          >
            <select
              value={selectService}
              onChange={(e) => setSelectService(e.target.value)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                color: "#e16c27",
                fontWeight: "bold",
              }}
            >
              {dataService.map((item, index) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
          </p>
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
            Khi nào bạn muốn chuyển nhà ?
          </h3>

          <br></br>
          <span style={{ fontSize: "14px", fontWeight: "400" }}>
            Ngày vận chuyển:
          </span>
          <DatePicker
            format="DD/MM/YYYY"
            selected={date}
            onChange={handleChange_Date}
            disabledDate={disabledDate}
            id="date_choose"
            placeholder="Chọn ngày chuyển"
            style={{ width: "400px", height: "60px", marginBottom: "15px" }}
          />

          <br></br>
          <span style={{ fontSize: "14px", fontWeight: "400" }}>
            Giờ vận chuyển:
          </span>
          <br></br>
          <TimePicker
            selected={time}
            id="time_choose"
            disabledTime={disabledDateTime}
            placeholder="Chọn giờ chuyển"
            format="HH:mm"
            style={{ width: "400px", height: "60px" }}
            onChange={handleChange_Time}
          />
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
            Tùy chỉnh đơn đặt dịch vụ của bạn. Thêm vào loại phương tiện, dịch
            vụ thêm, và các dịch vụ khác.
          </p>
        </div>
      </div>
    </LoadingOverlayComponent>
  );
}

export default Step1;
