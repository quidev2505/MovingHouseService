import React, { useState, useEffect } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";
import { Table, Tag, Drawer, Timeline, Space, Modal, Rate, Avatar } from "antd";

import { useParams } from "react-router-dom";

import axios from "axios";

function RatingOrder() {
  const [isActive, setIsActive] = useState(true);
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"];
  const [valueStar, setValueStar] = useState(3); //đánh giá sao
  const [valueStarDriver, setValueStarDriver] = useState(3); //đánh giá sao
  const [commentRating, setCommentRating] = useState("");

  const params = useParams();

  const [arrDriver, setArrayDriver] = useState([]);

  const [dom_RatingDriver, setDOMRatingDriver] = useState();

  const get_data_order = async () => {
    const data_order = await axios.get(
      `/v1/order/viewOrderWithOrderId/${params.order_id}`
    );

    let arr_driver = data_order.data.driver_name;
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
              <div className="d-flex" style={{ alignItems: "center" }}>
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
                    width: "300px",
                  }}
                >
                  <p style={{ marginBottom: "0px" }}>Đánh giá</p>
                  <span>
                    <Rate
                      tooltips={desc}
                      defaultValue={3}
                      // onChange={setValueStarDriver}
                      // value={valueStarDriver}
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
  }, []);

  return (
    <>
      <HeaderUser />
      <LoadingOverlayComponent status={isActive}>
        <div className="infoUser">
          <div>
            <h3
              style={{
                fontWeight: "700",
                marginBottom: "60px",
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
                        width: "300px",
                      }}
                    >
                      <p style={{ marginBottom: "0px" }}>Đánh giá</p>
                      <span>
                        <Rate
                          tooltips={desc}
                          onChange={setValueStar}
                          value={valueStar}
                        />
                        {valueStar ? (
                          <span className="ant-rate-text">
                            {desc[valueStar - 1]}
                          </span>
                        ) : (
                          ""
                        )}
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

                <div className="rating_driver">
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
                    // onClick={() => }
                    style={{ marginRight: "10px" }}
                  >
                    CẬP NHẬT
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {}}
                    style={{ marginRight: "10px" }}
                  >
                    ĐÓNG
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
            </div>
          </div>
        </div>
      </LoadingOverlayComponent>
    </>
  );
}

export default RatingOrder;
