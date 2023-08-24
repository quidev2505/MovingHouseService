import React from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
      <Header />
      <div style={{ height: "fit-content" }}>
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
                // background: "rgb(11,6,4)",
                background:
                  "radial-gradient(circle, rgba(11,6,4,0.8492647058823529) 33%, rgba(85,81,78,0.9557072829131653) 74%)",
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
                  <h6 style={{ fontSize: "18px", fontWeight: "800" }}>
                    Dịch vụ chuyển nhà - Nội thành
                  </h6>
                  <div>
                    <div>
                      <ul>
                        <li>Xe tải: 1 tấn/ 1.5 tấn/ 2 tấn</li>
                        <li>Ít nhất 2 người bốc vác</li>
                        <li>Áp dụng trong vòng 60km</li>
                      </ul>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <button
                        type="button"
                        class="btn"
                        style={{ backgroundColor: "#e16d2a", color: "white" }}
                      >
                        Đặt dịch vụ ngay
                      </button>
                    </div>
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
            <h3>Tại sao lại chọn dịch vụ chúng tôi ?</h3>
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
          <h1 style={{ marginBottom: "60px" }}>Phản hồi từ phía khách hàng</h1>
          <div>
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="./img/choose_2.png"
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
                    "Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Unde officiis iusto ab, a similique ipsam voluptatem enim,
                    tempora iure nostrum, quod nemo corrupti earum? Atque
                    praesentium cumque tempore ab hic?""
                  </p>

                  <p style={{ marginTop: "50px", fontWeight: "bold" }}>
                    Người dùng kkk
                  </p>
                </div>

                <div className="carousel-item active">
                  <img
                    src="./img/choose_2.png"
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
                    "Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Unde officiis iusto ab, a similique ipsam voluptatem enim,
                    tempora iure nostrum, quod nemo corrupti earum? Atque
                    praesentium cumque tempore ab hic?""
                  </p>

                  <p style={{ marginTop: "50px", fontWeight: "bold" }}>
                    Người dùng kkk
                  </p>
                </div>

                <div className="carousel-item active">
                  <img
                    src="./img/choose_2.png"
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
                    "Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Unde officiis iusto ab, a similique ipsam voluptatem enim,
                    tempora iure nostrum, quod nemo corrupti earum? Atque
                    praesentium cumque tempore ab hic?""
                  </p>

                  <p style={{ marginTop: "50px", fontWeight: "bold" }}>
                    Người dùng kkk
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
                <span className="visually-hidden">Previous</span>
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
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
        {/* End Four Service */}

        {/* Start Five Service */}
        <div
          className="type_of_vehicle"
          style={{
            height: "850px",
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
              Chúng tôi cung cấp nhiều loại xe từ xe bán tải 4×4 đến xe tải 5
              tấn. Bạn có thể lựa chọn loại xe tùy theo nhu cầu của mình.
            </h5>

            {/* Info each vehicle */}
            <div class="d-flex align-items-start">
              <div
                class="nav flex-column nav-pills me-3 tab_trai_type"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <button
                  class="nav-link active"
                  id="v-pills-loai_1-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-loai_1"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-loai_1"
                  aria-selected="true"
                >
                  Xe Bán Tải
                </button>
                <button
                  class="nav-link"
                  id="v-pills-loai_2-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-loai_2"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-loai_2"
                  aria-selected="false"
                >
                  Xe Van 500 kg
                </button>
                <button
                  class="nav-link"
                  id="v-pills-loai_3-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-loai_3"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-loai_3"
                  aria-selected="false"
                >
                  Xe Van 1000 kg
                </button>
                <button
                  class="nav-link"
                  id="v-pills-loai_4-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-loai_4"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-loai_4"
                  aria-selected="false"
                >
                  Xe tải 500 kg
                </button>
                <button
                  class="nav-link"
                  id="v-pills-loai_5-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-loai_5"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-loai_5"
                  aria-selected="false"
                >
                  Xe tải 1000 kg
                </button>

                <button
                  class="nav-link"
                  id="v-pills-loai_6-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-loai_6"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-loai_6"
                  aria-selected="false"
                >
                  Xe tải 1500 kg
                </button>

                <button
                  class="nav-link"
                  id="v-pills-loai_7-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-loai_7"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-loai_7"
                  aria-selected="false"
                >
                  Xe tải 2000 kg
                </button>

                <button
                  class="nav-link"
                  id="v-pills-loai_8-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-loai_8"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-loai_8"
                  aria-selected="false"
                >
                  Xe tải 2500 kg
                </button>
              </div>
              {/* Content Info Right */}
              <div
                class="tab-content"
                id="v-pills-tabContent"
                style={{ marginLeft: "80px", width: "100%" }}
              >
                <div
                  class="tab-pane fade show active  row"
                  id="v-pills-home"
                  role="tabpanel"
                  aria-labelledby="v-pills-home-tab"
                  tabindex="0"
                >
                  <div className="d-flex">
                    <div
                      className="col"
                      style={{
                        backgroundColor: "#fff",
                        height: "580px",
                        marginRight: "20px",
                        borderRadius: "10px",
                        padding: "25px 15px",
                      }}
                    >
                      <img
                        src="./img/choose_1.png"
                        class="img-fluid"
                        alt="..."
                      />
                    </div>
                    <div
                      className="col"
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "25px 20px",
                      }}
                    >
                      <h4 style={{ fontSize: "20px", fontWeight: "900" }}>
                        Xe Bán Tải
                      </h4>
                      <span style={{ fontSize: "18px", fontWeight: "400" }}>
                        Trọng lượng tối đa: 500kg
                      </span>
                      <p style={{ fontSize: "18px", fontWeight: "400" }}>
                        Kích cỡ hàng hóa tối đa: 140cm x 150cm x 50cm
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "400" }}>
                        Phù hợp cho: Giao hàng hóa số lượng nhiều, hàng to cồng
                        kềnh không thể vừa với cốp xe ô tô nhưng không yêu cầu
                        sức chứa to như xe tải. Linh hoạt và không bị ảnh hưởng
                        bởi thời gian cấm tải.
                      </p>
                      <br></br>
                      <p style={{ fontSize: "20px", fontWeight: "900" }}>
                        Tải trọng gần đúng:
                      </p>
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Máy giặt (X1){" "}
                        </span>
                      </div>
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Tủ nhỏ (X1){" "}
                        </span>
                      </div>

                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Tủ lạnh 1 cửa (X1){" "}
                        </span>
                      </div>

                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Bàn ăn (X1){" "}
                        </span>
                      </div>
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Sofa 1 chỗ ngồi (X1){" "}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          marginTop: "20px",
                        }}
                      >
                        * Chỉ một trong số món đồ kể trên là phù hợp với chiếc
                        xe này.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="tab-pane fade row"
                  id="v-pills-profile"
                  role="tabpanel"
                  aria-labelledby="v-pills-profile-tab"
                  tabindex="0"
                >
                  <div className="d-flex">
                    <div
                      className="col"
                      style={{
                        backgroundColor: "#fff",
                        height: "580px",
                        marginRight: "20px",
                        borderRadius: "10px",
                        padding: "25px 15px",
                      }}
                    >
                      <img
                        src="./img/choose_1.png"
                        class="img-fluid"
                        alt="..."
                      />
                    </div>
                    <div
                      className="col"
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "25px 20px",
                      }}
                    >
                      <h4 style={{ fontSize: "20px", fontWeight: "900" }}>
                        Xe Bán Tải
                      </h4>
                      <span style={{ fontSize: "18px", fontWeight: "400" }}>
                        Trọng lượng tối đa: 500kg
                      </span>
                      <p style={{ fontSize: "18px", fontWeight: "400" }}>
                        Kích cỡ hàng hóa tối đa: 140cm x 150cm x 50cm
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "400" }}>
                        Phù hợp cho: Giao hàng hóa số lượng nhiều, hàng to cồng
                        kềnh không thể vừa với cốp xe ô tô nhưng không yêu cầu
                        sức chứa to như xe tải. Linh hoạt và không bị ảnh hưởng
                        bởi thời gian cấm tải.
                      </p>
                      <br></br>
                      <p style={{ fontSize: "20px", fontWeight: "900" }}>
                        Tải trọng gần đúng:
                      </p>
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Máy giặt (X1){" "}
                        </span>
                      </div>
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Tủ nhỏ (X1){" "}
                        </span>
                      </div>

                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Tủ lạnh 1 cửa (X1){" "}
                        </span>
                      </div>

                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Bàn ăn (X1){" "}
                        </span>
                      </div>
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ color: "#f47c0b" }}
                        />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "400",
                            marginLeft: "20px",
                          }}
                        >
                          {" "}
                          Sofa 1 chỗ ngồi (X1){" "}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          marginTop: "20px",
                        }}
                      >
                        * Chỉ một trong số món đồ kể trên là phù hợp với chiếc
                        xe này.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="v-pills-disabled"
                  role="tabpanel"
                  aria-labelledby="v-pills-disabled-tab"
                  tabindex="0"
                >
                  ...
                </div>
                <div
                  class="tab-pane fade"
                  id="v-pills-messages"
                  role="tabpanel"
                  aria-labelledby="v-pills-messages-tab"
                  tabindex="0"
                >
                  ...
                </div>
                <div
                  class="tab-pane fade"
                  id="v-pills-settings"
                  role="tabpanel"
                  aria-labelledby="v-pills-settings-tab"
                  tabindex="0"
                >
                  ...
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Five Service */}
      </div>
      <Footer />
    </>
  );
};

export default Home;
