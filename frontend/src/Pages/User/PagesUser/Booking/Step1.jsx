import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { TimePicker } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function Step1({ check_fill, setCheckFill }) {
  const [date, setDate] = useState();

  const handleChange_Date = (newDate) => {
    setDate(newDate);
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
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
    if (date !== undefined && time !== undefined) {
      setCheckFill(true);

      let date_choose = document.querySelector("#date_choose").value;
      let time_choose = document.querySelector("#time_choose").value;

      const object_order = {
        step1: {
          moving_date: date_choose,
          moving_time: time_choose,
        },
      };

      localStorage.setItem("order_moving", JSON.stringify(object_order));
    }
  }, [date, time]);

  useEffect(() => {
    if (localStorage.getItem("order_moving")) {
      let data = JSON.parse(localStorage.getItem("order_moving"));
      console.log(data)
      // setDate(data.step1.moving_date)
      // setTime(data.step1.moving_time);
      document.querySelector("#date_choose").value = data.step1.moving_date;
      document.querySelector("#time_choose").value = data.step1.moving_time;
    }
  }, []);

  return (
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
        <p style={{ fontSize: "18px", fontWeight: "400px", color: "#ed883b" }}>
          Dọn nhà trọn gói
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
          Tùy chỉnh đơn đặt dịch vụ của bạn. Thêm vào loại phương tiện, dịch vụ
          thêm, và các dịch vụ khác.
        </p>
      </div>
    </div>
  );
}

export default Step1;
