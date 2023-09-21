import React, { useState, useEffect } from "react";

import axios from "axios";

function Step5({ check_fill, setCheckFill, totalOrder, setTotalOrder }) {
  // const [dataStep5, setDataStep5] = useState({})
  //Lấy dữ liệu từ localStorage ra hiển thị
  const get_data_from_local = () => {
    let data_from_local = JSON.parse(localStorage.getItem("order_moving"));
    const object_data = {
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
			totalOrder: data_from_local.totalOrder
    };

    console.log(object_data);
  };

  useEffect(() => {
    get_data_from_local();
  }, []);
  return (
    <div className="booking_step_5 row">
      <div className="info_order_left col-6">
        <div className="step1and2">
          <div className="top_step1and2 d-flex">
            <h2>Simple Moving</h2>
            {/* <p>
              <span>{dataStep5.step1.moving_date}</span>
              <span>{dataStep5.step1.moving_time}</span>
            </p> */}
          </div>
        </div>
      </div>
      <div
        className="payment_method_right col"
        style={{ textAlign: "center" }}
      ></div>
    </div>
  );
}

export default Step5;
