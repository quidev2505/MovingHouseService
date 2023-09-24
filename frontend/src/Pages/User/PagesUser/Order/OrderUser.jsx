import React, { useState, useEffect } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";
import axios from "axios";
import { useSelector } from "react-redux";

import { SearchOutlined } from "@ant-design/icons";

function OrderUser() {
  const [dataOrder, setDataOrder] = useState([]);

  const user = useSelector((state) => state.auth.login.currentUser); //Lấy User hiện tại ra
  const show_order_customer = async () => {
    await axios
      .get(`/v1/order/viewOrderWithCustomerId/${user._id}`)
      .then((data) => {
        console.log(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    show_order_customer();
  }, []);

  return (
    <>
      <HeaderUser />
      <div className="orderUser" style={{ padding: "30px" }}>
        <div className="d-flex" style={{ width: "420px", borderRadius: "5px", overflow: 'hidden', }}>
          <SearchOutlined
            style={{
              backgroundColor: "#ed883b",
              padding: "13px",
              color: "white",
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            id="find_service"
            className="form-control form-control-lg"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên dịch vụ"
            style={{ fontSize: "17px", borderRadius: "3px" }}
            // onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="content_order" style={{marginTop:"30px"}}>
            <div className="top_content_order">
              <h2 style={{fontSize:"28px", fontWeight:"700"}}>Đơn Hàng</h2>
            </div>

        </div>
      </div>
    </>
  );
}

export default OrderUser;
