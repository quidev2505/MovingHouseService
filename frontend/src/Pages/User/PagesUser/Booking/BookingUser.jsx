import React, { useState, useEffect } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";

import { Steps } from "antd";
import { useNavigate } from "react-router-dom";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Step1 from "./Step1";

function BookingUser() {
  const nav = useNavigate();
  const [current, setCurrent] = useState(0);
  const [check_fill, setCheckFill] = useState(false)

  const onChange = (value) => {
    console.log("onChange:", value);
    setCurrent(value);
  };



  return (
    <>
      <HeaderUser />
      <div className="bookingUser container">
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
                description: "Review đơn hàng",
              },
              {
                title: "Bước 6",
                description: "Thanh toán và hoàn tất",
              },
            ]}
          />
        </div>

        <div className="form_step" style={{marginTop:"30px", margin: "30px 150px"}}>
            {current === 0 ? <Step1 check_fill={check_fill} setCheckFill={setCheckFill}/> : ''}
        </div>

        <div className="navigate_step container">
          <div
            className="btn_navigate_back"
            onClick={() => {
              if (current === 0) {
                nav("/");
              } else {
                setCurrent(current - 1);
              }
            }}
          >
            <ArrowLeftOutlined />
            Trở về
          </div>
          <div
            className="btn_navigate_to"
            style={{display: check_fill ? 'flex' : 'none'}}
            onClick={() => setCurrent(current + 1)}
          >
            Tiếp tục
            <ArrowRightOutlined />
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingUser;
