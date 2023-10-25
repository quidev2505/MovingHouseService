import React,{useState} from "react";
import { Image, Table, Avatar, Select } from "antd";
import CustomerSearch from "./CustomerSearch";

function SearchAdvanced() {
  const [categoryChoose, setCategoryChoose] = useState("");
  //KHU VỰC TÌM KIẾM NÂNG CAO
  //Lọc tổng hợp -> Bước 1.Chọn danh mục cần tìm
  const CategoryChangeDropDown = (value) => {
    setCategoryChoose(value);
  };

  return (
    <>
      <h5
        style={{
          color: "#F16622",
          fontWeight: "bold",
          display: "block",
          textAlign: "center",
        }}
      >
        TÌM KIẾM TỔNG HỢP
      </h5>
      <div className="d-flex" style={{flexDirection:"column"}}>
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
                  value: "Quản trị viên",
                  label: "Quản trị viên",
                },
                {
                  value: "Dịch vụ",
                  label: "Dịch vụ",
                },
                {
                  value: "Phương tiện",
                  label: "Phương tiện",
                },
                {
                  value: "Blog",
                  label: "Blog",
                },
                {
                  value: "Vật dụng",
                  label: "Vật dụng",
                },
                {
                  value: "Đơn hàng",
                  label: "Đơn hàng",
                },
                {
                  value: "Lịch vận chuyển",
                  label: "Lịch vận chuyển",
                },
              ]}
            />
          </div>
        </div>
        {/* Khu vực Import các Search thành phần */}
        {categoryChoose == "Khách hàng" ? <CustomerSearch /> : ""}
      </div>
    </>
  );
}

export default SearchAdvanced;
