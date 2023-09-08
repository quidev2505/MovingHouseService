import { React, useState, useEffect } from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

// Ant Design
import { InputNumber, Button, Alert } from "antd";

//Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function ServicePrice() {
  //Loading
  const [loadings, setLoadings] = useState([]);
  //Set Hide or appear
  const [hide, setHide] = useState("none");

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      setHide("block");
    }, 2000);
  };

  const [dataFee, setDataFee] = useState([]);

  const get_fee_service = async () => {
    await axios.get(`/v1/service_fee/list_service_fee`).then((data) => {
      let data_service_fee = data.data;
      let arrDOMFee = data_service_fee.map((item, index) => (
        <tr>
          <td>{item.fee_name}</td>
          <td>
            {item.price.toLocaleString()} đ / {item.unit}
          </td>
        </tr>
      ));

      setDataFee(arrDOMFee);
    });
  };

  const [dataLoading, setDataLoading] = useState([]);
  const [dataHire, setDataHire] = useState([]);

  const get_vehicle = async () => {
    await axios.get(`/v1/vehicle/list_movingFee`).then((data) => {
      let data_result = data.data;

      let arrDOMHire = data_result.map((item, index) => (
        <tr>
          <td>{item.name}</td>
          <td>{item.priceFirst10km.toLocaleString()} đ</td>
          <td>{item.priceFrom11to45.toLocaleString()} đ</td>
          <td>{item.pricePer45km.toLocaleString()} đ</td>
          <td>{item.waiting_fee.toLocaleString()} đ</td>
        </tr>
      ));

      setDataHire(arrDOMHire);

      let arrDOMLoading = data_result.map((item, index) => (
        <tr>
          <td>{item.name}</td>
          <td>{item.TwowayFloor_loadingFee.toLocaleString()} đ</td>
          <td>{item.OnewayFloor_loadingFee.toLocaleString()} đ</td>
          <td>{item.Twoway_loadingFee.toLocaleString()} đ</td>
          <td>{item.Oneway_loadingFee.toLocaleString()} đ</td>
        </tr>
      ));

      setDataLoading(arrDOMLoading);
    });
  };

  useEffect(() => {
    get_fee_service();
    get_vehicle();
  }, []);
  return (
    <>
      <Header />
      {/* Công cụ tra cứu giá cước thuê xe tải - Start Service Search Price Hire Lorry*/}
      <div className="tool_search_price_hireLorry">
        <div
          className="imgService container d-flex"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <h1
            className="col-lg-4"
            style={{ fontSize: "80px", fontWeight: "600" }}
          >
            Giá dịch vụ dọn nhà
          </h1>
          <img
            src="./img/giadichvu.jpg"
            class="img-fluid col-lg"
            alt="..."
            style={{ height: "300px", width: "100%", objectFit: "cover" }}
          ></img>
        </div>
        <div className="tool_calculator container">
          <div
            className="header_tool"
            style={{
              backgroundColor: "#e16c27",
              color: "#fff",
              height: "70px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <h2>Công cụ tính giá cước thuê xe tải</h2>
          </div>
          <div
            className="container_Input_result row container"
            style={{
              border: "1px solid #e16c27",
              borderRadius: "5px",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <div className="d-flex">
              <div className="d-flex" style={{ flexDirection: "column" }}>
                <div className="d-flex">
                  <h5 style={{ color: "#e16c27" }}>
                    Nhập vào số Kilomet cần vận chuyển: &nbsp;
                  </h5>
                  <div className="col left_input">
                    <InputNumber
                      min={1}
                      max={99999}
                      defaultValue={1}
                      placeholder="Số km..."
                    />
                  </div>
                </div>

                <p style={{ fontStyle: "italic" }}>
                  Lưu ý: Từ 45km trở lên sẽ được tính là xe đường dài
                </p>
              </div>

              <div style={{ lineHeight: "72px", margin: "0 70px" }}>
                <FontAwesomeIcon
                  icon={faCircleRight}
                  style={{ color: "#e16c27", fontSize: "30px", margin: "" }}
                />
              </div>

              <div className="d-flex" style={{ flexDirection: "column" }}>
                <div className="d-flex" style={{ flexDirection: "column" }}>
                  <h5 style={{ color: "#e16c27" }}>
                    Chọn loại trọng tải: &nbsp;
                  </h5>
                  <div className="col left_input">
                    <select className="select_xe">
                      <option value="xebantai">Xe bán tải</option>
                      <option value="xevan_500">Xe Van 500 kg</option>
                      <option value="xevan_1000">Xe Van 1000 kg</option>
                      <option value="xetai_500">Xe tải 500kg</option>
                      <option value="xetai_1000">Xe tải 1000 kg</option>
                      <option value="xetai_1500">Xe tải 1500 kg</option>
                      <option value="xetai_2000">Xe tải 2000 kg</option>
                      <option value="xetai_2500">Xe tải 2500 kg</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ lineHeight: "72px", margin: "0 70px" }}>
                <FontAwesomeIcon
                  icon={faCircleRight}
                  style={{ color: "#e16c27", fontSize: "30px", margin: "" }}
                />
              </div>

              <div
                style={{
                  lineHeight: "72px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "#e16c27",
                    fontWeight: "700",
                    width: "300px",
                  }}
                  type="primary"
                  loading={loadings[0]}
                  onClick={() => enterLoading(0)}
                >
                  Tính giá cước
                </Button>
              </div>
            </div>

            <div
              className="right_result"
              style={{
                display: hide,
                backgroundColor: "#fffbe6",
                padding: "10px",
                border: "1px solid #e16c27",
                borderRadius: "5px",
              }}
            >
              <h2>Kết quả:</h2>
              <p>Giá cước ước tính cho xe 1.5 Tấn chạy 23Km là 595.000 VNĐ</p>
            </div>
          </div>
        </div>
      </div>
      {/* End Service Search Price Hire Lorry */}

      {/* Start Price List */}
      <div className="price_list container">
        <Alert
          style={{ fontWeight: "600", fontSize: "20px", textAlign: "center" }}
          message="Giá chuyển nhà trọn gói = Cước thuê xe tải + Phí bốc xếp + Chi phí khác (nếu có)"
          type="error"
        />

        <div className="tablePrice">
          <div
            className="header_toold-flex"
            style={{
              backgroundColor: "#e16c27",
              color: "#fff",
              height: "70px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              flexDirection: "column",
            }}
          >
            <h2>Bảng giá dịch vụ dọn nhà</h2>
          </div>
        </div>
      </div>

      <div
        className="table_container"
        style={{
          backgroundColor: "#eaecfd",
          marginBottom: "-20px",
          clipPath:
            "polygon(16% 4%, 28% 4%, 49% 6%, 65% 3%, 85% 3%, 100% 9%, 100% 100%, 0 100%, 0 11%)",
        }}
      >
        <div className="container">
          <h6
            style={{
              fontWeight: "600",
              fontSize: "20px",
              margin: "20px",
              paddingTop: "30px",
            }}
          >
            1. Giá cước thuê xe tải chuyển nhà
          </h6>
          <table
            class="table table-hover  table-bordered border-warning"
            style={{ border: "1px solid transparent" }}
          >
            <thead>
              <tr>
                <th scope="col">Loại xe</th>
                <th scope="col">Giá cước ban đầu - 10km</th>
                <th scope="col">Từ 11km đến 45km</th>
                <th scope="col">Từ 45km trở lên</th>
                <th scope="col">Phí chờ</th>
              </tr>
            </thead>
            <tbody>{dataHire}</tbody>
          </table>
        </div>
      </div>

      <div
        className="table_container "
        style={{ backgroundColor: "#eaecfd", marginBottom: "-20px" }}
      >
        <div className="container">
          <h6
            style={{
              fontWeight: "600",
              fontSize: "20px",
              margin: "20px",
              paddingTop: "15px",
            }}
          >
            2. Phí bốc xếp đồ đạc
          </h6>
          <table
            class="table table-hover  table-bordered border-warning"
            style={{ border: "1px solid transparent" }}
          >
            <thead>
              <tr>
                <th scope="col">Loại xe</th>
                <th scope="col">Phí bốc xếp tầng lầu 2 chiều</th>
                <th scope="col">Phí bốc xếp tầng lầu 1 chiều</th>
                <th scope="col">Phí bốc xếp tầng trệt 2 chiều</th>
                <th scope="col">Phí bốc xếp tầng trệt 1 chiều</th>
              </tr>
            </thead>
            <tbody>{dataLoading}</tbody>
          </table>
        </div>
      </div>

      <div
        className="table_container "
        style={{ backgroundColor: "#eaecfd", marginBottom: "-20px" }}
      >
        <div className="container" style={{ paddingBottom: "4px" }}>
          <h6
            style={{
              fontWeight: "600",
              fontSize: "20px",
              margin: "20px",
              paddingTop: "15px",
            }}
          >
            3. Chi phí chuyển nhà khác (nếu có)
          </h6>
          <table
            class="table table-hover  table-bordered border-warning"
            style={{ border: "1px solid transparent", paddingBottom: "4px" }}
          >
            <thead>
              <tr>
                <th>Tên chi phí</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>{dataFee}</tbody>
          </table>
        </div>
      </div>
      {/* End Price List */}
      <Footer />
    </>
  );
}

export default ServicePrice;
