import React, { useState } from "react";
import { Image, Table, Avatar, Select } from "antd";
import CustomerSearch from "./CustomerSearch";
import DriverSearch from "./DriverSearch";
import OrderSearch from "./OrderSearch";
import RatingDriver from "./RatingDriver";
import RatingService from "./RatingService";

function SearchAdvanced() {
  const [categoryChoose, setCategoryChoose] = useState("");
  //KHU VỰC TÌM KIẾM NÂNG CAO
  //Lọc tổng hợp -> Bước 1.Chọn danh mục cần tìm
  const CategoryChangeDropDown = (value) => {
    setCategoryChoose(value);
  };

  return (
    <>
      <p
        style={{
          backgroundColor: "#FFA500",
          color: "white",
          width: "fit-content",
          fontWeight: "bold",
          display: "block",
          textAlign: "center",
          padding: "5px",
          margin: "0 auto",
          border: "1px solid #FFA500",
          borderRadius: "7px",
        }}
      >
        TÌM KIẾM TỔNG HỢP
      </p>
      <div className="d-flex" style={{ flexDirection: "column" }}>
        {/* Danh mục cần tìm */}
        <div className="d-fle mt-3" style={{ flexDirection: "column" }}>
          <h6 className="fw-bold">Danh mục</h6>
          <div className="form-outline mb-3 form_input_handle">
            <Select
              defaultValue="Chưa chọn"
              style={{
                width: 200,
              }}
              onChange={CategoryChangeDropDown}
              options={[
                {
                  value: "Chưa chọn",
                  label: "Chưa chọn",
                },
                {
                  value: "Khách hàng",
                  label: "Khách hàng",
                },
                {
                  value: "Tài xế",
                  label: "Tài xế",
                },
                {
                  value: "Đơn hàng",
                  label: "Đơn hàng",
                },
                {
                  value: "Đánh giá tài xế",
                  label: "Đánh giá tài xế",
                },
                {
                  value: "Đánh giá dịch vụ",
                  label: "Đánh giá dịch vụ",
                },
              ]}
            />
          </div>
        </div>
        {/* Khu vực Import các Search thành phần */}
        {categoryChoose == "Khách hàng" ? (
          <CustomerSearch />
        ) : categoryChoose == "Tài xế" ? (
          <DriverSearch />
        ) : categoryChoose == "Đơn hàng" ? (
          <OrderSearch />
        ) : categoryChoose == "Đánh giá tài xế" ? (
          <RatingDriver />
        ) : categoryChoose == "Đánh giá dịch vụ" ? (
          <RatingService />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default SearchAdvanced;
