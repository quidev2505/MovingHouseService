import React, { useState, useEffect } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";
import { Table, Tag, Drawer, Timeline, Space, Modal, Rate, Avatar } from "antd";

import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

import { useSelector } from "react-redux";

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

function RatingOrder() {
  const [isActive, setIsActive] = useState(true);
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"];
  const [valueStar, setValueStar] = useState(3); //đánh giá sao dịch vụ

  const [commentRating, setCommentRating] = useState("");

  const params = useParams();

  const [arrDriver, setArrayDriver] = useState([]);

  const [dom_RatingDriver, setDOMRatingDriver] = useState();

  const nav = useNavigate();

  const [arrayRatingDriver, setArrayRatingDriver] = useState([]);

  const [serviceName, setServiceName] = useState("");
  const [driverName, setDriverName] = useState("");

  const user = useSelector((state) => state.auth.login.currentUser); //Lấy User hiện tại ra

  const [domHistory, setDomHistory] = useState();

  const get_history_rating_order = async () => {
    const data_rating_order = await axios.get(
      `/v1/order/getRating_Order/${params.order_id}`
    );

    let DOM_HISTORY = data_rating_order.data.map((item, index) => {
      return (
        <>
          <div
            className="d-flex"
            style={{
              justifyContent: "space-between",
              border: "1px solid #ccc",
              padding: "7px",
              borderRadius: "5px",
              margin: "5px",
            }}
          >
            <div>
              <Rate disabled defaultValue={item.star} />
            </div>
            <div>{item.comment}</div>
            <div>{item.rating_date}</div>
          </div>
        </>
      );
    });

    setDomHistory(DOM_HISTORY);
  };

  const get_data_order = async () => {
    const data_order = await axios.get(
      `/v1/order/viewOrderWithOrderId/${params.order_id}`
    );

    let arr_driver = data_order.data.driver_name;
    setDriverName(arr_driver);
    let service_name = data_order.data.service_name;
    setServiceName(service_name);
    // Lặp qua mảng tên tài xế và thực hiện truy vấn API
    arr_driver.forEach(async (item, index) => {
      // Thực hiện truy vấn API
      let result = await axios.get(
        `/v1/driver/getdriver_with_fullname/${item}`
      );

      // Tạo đối tượng `ob` chứa thông tin về tài xế
      let ob = {
        fullname: result.data.fullname,
        avatar: result.data.avatar,
      };

      arrDriver.push(ob);

      setArrayDriver(arrDriver);
    });

    setTimeout(() => {
      // Tạo DOM gắn vào tài xế
      //Tạo DOM gắn vào tài xế
      if (arrDriver.length > 0) {
        let DOM_DRIVER = arrDriver.map((item, index) => {
          return (
            <>
              <div
                className="d-flex"
                style={{
                  alignItems: "center",
                  borderTop: "1px solid #ccc",
                  paddingTop: "10px",
                }}
              >
                <Avatar src={<img src={item.avatar} alt="avatar" />} />
                <h6
                  style={{
                    color: "orange",
                    marginLeft: "15px",
                    marginTop: "5px",
                  }}
                >
                  {item.fullname}
                </h6>
              </div>
              <div style={{ padding: "10px" }}>
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: "15px",
                    width: "250px",
                  }}
                >
                  <p style={{ marginBottom: "0px" }}>Đánh giá</p>
                  <span>
                    <Rate
                      tooltips={desc}
                      allowClear={false}
                      defaultValue={3}
                      className="rating_star_driver"
                      onChange={(e) => {
                        setArrayRatingDriver((prev) => [...prev, e]);
                      }}
                    />
                    {/* {valueStarDriver ? (
                      <span className="ant-rate-text">
                        {desc[valueStarDriver - 1]}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </span>
                </div>
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: "15px",
                    marginTop: "40px",
                  }}
                >
                  <p>Nhận xét</p>
                  <textarea
                    placeholder="Nhập vào đánh giá"
                    className="commentDriver"
                    style={{
                      height: "100px",
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                    }}
                  ></textarea>
                </div>
              </div>
            </>
          );
        });

        setDOMRatingDriver(DOM_DRIVER);
      }
      setIsActive(false);
    }, [1500]);
  };

  useEffect(() => {
    get_data_order();
    get_history_rating_order();
  }, []);

  //Đánh giá đơn hàng
  const rating_order = async () => {
    //Đánh giá dịch vụ
    console.log(valueStar);
    console.log(commentRating);

    //Đánh giá tài xế
    // const rating_driver_star = document.querySelectorAll(".rating_star_driver");

    console.log(arrayRatingDriver); //Đánh giá sao tài xế

    const commentDriver = document.querySelectorAll(".commentDriver");
    const arr_result = [];
    
    arrayRatingDriver.forEach((item, index) => {
      arr_result.push(commentDriver[index].value);
    });

    const ob_sending_rating_order = {
      customer_name: user.fullname,
      star_service: valueStar,
      comment_service: commentRating,
      service_name: serviceName,
      driver_name: driverName,
      star_driver: arrayRatingDriver,
      comment_driver: arr_result,
    };

    await axios
      .post(
        `/v1/order/rating_order/${params.order_id}`,
        ob_sending_rating_order
      )
      .then((data) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Đánh giá đơn hàng thành công !",
          showConfirmButton: false,
          timer: 1000,
        });
        get_history_rating_order();
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Đánh giá đơn hàng tất bại !",
          showConfirmButton: false,
          timer: 1000,
        });
      });
  };

  return (
    <>
      <HeaderUser />
      <LoadingOverlayComponent status={isActive}>
        <div className="infoUser">
          <div className="d-flex" style={{ alignItems: "center" }}>
            <ArrowLeftOutlined
              style={{
                borderRadius: "50%",
                padding: "5px",
                backgroundColor: "#ccc",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={() => nav("/user/order")}
            />
            <h3
              style={{
                fontWeight: "700",
                marginLeft: "20px",
              }}
            >
              Đánh giá đơn hàng
            </h3>
          </div>

          <div className="d-flex">
            <div className="d-flex">
              <div
                style={{
                  overflowY: "scroll",
                  maxHeight: "500px",
                }}
              >
                <div
                  className="rating_service"
                  style={{
                    width: "650px",
                    border: "1px solid #ccc",
                  }}
                >
                  <h4
                    style={{
                      backgroundColor: "orange",
                      color: "white",
                      fontWeight: "500",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    Đánh giá dịch vụ
                  </h4>
                  <div style={{ padding: "10px" }}>
                    <div
                      className="d-flex"
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "15px",
                        width: "250px",
                      }}
                    >
                      <p style={{ marginBottom: "0px" }}>Đánh giá</p>
                      <span>
                        <Rate
                          tooltips={desc}
                          onChange={setValueStar}
                          value={valueStar}
                        />
                        {/* {valueStar ? (
                          <span className="ant-rate-text">
                            {desc[valueStar - 1]}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </span>
                    </div>
                    <div
                      className="d-flex"
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "15px",
                        marginTop: "40px",
                      }}
                    >
                      <p>Nhận xét</p>
                      <textarea
                        placeholder="Nhập vào đánh giá"
                        value={commentRating}
                        onChange={(e) => setCommentRating(e.target.value)}
                        style={{
                          height: "100px",
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ccc",
                        }}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div
                  className="rating_driver"
                  style={{ border: "1px solid #ccc", padding: "5px" }}
                >
                  <h4
                    style={{
                      backgroundColor: "orange",
                      color: "white",
                      fontWeight: "500",
                      padding: "5px",
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    Đánh giá tài xế
                  </h4>
                  {dom_RatingDriver}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "10px",
                  }}
                >
                  <button
                    className="btn btn-success"
                    onClick={() => rating_order()}
                    style={{ marginRight: "10px" }}
                  >
                    CẬP NHẬT
                  </button>
                </div>
              </div>
            </div>
            <div
              className="lichsudanhgia"
              style={{ width: "50%", border: "1px solid #ccc" }}
            >
              <h4
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  fontWeight: "500",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                Lịch sử đánh giá đơn hàng
              </h4>
              {domHistory ? (
                domHistory
              ) : (
                <h2
                  style={{
                    fontStyle: "italic",
                    color: "#ccc",
                    fontWeight: "bold",
                  }}
                >
                  Hiện tại chưa có đánh giá nào !
                </h2>
              )}
            </div>
          </div>
        </div>
      </LoadingOverlayComponent>
    </>
  );
}

export default RatingOrder;
