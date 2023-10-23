import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import ChatBot from "react-simple-chatbot";
import { FloatButton } from "antd";
import { RobotOutlined, CloseOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { Toast } from "../Components/ToastColor";

import axios from "axios";

// all available props
const theme = {
  background: "#f5f8fb",
  fontFamily: "Helvetica Neue",
  headerBgColor: "#EF6C00",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#EF6C00",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a",
};

const ChatBotIcon = () => {
  const steps = [
    {
      id: "1",
      message: "Xin chào ! Hãy cho tôi biết tên của bạn ?",
      trigger: "customer_name",
    },
    {
      id: "customer_name",
      user: true,
      trigger: "3",
    },
    {
      id: "3",
      message: "Chào bạn {previousValue},	bạn có yêu cầu gì ạ ?",
      trigger: "menu",
    },
    //Đưa ra 2 yêu cầu
    {
      id: "menu",
      options: [
        { value: "Chuyển trang", label: "Chuyển trang", trigger: "navigation" },
        {
          value: "Báo giá thuê xe",
          label: "Báo giá thuê xe",
          trigger: "get_quote",
        },
        {
          value: "Kết thúc",
          label: "Kết thúc",
          trigger: "ket_thuc",
        },
      ],
    },
    //Chuyển trang
    {
      id: "navigation",
      options: [
        { value: "/", label: "Trang chủ", trigger: "6" },
        { value: "/service_price", label: "Giá dịch vụ", trigger: "6" },
        { value: "/blog", label: "Blog", trigger: "6" },
        { value: "/contact", label: "Liên Hệ", trigger: "6" },
        { value: "/login", label: "Đăng nhập", trigger: "6" },
        { value: "/register", label: "Đăng ký", trigger: "6" },
      ],
    },
    {
      id: "6",
      message: "Đã đi chuyển đến trang !",
      end: true,
    },
    //Báo giá
    {
      id: "get_quote",
      message: "Nhập vào địa chỉ bắt đầu",
      trigger: "fromLocation",
    },
    {
      id: "fromLocation",
      user: true,
      trigger: "tolocation_question",
    },
    {
      id: "tolocation_question",
      message: "Nhập vào địa chỉ kết thúc",
      trigger: "toLocation",
    },
    {
      id: "toLocation",
      user: true,
      trigger: "choose_vehicle_mess",
    },
    {
      id: "choose_vehicle_mess",
      message: "Chọn loại phương tiện vận chuyển",
      trigger: "choose_vehicle",
    },
    {
      id: "choose_vehicle",
      options: [
        { value: "Xe bán tải", label: "Xe bán tải", trigger: "show_result" },
        {
          value: "Xe van 500kg",
          label: "Xe van 500kg",
          trigger: "show_result",
        },
        {
          value: "Xe van 1 tấn",
          label: "Xe van 1 tấn",
          trigger: "show_result",
        },
        {
          value: "Xe tải 500kg",
          label: "Xe tải 500kg",
          trigger: "show_result",
        },
        {
          value: "Xe tải 1 tấn",
          label: "Xe tải 1 tấn",
          trigger: "show_result",
        },
        {
          value: "Xe tải 1.5 tấn",
          label: "Xe tải 1.5 tấn",
          trigger: "show_result",
        },
        {
          value: "Xe tải 2 tấn",
          label: "Xe tải 2 tấn",
          trigger: "show_result",
        },
      ],
      end: true,
    },
    {
      id: "show_result",
      message: "Giá thuê xe vận chuyển là: ",
      trigger: "review",
    },
    {
      id: "review",
      component: (
        <>
          <table
            style={{
              border: "1px solid #ccc",
              width: "100%",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <tbody>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <td>Tên khách hàng</td>
                <td>
                  {
                    JSON.parse(localStorage.getItem("total_price_chatbot"))
                      ?.customer_name
                  }
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <td>Từ địa điểm</td>
                <td>
                  {
                    JSON.parse(localStorage.getItem("total_price_chatbot"))
                      ?.fromLocation
                  }
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <td>Đến địa điểm</td>
                <td>
                  {
                    JSON.parse(localStorage.getItem("total_price_chatbot"))
                      ?.toLocation
                  }
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <td>Loại xe vận chuyển</td>
                <td>
                  {
                    JSON.parse(localStorage.getItem("total_price_chatbot"))
                      ?.name_vehicle
                  }
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <td>Khoảng cách</td>
                <td>
                  {
                    JSON.parse(localStorage.getItem("total_price_chatbot"))
                      ?.distance
                  }
                </td>
              </tr>
              <tr>
                <td>Tổng giá thuê xe</td>
                <td>
                  {JSON.parse(
                    localStorage.getItem("total_price_chatbot")
                  )?.total_price.toLocaleString() + "đ"}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ),
      end: false,
      trigger: "ket_thuc",
    },
    {
      id: "ket_thuc",
      message: "Kết thúc trò chuyện",
      end: true,
    },
  ];

  const [stepsInput, setStepInput] = useState(steps);

  const nav = useNavigate();
  const [openChatbot, setOpenChatbot] = useState(false);

  //Nhấn vào nút icon chatbot
  const openChatBotArea = () => {
    setOpenChatbot(true);
  };

  //Hàm tính khoảng cách giữa 2 điểm
  const total_distance = async (
    fromLocation,
    toLocation,
    choose_vehicle,
    customer_name
  ) => {
    try {
      //Lấy ra latitude và longtitude
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?q=${fromLocation}&format=json`
        )
        .then((data) => {
          let lat_long_from_location = {
            lat: data.data[0].lat,
            lon: data.data[0].lon,
          };

          if (lat_long_from_location) {
            axios
              .get(
                `https://nominatim.openstreetmap.org/search?q=${toLocation}&format=json`
              )
              .then((data) => {
                let lat_long_to_location = {
                  lat: data.data[0].lat,
                  lon: data.data[0].lon,
                };

                if (lat_long_from_location && lat_long_to_location) {
                  axios
                    .get(
                      `https://rsapi.goong.io/Direction?origin=${lat_long_from_location.lat},${lat_long_from_location.lon}&destination=${lat_long_to_location.lat},${lat_long_to_location.lon}&vehicle=truck&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
                    )
                    .then((data) => {
                      let result_data_distance =
                        data.data.routes[0].legs[0].distance.text; //Tính khoảng cách
                      let distance_result = result_data_distance.split(" ")[0];

                      if (distance_result) {
                        axios
                          .post("/v1/vehicle/moving_fee", {
                            name_vehicle: choose_vehicle,
                          })
                          .then((data) => {
                            let total_price = 0;
                            if (distance_result < 10) {
                              total_price = data.data.priceFirst10km;
                            } else {
                              if (distance_result - 10 < 45) {
                                total_price =
                                  data.data.priceFirst10km +
                                  (distance_result - 10) *
                                    data.data.priceFrom11to45;
                              } else {
                                total_price =
                                  data.data.priceFirst10km +
                                  (distance_result - 10) *
                                    data.data.pricePer45km;
                              }
                            }

                            const ob = {
                              fromLocation: fromLocation,
                              toLocation: toLocation,
                              distance: result_data_distance,
                              total_price: total_price,
                              customer_name: customer_name,
                              name_vehicle: choose_vehicle,
                            };

                            localStorage.setItem(
                              "total_price_chatbot",
                              JSON.stringify(ob)
                            );
                          })
                          .catch((e) => {
                            console.log(e);
                          });
                      }
                      // setDistanceLocate(result_data_distance);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  //Khi kết thúc Chatbot
  const handleEnd = ({ steps, values }) => {
    const {
      navigation,
      fromLocation,
      toLocation,
      choose_vehicle,
      customer_name,
    } = steps;
    if (navigation !== undefined) {
      let navi = navigation.value;
      nav(`${navi}`);
      Toast.fire({
        icon: "success",
        title: "Thực hiện di chuyển trang thành công !",
      });
    } else {
      try {
        total_distance(
          fromLocation.value,
          toLocation.value,
          choose_vehicle.value,
          customer_name.value
        );

        setOpenChatbot(false);

        setTimeout(() => {
          const stepsNew = [
            {
              id: "show_result",
              message: "Giá thuê xe vận chuyển là ",
              trigger: "review",
            },
            {
              id: "review",
              component: (
                <>
                  <table
                    style={{
                      border: "1px solid #ccc",
                      width: "100%",
                      borderRadius: "5px",
                      padding: "5px",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Tên khách hàng</td>
                        <td>
                          {JSON.parse(
                            localStorage.getItem("total_price_chatbot")
                          )
                            ? JSON.parse(
                                localStorage.getItem("total_price_chatbot")
                              ).customer_name
                            : "Không xác định"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Từ địa điểm</td>
                        <td>
                          {JSON.parse(
                            localStorage.getItem("total_price_chatbot")
                          )
                            ? JSON.parse(
                                localStorage.getItem("total_price_chatbot")
                              ).fromLocation
                            : "Không xác định"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Đến địa điểm</td>
                        <td>
                          {JSON.parse(
                            localStorage.getItem("total_price_chatbot")
                          )
                            ? JSON.parse(
                                localStorage.getItem("total_price_chatbot")
                              ).toLocation
                            : "Không xác định"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Loại xe vận chuyển</td>
                        <td>
                          {JSON.parse(
                            localStorage.getItem("total_price_chatbot")
                          )
                            ? JSON.parse(
                                localStorage.getItem("total_price_chatbot")
                              ).name_vehicle
                            : "Không xác định"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Khoảng cách</td>
                        <td>
                          {JSON.parse(
                            localStorage.getItem("total_price_chatbot")
                          )
                            ? JSON.parse(
                                localStorage.getItem("total_price_chatbot")
                              ).distance
                            : "Không xác định"}
                        </td>
                      </tr>
                      <tr>
                        <td>Tổng giá thuê xe</td>
                        <td>
                          {JSON.parse(
                            localStorage.getItem("total_price_chatbot")
                          )
                            ? JSON.parse(
                                localStorage.getItem("total_price_chatbot")
                              ).total_price.toLocaleString() + "đ"
                            : "Không xác định"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ),
              end: false,
              trigger: "ket_thuc",
            },
            {
              id: "ket_thuc",
              message: "Kết thúc trò chuyện",
              end: true,
            },
          ];

          setStepInput(stepsNew);
          setOpenChatbot(true);
        }, 2000);

        setTimeout(() => {
          const steps = [
            {
              id: "1",
              message: "Xin chào ! Hãy cho tôi biết tên của bạn ?",
              trigger: "customer_name",
            },
            {
              id: "customer_name",
              user: true,
              trigger: "3",
            },
            {
              id: "3",
              message: "Chào bạn {previousValue},	bạn có yêu cầu gì ạ ?",
              trigger: "menu",
            },
            //Đưa ra 2 yêu cầu
            {
              id: "menu",
              options: [
                {
                  value: "Chuyển trang",
                  label: "Chuyển trang",
                  trigger: "navigation",
                },
                {
                  value: "Báo giá thuê xe",
                  label: "Báo giá thuê xe",
                  trigger: "get_quote",
                },
                {
                  value: "Kết thúc",
                  label: "Kết thúc",
                  trigger: "ket_thuc",
                },
              ],
            },
            //Chuyển trang
            {
              id: "navigation",
              options: [
                { value: "/", label: "Trang chủ", trigger: "6" },
                {
                  value: "/service_price",
                  label: "Giá dịch vụ",
                  trigger: "6",
                },
                { value: "/blog", label: "Blog", trigger: "6" },
                { value: "/contact", label: "Liên Hệ", trigger: "6" },
                { value: "/login", label: "Đăng nhập", trigger: "6" },
                { value: "/register", label: "Đăng ký", trigger: "6" },
              ],
            },
            {
              id: "6",
              message: "Đã đi chuyển đến trang !",
              end: true,
            },
            //Báo giá
            {
              id: "get_quote",
              message: "Nhập vào địa chỉ bắt đầu",
              trigger: "fromLocation",
            },
            {
              id: "fromLocation",
              user: true,
              trigger: "tolocation_question",
            },
            {
              id: "tolocation_question",
              message: "Nhập vào địa chỉ kết thúc",
              trigger: "toLocation",
            },
            {
              id: "toLocation",
              user: true,
              trigger: "choose_vehicle_mess",
            },
            {
              id: "choose_vehicle_mess",
              message: "Chọn loại phương tiện vận chuyển",
              trigger: "choose_vehicle",
            },
            {
              id: "choose_vehicle",
              options: [
                {
                  value: "Xe bán tải",
                  label: "Xe bán tải",
                  trigger: "show_result",
                },
                {
                  value: "Xe van 500kg",
                  label: "Xe van 500kg",
                  trigger: "show_result",
                },
                {
                  value: "Xe van 1 tấn",
                  label: "Xe van 1 tấn",
                  trigger: "show_result",
                },
                {
                  value: "Xe tải 500kg",
                  label: "Xe tải 500kg",
                  trigger: "show_result",
                },
                {
                  value: "Xe tải 1 tấn",
                  label: "Xe tải 1 tấn",
                  trigger: "show_result",
                },
                {
                  value: "Xe tải 1.5 tấn",
                  label: "Xe tải 1.5 tấn",
                  trigger: "show_result",
                },
                {
                  value: "Xe tải 2 tấn",
                  label: "Xe tải 2 tấn",
                  trigger: "show_result",
                },
              ],
              end: true,
            },
            {
              id: "show_result",
              message: "Giá thuê xe vận chuyển là: ",
              trigger: "review",
            },
            {
              id: "review",
              component: (
                <>
                  <table
                    style={{
                      border: "1px solid #ccc",
                      width: "100%",
                      borderRadius: "5px",
                      padding: "5px",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Tên khách hàng</td>
                        <td>
                          {
                            JSON.parse(
                              localStorage.getItem("total_price_chatbot")
                            )?.customer_name
                          }
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Từ địa điểm</td>
                        <td>
                          {
                            JSON.parse(
                              localStorage.getItem("total_price_chatbot")
                            )?.fromLocation
                          }
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Đến địa điểm</td>
                        <td>
                          {
                            JSON.parse(
                              localStorage.getItem("total_price_chatbot")
                            )?.toLocation
                          }
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Loại xe vận chuyển</td>
                        <td>
                          {
                            JSON.parse(
                              localStorage.getItem("total_price_chatbot")
                            )?.name_vehicle
                          }
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ccc" }}>
                        <td>Khoảng cách</td>
                        <td>
                          {
                            JSON.parse(
                              localStorage.getItem("total_price_chatbot")
                            )?.distance
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>Tổng giá thuê xe</td>
                        <td>
                          {JSON.parse(
                            localStorage.getItem("total_price_chatbot")
                          )?.total_price.toLocaleString() + "đ"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ),
              end: false,
              trigger: "ket_thuc",
            },
            {
              id: "ket_thuc",
              message: "Kết thúc trò chuyện",
              end: true,
            },
          ];

          localStorage.removeItem("total_price_chatbot");
          setStepInput(steps);
        }, 4000);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <FloatButton
        onClick={() => openChatBotArea()}
        shape="circle"
        type="success"
        style={{
          right: 80,
          bottom: 20,
          width: "50px",
          height: "50px",
          backgroundColor: "#ff914d",
          color: "white",
        }}
        icon={<RobotOutlined />}
        tooltip={<div>Chatbot</div>}
      />

      {/* Chat bot */}
      {openChatbot ? (
        <>
          <CloseOutlined
            onClick={() => setOpenChatbot(false)}
            style={{
              position: "fixed",
              color: "white",
              right: "95px",
              bottom: "508px",
              zIndex: "99999",
              fontSize: "18px",
            }}
          />
          <ChatBot
            botAvatar={"./img/robot.png"}
            userAvatar={"./img/user.png"}
            handleEnd={handleEnd}
            headerTitle="Chatbot hỗ trợ dịch vụ"
            placeholder="Nhập tin nhắn tại đây..."
            steps={stepsInput}
            style={{
              position: "fixed",
              right: "80px",
              bottom: "20px",
            }}
          />
        </>
      ) : (
        ""
      )}
    </ThemeProvider>
  );
};

export default ChatBotIcon;
