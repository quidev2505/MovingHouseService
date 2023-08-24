import React from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <div style={{ height: "20000px" }}>
        {/* First_service */}
        <div
          className="provide_service row"
          style={{ position: "relative", marginRight: "0px" }}
        >
          <div
            className="left-container col-lg-4"
            style={{ position: "absolute", left: "100px", top: "50px" }}
          >
            <h1 style={{ fontSize: "25px" }}>
              Đặt lịch dọn nhà nhanh chóng và tiện lợi.
            </h1>
            <h1
              style={{
                color: "#e16d2a",
                fontSize: "70px",
                marginBottom: "30px",
              }}
            >
              Chỉ với 1 Click
            </h1>

            <div
              className="board_service"
              style={{
                border: "2px solid #ccc",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "black",
                width: "570px",
              }}
            >
              <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link active"
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    <img
                      src="./img/choose_1.png"
                      class="img-thumbnail"
                      alt="..."
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    ></img>
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected="false"
                  >
                    <img
                      src="./img/choose_2.png"
                      class="img-thumbnail"
                      alt="..."
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    ></img>
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-contact-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-contact"
                    type="button"
                    role="tab"
                    aria-controls="pills-contact"
                    aria-selected="false"
                  >
                    <img
                      src="./img/choose_3.png"
                      class="img-thumbnail"
                      alt="..."
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    ></img>
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="pills-contact-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-hihi"
                    type="button"
                    role="tab"
                    aria-controls="pills-hihi"
                    aria-selected="false"
                  >
                    <img
                      src="./img/choose_4.png"
                      class="img-thumbnail"
                      alt="..."
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    ></img>
                  </button>
                </li>
              </ul>

              <div
                class="tab-content"
                id="pills-tabContent"
                style={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <div
                  class="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <h6>Dịch vụ chuyển nhà - Nội thành</h6>
                  <div>
                    <div>
                      <span>1 tài xế</span>
                      <br />
                      <span>1 tài xế</span>
                      <br />
                      <span>1 tài xế</span>
                      <br />
                      <span>1 tài xế</span>
                    </div>
                    <button
                      type="button"
                      class="btn"
                      style={{ backgroundColor: "#e16d2a", color: "white" }}
                    >
                      Đặt dịch vụ ngay
                    </button>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                >
                  Dịch vụ chuyển nhà - Liên tỉnh
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-contact"
                  role="tabpanel"
                  aria-labelledby="pills-contact-tab"
                >
                  Dịch vụ chuyển nhà trọn gói
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-hihi"
                  role="tabpanel"
                  aria-labelledby="pills-hihi-tab"
                >
                  Dịch vụ xử lý hàng
                </div>
              </div>
            </div>
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

        {/* Second Service */}
        <div
          className="d-flex"
          style={{
            backgroundColor: "#f9f9f9",
            padding: "10px 15px",
            marginTop: "17px",
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
                  objectPosition:"center"
                }}
              ></img>
            </div>
            <div className="item_content col">
              <h4>02. Thực hiện đặt dịch vụ</h4>
              <p style={{ marginTop: "-8px", color: "#b7b7b7" }}>
                Bằng cách xác nhận đặt lịch trực tuyến, bạn sẽ thấy được đơn hàng trong khung điều khiển.
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
                }}
              ></img>
            </div>
            <div className="item_content col">
              <h4>03. Thực hiện vận chuyển</h4>
              <p style={{ marginTop: "-8px", color: "#b7b7b7" }}>
                Với đội ngũ dọn nhà có nhiều năm kinh nghiệm, việc vận chuyển sẽ diễn ra nhanh chóng
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
                }}
              ></img>
            </div>
            <div className="item_content col">
              <h4>04. Thanh toán và nghiệm thu</h4>
              <p style={{ marginTop: "-8px", color: "#b7b7b7" }}>
                Thực hiện thanh toán toàn bộ phí dịch vụ và đền bù thiệt hại nếu có.
              </p>
            </div>
          </div>
        </div>

        {/* End Second Service */}
      </div>
      <Footer />
    </>
  );
};

export default Home;
