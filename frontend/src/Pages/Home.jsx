import React, { useState, useEffect } from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";

import { Tabs, Avatar } from "antd";

import axios from "axios";

const Home = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const get_service = async () => {
    await axios
      .get(`/v1/service/list_service`)
      .then((data) => {
        let data_solve = data.data;
        const data_service = [];
        data_solve &&
          data_solve.forEach((item) => {
            if (item.status) {
              const ob_service = {
                key: item._id,
                label: (
                  <Avatar
                    size={60}
                    src={
                      <img
                        src={item.image}
                        alt="avatar"
                        style={{
                          backgroundColor: "white",
                        }}
                      />
                    }
                  />
                ),
                children: (
                  <>
                    <h6
                      style={{
                        fontSize: "18px",
                        fontWeight: "800",
                        color: "#e16d2a",
                      }}
                    >
                      Dịch vụ {item.name.toLowerCase()}
                    </h6>
                    <ul style={{ marginTop: "20px" }}>
                      <li style={{ fontSize: "16px" }}>
                        <span className="fw-bold">Giá gói dịch vụ: </span>
                        {item.price === 0
                          ? "Tùy thuộc vào số lượng đồ đạc và quãng đường di chuyển"
                          : item.price.toLocaleString() + "đ"}
                      </li>
                      <li style={{ fontSize: "16px" }}>
                        <span className="fw-bold">Xe tải sử dụng:</span>{" "}
                        {item.vehicle}
                      </li>
                      <li style={{ fontSize: "16px" }}>
                        <span className="fw-bold">
                          Số lượng người khuân vác:
                        </span>{" "}
                        {item.needPeople === 0
                          ? "Tùy thuộc vào số lượng đồ đạc và quãng đường di chuyển"
                          : item.needPeople}
                      </li>
                      <li style={{ fontSize: "16px" }}>
                        <span className="fw-bold">Quảng đường áp dụng:</span>{" "}
                        {item.distance === "0"
                          ? "Tùy thuộc vào yêu cầu của khách hàng"
                          : item.distance}
                      </li>
                    </ul>

                    <div style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        class="btn"
                        style={{ backgroundColor: "#e16d2a", color: "white" }}
                      >
                        Đặt dịch vụ ngay
                      </button>
                    </div>
                  </>
                ),
              };

              data_service.push(ob_service);
            }
          });

        setDataSource(data_service);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [dataVehicle, setDataVehicle] = useState([]);
  const get_vehicle = async () => {
    await axios
      .get(`/v1/vehicle/list_vehicle`)
      .then((data) => {
        let data_solve = data.data;
        // const data_service = [];
        let data_arr =
        data_solve &&
        // eslint-disable-next-line
          data_solve.map((item, index) => {
            if (item.status) {
              return {
                label: item.vehicle_name,
                key: index + 1,
                children: (
                  <div className="row">
                    <div className="col">
                      <img
                        src={item.image}
                        width="500"
                        height={207}
                        style={{ objectFit: "contain" }}
                        alt=""
                      />
                    </div>
                    <div
                      className="col"
                      style={{
                        fontSize: "20px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: "227px",
                      }}
                    >
                      <p>Trọng lượng tối đa: {item.capacity}</p>
                      <p>Kích cỡ hàng hóa tối đa: {item.cago_size}</p>
                      <p>Phù hợp cho: {item.suitable_for}</p>
                    </div>
                  </div>
                ),
              };
            }
          });

        setDataVehicle(data_arr);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    setIsActive(false);
    get_service();
    get_vehicle();
  }, []);

  const onChange = (key) => {
    // console.log(key);
  };

  return (
    <>
      <Header />
      <div
        style={{ height: "fit-content", overflowX: "hidden" }}
        className="HomePage"
      >
        <LoadingOverlayComponent status={isActive}>
          {/* First_service */}
          <div className="provide_service row" style={{ position: "relative" }}>
            <div
              className="left-container col-lg-4"
              style={{ position: "absolute", left: "59px", top: "50px" }}
            >
              <h1 style={{ fontSize: "25px", fontWeight: "600" }}>
                Đặt lịch dọn nhà nhanh chóng và tiện lợi.
              </h1>
              <h1
                style={{
                  color: "#e16d2a",
                  fontSize: "70px",
                  marginBottom: "14px",
                  fontWeight: "500",
                }}
              >
                Chỉ với 1 Click
              </h1>

              {/* Bảng nav lựa chọn dịch vụ */}
              <Tabs
                defaultActiveKey="1"
                items={dataSource}
                onChange={onChange}
                style={{
                  border: "2px solid #ccc",
                  padding: "10px",
                  borderRadius: "10px",
                  // background: "rgb(11,6,4)",
                  background:
                    "radial-gradient(circle, rgba(11,6,4,0.8492647058823529) 33%, rgba(85,81,78,0.9557072829131653) 74%)",
                  width: "570px",
                }}
              />
            </div>

            <div
              className="col-lg-8"
              style={{ textAlign: "right", width: "100%" }}
            >
              <img
                src="./img/background_home.png"
                class="img-fluid"
                alt="..."
                style={{ height: "800px" }}
              ></img>
            </div>
          </div>
          {/* End First_service */}
        </LoadingOverlayComponent>

        {/* Second Service */}
        <div
          className="d-flex"
          style={{
            backgroundColor: "#f9f9f9",
            padding: "10px 15px",
            marginTop: "50px",
            justifyContent: "space-between",
          }}
        >
          <div
            className="item_service_container"
            style={{
              width: "353px",
              height: "206px",
              border: "1px solid f9f9f9",
              backgroundColor: "#fff",
              borderRadius: "5px",
              display: "flex",
              padding: "30px",
            }}
          >
            <div className="item_icon col-lg-5">
              <img
                src="./img/buoc1.png"
                class="img-thumbnail"
                alt="..."
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "black",
                  border: "5px solid #e16c27 ",
                }}
              ></img>
            </div>
            <div className="item_content col">
              <h4>01. Khảo sát ban đầu</h4>
              <p style={{ marginTop: "-8px", color: "#b7b7b7" }}>
                Tìm loại phương tiện phù hợp với bạn, thiết lập điểm xuất phát
                và điểm kết thúc mới.
              </p>
            </div>
          </div>

          <div
            className="item_service_container"
            style={{
              width: "353px",
              height: "206px",
              border: "1px solid f9f9f9",
              backgroundColor: "#fff",
              borderRadius: "5px",
              display: "flex",
              padding: "30px",
            }}
          >
            <div className="item_icon col-lg-5">
              <img
                src="./img/notes.png"
                class="img-thumbnail"
                alt="..."
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "black",
                  objectPosition: "center",
                  border: "5px solid #e16c27 ",
                }}
              ></img>
            </div>
            <div className="item_content col">
              <h4>02. Xác nhận đặt dịch vụ</h4>
              <p style={{ marginTop: "-8px", color: "#b7b7b7" }}>
                Bằng cách xác nhận đặt lịch trực tuyến, bạn sẽ thấy được đơn
                hàng trong khung điều khiển.
              </p>
            </div>
          </div>

          <div
            className="item_service_container"
            style={{
              width: "353px",
              height: "206px",
              border: "1px solid f9f9f9",
              backgroundColor: "#fff",
              borderRadius: "5px",
              display: "flex",
              padding: "30px",
            }}
          >
            <div className="item_icon col-lg-5">
              <img
                src="./img/buoc3.png"
                class="img-thumbnail"
                alt="..."
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "black",
                  border: "5px solid #e16c27 ",
                }}
              ></img>
            </div>
            <div className="item_content col">
              <h4>03. Thực hiện vận chuyển</h4>
              <p style={{ marginTop: "-8px", color: "#b7b7b7" }}>
                Với đội ngũ dọn nhà có nhiều năm kinh nghiệm, việc vận chuyển sẽ
                diễn ra nhanh chóng
              </p>
            </div>
          </div>

          <div
            className="item_service_container"
            style={{
              width: "353px",
              height: "206px",
              border: "1px solid f9f9f9",
              backgroundColor: "#fff",
              borderRadius: "5px",
              display: "flex",
              padding: "30px",
            }}
          >
            <div className="item_icon col-lg-5">
              <img
                src="./img/buoc4.png"
                class="img-thumbnail"
                alt="..."
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "black",
                  border: "5px solid #e16c27 ",
                }}
              ></img>
            </div>
            <div className="item_content col">
              <h4>04. Thanh toán và nghiệm thu</h4>
              <p style={{ marginTop: "-8px", color: "#b7b7b7" }}>
                Thực hiện thanh toán toàn bộ phí dịch vụ và đền bù thiệt hại nếu
                có.
              </p>
            </div>
          </div>
        </div>

        {/* End Second Service */}

        {/* Start Third Service */}
        <div
          className="why_choose_us flex"
          style={{ backgroundColor: "#eeeeee", height: "650px" }}
        >
          <div
            className="container d-flex"
            style={{
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}
          >
            <h3 style={{ color: "#e16d2a " }}>
              Tại sao lại chọn dịch vụ chúng tôi ?
            </h3>
            <p style={{ margin: "30px 0 50px 0" }}>
              Rất đơn giản ! Chỉ cần làm theo các bước sau để sẵn sàng cho kế
              hoạch vận chuyển !
            </p>
            <div className="row" style={{ width: "77%" }}>
              <div
                className="col d-flex"
                style={{
                  width: "323px",
                  height: "386px",
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  padding: "40px 20px",
                  borderTop: "5px solid #e16c27",
                  marginRight: "30px",
                }}
              >
                <img
                  src="./img/procurement.png"
                  class="img-thumbnail"
                  alt="..."
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#e16c27 ",
                  }}
                ></img>

                <h5 style={{ marginTop: "15px", marginBottom: "25px" }}>
                  Báo giá tức thì
                </h5>

                <p style={{ textAlign: "center" }}>
                  Mức giá mà bạn thấy trên giá của chúng tôi mà bạn sẽ phải trả
                  vì đã bao gồm tất cả các khoản phí. Sẽ chỉ phải trả thêm phí
                  nếu đồ đạc của bạn không vừa với xe tải như đã đặt hàng và
                  phải thực hiện chuyến đi thứ hai.
                </p>
              </div>

              <div
                className="col d-flex"
                style={{
                  width: "323px",
                  height: "386px",
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  padding: "40px 20px",
                  borderTop: "5px solid #e16c27",
                  marginRight: "30px",
                }}
              >
                <img
                  src="./img/group.png"
                  class="img-thumbnail"
                  alt="..."
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#e16c27 ",
                  }}
                ></img>

                <h5 style={{ marginTop: "15px", marginBottom: "25px" }}>
                  Đội ngũ giàu kinh nghiệm
                </h5>

                <p style={{ textAlign: "center" }}>
                  Chúng tôi quan tâm đến sự tỉ mỉ và chính xác trong công việc.
                  Đây là một nỗ lực mới khi công nghệ ngày càng phát triển và
                  nhằm đảm bảo nhu cầu của khách hàng.
                </p>
              </div>

              <div
                className="col d-flex"
                style={{
                  width: "323px",
                  height: "386px",
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  padding: "40px 20px",
                  borderTop: "5px solid #e16c27",
                }}
              >
                <img
                  src="./img/tech-support.png"
                  class="img-thumbnail"
                  alt="..."
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#e16c27 ",
                  }}
                ></img>

                <h5 style={{ marginTop: "15px", marginBottom: "25px" }}>
                  Dịch vụ chuyên nghiệp
                </h5>

                <p style={{ textAlign: "center" }}>
                  Chúng tôi sẽ cố gắng hết sức để cung cấp dịch vụ chuyên nghiệp
                  và chất lượng cho tất cả khách hàng. Đảm bảo rằng chúng tôi sẽ
                  đáp ứng mọi yêu cầu của khách hàng. Bạn chắc chắn sẽ không bao
                  giờ hối tiếc khi trải nghiệm với chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* End Third Service */}

        {/* Start four Service */}
        <div
          className="reply_customer container"
          style={{ height: "570px", padding: "100px", textAlign: "center" }}
        >
          <h1 style={{ marginBottom: "60px", color: "#e16d2a " }}>
            Phản hồi từ phía khách hàng
          </h1>
          <div>
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="./img/person_1.png"
                    alt="..."
                    style={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      border: "2px solid #e16c27",
                      marginBottom: "50px",
                      boxShadow: "5px 1px 1px #ccc",
                    }}
                  />

                  <p
                    style={{ width: "60%", margin: "0 auto", fontSize: "20px" }}
                  >
                    "Tôi rất hài lòng với dịch vụ chuyển nhà của công ty. Đội
                    ngũ nhân viên chuyên nghiệp, nhiệt tình, làm việc nhanh
                    chóng, gọn gàng. Đồ đạc được đóng gói cẩn thận, không bị hư
                    hỏng. Tôi sẽ giới thiệu dịch vụ này cho bạn bè và người thân
                    của mình."
                  </p>

                  <p style={{ marginTop: "50px", fontWeight: "bold" }}>
                    Anh Nguyễn Văn T
                  </p>
                </div>

                <div className="carousel-item">
                  <img
                    src="./img/person_2.png"
                    alt="..."
                    style={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      border: "2px solid #e16c27",
                      marginBottom: "50px",
                      boxShadow: "5px 1px 1px #ccc",
                    }}
                  />

                  <p
                    style={{ width: "60%", margin: "0 auto", fontSize: "20px" }}
                  >
                    "Tôi đã sử dụng dịch vụ chuyển nhà của công ty nhiều lần và
                    luôn cảm thấy hài lòng. Giá cả hợp lý, chất lượng dịch vụ
                    tốt. Tôi sẽ tiếp tục sử dụng dịch vụ này trong tương lai."
                  </p>

                  <p style={{ marginTop: "50px", fontWeight: "bold" }}>
                    Người dùng ẩn tên
                  </p>
                </div>

                <div className="carousel-item">
                  <img
                    src="./img/person_3.png"
                    alt="..."
                    style={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      border: "2px solid #e16c27",
                      marginBottom: "50px",
                      boxShadow: "5px 1px 1px #ccc",
                    }}
                  />

                  <p
                    style={{ width: "60%", margin: "0 auto", fontSize: "20px" }}
                  >
                    "Tôi rất lo lắng khi chuyển nhà vì đồ đạc của tôi rất nhiều
                    và giá trị. Tuy nhiên, sau khi sử dụng dịch vụ của công ty,
                    tôi hoàn toàn yên tâm. Đồ đạc được vận chuyển cẩn thận,
                    không bị hư hỏng. Tôi rất hài lòng với dịch vụ này."
                  </p>

                  <p style={{ marginTop: "50px", fontWeight: "bold" }}>
                    Trần Văn K
                  </p>
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                  style={{ backgroundColor: "#e16c27", borderRadius: "50%" }}
                />
                <span className="visually-hidden">Lùi</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                  style={{ backgroundColor: "#e16c27", borderRadius: "50%" }}
                />
                <span className="visually-hidden">Tiến tới</span>
              </button>
            </div>
          </div>
        </div>
        {/* End Four Service */}

        {/* Start Five Service */}
        <div
          className="type_of_vehicle"
          style={{
            height: "fit-content",
            padding: "80px",
            backgroundColor: "#f8f9ff ",
          }}
        >
          <div className="container">
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "900",
                lineHeight: "72px",
              }}
            >
              Các loại xe có sẵn
            </h1>
            <h5 style={{ marginBottom: "30px" }}>
              Chúng tôi cung cấp nhiều loại xe từ xe bán tải đến xe tải 2 tấn.
              Bạn có thể lựa chọn loại xe tùy theo nhu cầu của mình.
            </h5>

            <Tabs
              defaultActiveKey="1"
              tabPosition="left"
              style={{
                height: 220,
              }}
              items={dataVehicle}
            />
          </div>
        </div>
        {/* End Five Service */}
      </div>
      <Footer />
    </>
  );
};

export default Home;
