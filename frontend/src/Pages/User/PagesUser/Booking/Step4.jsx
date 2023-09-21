import React, { useState, useEffect, useRef } from "react";
import { Transfer } from "antd";
import axios from "axios";

import { Toast } from "../../../../Components/ToastColor";

import { ReloadOutlined } from "@ant-design/icons";

import { Checkbox } from "antd";

import { Tabs } from "antd";

function Step4({ check_fill, setCheckFill, totalOrder, setTotalOrder }) {
  //Xử lý lấy toàn bộ dữ liệu chi phí
  const [DataServiceFee, setDataServiceFee] = useState([]); //Phí dịch vụ bổ sung
  const [DataMovingFee, setDataMovingFee] = useState([]); // Phí di chuyển
  const [manpower, setManPower] = useState({}); //Nhân công bốc vác -> Lấy thông tin tên và giá

  const [priceman, setPriceman] = useState(); //Giá nhân công
  const [quantity, setQuantity] = useState(0); //Số lượng nhân công
  const [total_price_man, setTotalPriceMan] = useState(0); //Tổng giá nhân công

  const [noteDriver, setNoteDriver] = useState(""); //Ghi chú cho tài xế

  const [dataItem, setDataItem] = useState([]);

  const [dataChooseItem, setDataChooseItem] = useState([]);

  const [cickUpdate, setClickUpdate] = useState(true);

  //Khu vực cho nhân công
  const firstPrice = useRef(0);

  //Khu vực cho phí di chuyển phương tiện
  const secondPrice = useRef(0);

  //Khu vực cho phí dịch vụ bổ sung
  const thirdPrice = useRef(0);

  //Khi đã lưu vào LocalStorage
  // useEffect(() => {
  //   if (localStorage.getItem("order_moving")) {
  //     //Khi đã nhập rồi thì lấy dữ liệu ra trong localStorage
  //     let data = JSON.parse(localStorage.getItem("order_moving"));
  //     let step4 = data.step4;

  //     if (step4) {
  //       // => Xử lý xong first
  //       setQuantity(step4.man_power_count.quantity_man);
  //       setTotalPriceMan(step4.man_power_count.total_price_man);
  //       firstPrice.current = step4.man_power_count.total_price_man;

  //       //Xử lý bước second
  //       const arrMovingFee = [];
  //       step4.moving_fee.forEach((item, idnex) => {
  //         DataMovingFee.forEach((item1, index) => {
  //           if (item.name === item1.title) {
  //             arrMovingFee.push(item1.key);
  //           }
  //         });
  //       });

  //       setTargetKeysMovingFee(arrMovingFee);
  //       get_moving_fee();

  //       //Xử lý bước 3
  //       const arrServiceFee = [];
  //       step4.service_fee.forEach((item, idnex) => {
  //         DataServiceFee.forEach((item1, index) => {
  //           if (item.name === item1.title) {
  //             arrServiceFee.push(item1.key);
  //           }
  //         });
  //       });
  //       setTargetKeys(arrServiceFee);
  //       get_service_fee();

  //       // Xử lý xong 4
  //       setNoteDriver(step4.noteDriver);

  //       get_item();
  //       //Xử lý về bước 5
  //       let data_ItemChoose = step4.dataChooseItem;
  //       setDataChooseItem(data_ItemChoose);

  //       // data_ItemChoose.forEach((item, index) => {
  //       //   let value_item_arr = document.querySelectorAll(".ant-checkbox-input");

  //       //   console.log(value_item_arr);

  //       //   value_item_arr[0].checked = true;
  //       //   // value_item_arr.forEach((item1, index1) => {

  //       //   //   // if (item1._wrapperState.initialValue === item) {
  //       //   //   //   console.log('bang rồi')
  //       //   //   //   item1.checked = true;
  //       //   //   // }
  //       //   // });
  //       // });

  //       //Xử lý tổng đơn hàng
  //       setTotalOrder(data.totalOrder);
  //     }
  //     update_total_order();
  //   }
  // }, []);

  useEffect(()=>{
      get_moving_fee();
      get_service_fee()
      get_item()
  },[])


  //Kiểm tra sau khi đã nhập đầy đủ tất cả dữ liệu
  useEffect(() => {
    if (
      firstPrice.current !== 0 &&
      secondPrice.current !== 0 &&
      thirdPrice.current !== 0 &&
      noteDriver !== "" &&
      dataChooseItem.length > 0
    ) {
      setCheckFill(true);

      //Tạo object lưu vào local cũ
      const object_order_local = JSON.parse(
        localStorage.getItem("order_moving")
      );

      object_order_local.totalOrder = totalOrder;

      const step4 = {
        man_power_count: firstPrice.current,
        moving_fee: secondPrice.current,
        service_fee: thirdPrice.current,
        noteDriver: noteDriver,
        dataChooseItem: dataChooseItem,
      };

      object_order_local.step4 = step4;

      localStorage.setItem("order_moving", JSON.stringify(object_order_local));
    } else {
      setCheckFill(false);
    }
  }, [
    firstPrice.current,
    secondPrice.current,
    thirdPrice.current,
    noteDriver,
    dataChooseItem,
    cickUpdate,
  ]);

  //Chi tiết hàng hóa đã chọn
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  //Tạo ra biến tạm cho tổng đơn hàng
  const temp_price_order = useRef(
    JSON.parse(localStorage.getItem("order_moving")).totalOrder
  );

  const handleIncrease = () => {
    // **// Cập nhật giá**
    setTotalPriceMan(quantity * priceman + priceman);

    // **// Tăng số lượng nhân công**
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity === 0) {
      Toast.fire({
        icon: "warning",
        title: "Không thể giảm !",
      });
    } else {
      setTotalPriceMan(quantity * priceman - priceman);
      setQuantity(quantity - 1 >= 0 ? quantity - 1 : 0);
    }
  };

  //Tính tổng toàn bộ
  const calculator_all = () => {
    let firstPriceNew = 0;
    let secondPriceNew = 0;
    let thirdPriceNew = 0;
    if (firstPrice.current !== 0) {
      firstPriceNew = firstPrice.current.total_price_man;
    }

    if (secondPrice.current !== 0) {
      secondPriceNew = secondPrice.current.total_second;
    }

    if (thirdPrice.current !== 0) {
      thirdPriceNew = thirdPrice.current.total_third;
    }

    setTotalOrder(
      Number(
        temp_price_order.current +
          firstPriceNew +
          secondPriceNew +
          thirdPriceNew
      )
    );
  };

  //Cập nhật giá tiền cuối cùng vào totalOrder
  const update_total_order = () => {
    setClickUpdate(!cickUpdate);
    changePriceMan();
    changeSecondPrice();
    changeThirdPrice();
  };

  //Khi nhấn xác nhận thêm vào total_order -> First Price
  const changePriceMan = () => {
    const ob = {
      quantity_man: quantity,
      total_price_man: total_price_man,
    };

    //Gắn cho First Price
    firstPrice.current = ob; //Hoàn tất tính tiền FirstPrice

    //Tính hóa đơn
    calculator_all();
  };

  //Khi nhấn xác nhận thêm vào phí di chuyển phương tiện => Second price
  const changeSecondPrice = () => {
    let arrSecondPrice = [];

    targetKeysMovingFee.forEach((item, index) => {
      DataMovingFee.forEach((item1, index) => {
        if (item === item1.key) {
          const ob = {
            name: item1.title,
            price: item1.price,
          };
          arrSecondPrice.push(ob);
        }
      });
    });

    let total_second = 0;
    //Tính tổng tiền SecondPrice
    arrSecondPrice.forEach((item, index) => {
      total_second += Number(item.price);
    });

    arrSecondPrice.total_second = total_second;

    //Gắn cho Second Price
    secondPrice.current = arrSecondPrice; //Hoàn tất tính tiền SecondPrice

    //Tính hóa đơn
    calculator_all();
  };

  //Khi nhấn xác nhận thêm vào phí dịch vụ bổ sung => Third price
  const changeThirdPrice = () => {
    let arrThirdPrice = [];

    targetKeys.forEach((item, index) => {
      DataServiceFee.forEach((item1, index) => {
        if (item === item1.key) {
          const ob = {
            name: item1.title,
            price: item1.price,
          };
          arrThirdPrice.push(ob);
        }
      });
    });

    let total_third = 0;
    //Tính tổng tiền ThirdPrice
    arrThirdPrice.forEach((item, index) => {
      total_third += Number(item.price);
    });

    arrThirdPrice.total_third = total_third;

    //Gắn cho Third Price
    thirdPrice.current = arrThirdPrice; //Hoàn tất tính tiền ThirdPrice

    //Tính hóa đơn
    calculator_all();
  };

  //Khi nhấn vào các vật dụng chi tiết
  const onChangeCheckBox = (checkedValues) => {
    let StringChange = checkedValues + "";

    // Kiểm tra xem phần tử đã tồn tại trong mảng hay chưa
    let index = dataChooseItem.indexOf(StringChange);

    // Nếu phần tử đã tồn tại trong mảng
    if (index > -1) {
      // Xóa phần tử trong mảng
      dataChooseItem.splice(index, 1);
    } else {
      // Thêm phần tử vào mảng
      dataChooseItem.push(StringChange);
    }

    // Cập nhật giá trị của mảng
    setDataChooseItem(dataChooseItem);
  };

  //Lấy danh sách phí bổ sung
  const get_service_fee = async () => {
    await axios
      .get(`/v1/service_fee/list_service_fee`)
      .then((data) => {
        let data_solve = data.data;
        const data_service = [];
        data_solve &&
          data_solve.forEach((item, index) => {
            if (item.fee_name !== "Nhân công bốc vác") {
              const ob_service = {
                key: index + 1,
                title:
                  item.fee_name +
                  " (" +
                  item.price.toLocaleString() +
                  " đ/ " +
                  item.unit +
                  ")",
                price: item.price,
              };

              data_service.push(ob_service);
            } else {
              const ob = {
                name: item.fee_name,
                price: item.price,
              };

              setPriceman(ob.price);

              setManPower(ob); //Lấy thông tin nhân công hiện ra
              // setTotalPriceMan(ob.price * countman);
            }
          });

        console.log(data_service);
        setDataServiceFee(data_service);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Lấy danh sách phí di chuyển phương tiện
  const get_moving_fee = async () => {
    const id_moving_fee = JSON.parse(localStorage.getItem("order_moving"));

    let vehicle_name = id_moving_fee.step3.vehicle_choose.vehicle_name;

    await axios
      .post(`/v1/vehicle/moving_fee`, { name_vehicle: vehicle_name })
      .then((data) => {
        let data_result = data.data;

        const arr_moving_fee = [
          {
            key: 1,
            title:
              "Bốc xếp tầng trệt 1 chiều" +
              " (" +
              data_result.Oneway_loadingFee.toLocaleString() +
              " đ)",
            price: data_result.Oneway_loadingFee,
          },
          {
            key: 2,
            title:
              "Bốc xếp tầng trệt 2 chiều" +
              " (" +
              data_result.Twoway_loadingFee.toLocaleString() +
              " đ)",
            price: data_result.Twoway_loadingFee,
          },
          {
            key: 3,
            title:
              "Bốc xếp tầng lầu 1 chiều" +
              " (" +
              data_result.OnewayFloor_loadingFee.toLocaleString() +
              " đ)",
            price: data_result.OnewayFloor_loadingFee,
          },
          {
            key: 4,
            title:
              "Bốc xếp tầng lầu 2 chiều" +
              " (" +
              data_result.TwowayFloor_loadingFee.toLocaleString() +
              " đ)",
            price: data_result.TwowayFloor_loadingFee,
          },
          {
            key: 5,
            title:
              "Phí chờ" +
              " (" +
              data_result.waiting_fee.toLocaleString() +
              " đ/ 30 phút)",
            price: data_result.waiting_fee,
          },
        ];

        setDataMovingFee(arr_moving_fee);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Lấy vật dụng từ CSDL
  const get_item = async () => {
    try {
      await axios
        .get(`/v1/item/read_item`)
        .then((data) => {
          let data_solve = data.data;
          const get_category =
            data_solve &&
            data_solve.map((item, index) => {
              if (item.status) {
                return item.category;
              }
            });

          //Loại bỏ phần tử trùng
          const set = new Set(get_category);

          const category_result = Array.from(set);

          if (category_result) {
            //Nếu đã có danh mục tiến hành thêm vào bảng
            const arr_data = category_result.map((item, index) => {
              const ob = {
                key: index + 1,
                label: item,
                children: data_solve.map((item1, index1) => {
                  if (item1.category === item) {
                    return (
                      <>
                        <Checkbox.Group
                          style={{
                            width: "100%",
                          }}
                          onChange={() => onChangeCheckBox(item1.name)}
                        >
                          <div className="row">
                            <div className="row">
                              <Checkbox value={item1.name}>
                                <div
                                  className="col"
                                  style={{
                                    border: "1px solid rgb(204, 204, 204)",
                                    borderRadius: "5px",
                                    padding: "5px",
                                    textAlign: "center",
                                    width: "200px",
                                  }}
                                >
                                  <img
                                    alt="anh"
                                    src={item1.image}
                                    width="50px"
                                    height="100px"
                                    style={{ objectFit: "cover" }}
                                  />
                                  <p
                                    style={{
                                      color: "#fab56e",
                                      fontWeight: "bold",
                                      marginTop: "3px",
                                    }}
                                  >
                                    {item1.name}
                                  </p>
                                  <p className="fw-bold">{item1.size}</p>
                                </div>
                              </Checkbox>
                            </div>
                          </div>
                        </Checkbox.Group>
                      </>
                    );
                  }
                }),
              };

              return ob;
            });

            console.log(arr_data);
            setDataItem(arr_data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  //Xử lý phần show danh sách chi phí
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleChange = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);
  };
  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  const handleScroll = (direction, e) => {};

  //Xử lý phần show danh sách phí di chuyển
  const [targetKeysMovingFee, setTargetKeysMovingFee] = useState([]);
  const [selectedKeysMovingFee, setSelectedKeysMovingFee] = useState([]);

  const handleChangeMovingFee = (newTargetKeys, direction, moveKeys) => {
    setTargetKeysMovingFee(newTargetKeys);
  };
  const handleSelectChangeMovingFee = (
    sourceSelectedKeys,
    targetSelectedKeys
  ) => {
    setSelectedKeysMovingFee([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  const handleScrollMovingFee = (direction, e) => {};

  return (
    <div className="booking_step_4 row">
      {/* Floating Action Button Phím gọi cập nhật giá tiền */}
      <div
        style={{
          position: "fixed",
          right: "-70px",
          borderRadius: "50%",
          top: "50%",
          width: "150px",
          height: "50px",
        }}
        onClick={() => update_total_order()}
      >
        <button
          className="btn"
          style={{
            backgroundColor: "rgb(230, 133, 35)",
            color: "white",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ReloadOutlined />
        </button>
      </div>
      <h4 style={{ fontSize: "16px", fontWeight: "700" }}>
        Bạn có thêm các dịch vụ bổ sung vào không ?
      </h4>
      <p style={{ fontSize: "14px", fontWeight: "400", color: "#a0a5b3" }}>
        *Đối với dịch vụ bọc, lắp ráp, vận chuyển cầu thang và đẩy dài, bạn cần
        sử dụng thêm người bốc vác
      </p>

      {/* Chỉ đối với ô nhân công thêm vào */}
      <div
        className="service_add_item d-flex"
        style={{ flexDirection: "column" }}
      >
        <div className="item_add_service d-flex">
          <img src="./img/nhancongbocvac.png" alt="anh" />
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <span>{manpower.name}</span>
            <span>{manpower.price?.toLocaleString()} đ</span>
          </div>
          <div style={{ marginLeft: "50px", flexDirection: "column" }}>
            Số lượng:
            <div
              className="d-flex"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "3px",
              }}
            >
              <div
                className="btn_decrease d-flex"
                style={{
                  fontSize: "20px",
                  width: "20px",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={handleDecrease}
              >
                -
              </div>
              <span
                style={{
                  margin: "0 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {quantity}
              </span>
              <div
                className="btn_increase d-flex"
                style={{
                  fontSize: "20px",
                  width: "20px",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={handleIncrease}
              >
                +
              </div>
            </div>
          </div>
          <div
            style={{
              marginLeft: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              borderRadius: "10px 50px 50px 10px",
              backgroundColor: "#e68523",
              padding: "3px",
            }}
          >
            {total_price_man.toLocaleString()} đ
          </div>
        </div>
      </div>

      {/* Đây là danh sách phí di chuyển phương tiện */}
      <h5 style={{ color: "#8abaf2 ", marginTop: "20px" }}>
        Phí di chuyển phương tiện
      </h5>
      <div
        className="d-flex"
        style={{
          borderRadius: "5px",
          marginTop: "15x",
          width: "700px",
        }}
      >
        <Transfer
          dataSource={DataMovingFee}
          titles={["Danh sách", "Đã chọn"]}
          targetKeys={targetKeysMovingFee}
          selectedKeys={selectedKeysMovingFee}
          onChange={handleChangeMovingFee}
          onSelectChange={handleSelectChangeMovingFee}
          onScroll={handleScrollMovingFee}
          render={(item) => item.title}
          oneWay
          style={{
            marginBottom: 16,
          }}
        />
      </div>

      {/* Đây là danh sách phí bổ sung */}
      <h5 style={{ color: "#8abaf2 " }}>Phí dịch vụ bổ sung</h5>
      <div
        style={{
          borderRadius: "5px",
          marginTop: "15x",
          width: "700px",
        }}
      >
        <Transfer
          dataSource={DataServiceFee}
          titles={["Danh sách", "Đã chọn"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          onScroll={handleScroll}
          render={(item) => item.title}
          oneWay
          style={{
            marginBottom: 16,
          }}
        />
      </div>

      {/* Ghi chú cho tài xế */}
      <h4 style={{ fontSize: "16px", fontWeight: "700", marginTop: "15px" }}>
        <span class="css-1umumsd e18midtv0">
          <svg
            aria-hidden="false"
            role="img"
            aria-labelledby="title"
            focusable="false"
            viewBox="0 0 217 217"
            style={{
              verticalAlign: "middle",
              fill: "rgb(241, 102, 34)",
              width: "24px",
              height: "24px",
            }}
          >
            <title>Remark</title>
            <g>
              <rect fill="none" width="217" height="217"></rect>
              <path d="M189,34.94h0m-.49.09V144H95.68L63,175.7V144H27V35H189m-.49-9H23a5.23,5.23,0,0,0-5,5.26v117A4.79,4.79,0,0,0,23,153H54v32.49a5,5,0,0,0,8.43,3.64l7.11-6.71L100.17,153H193a4.79,4.79,0,0,0,5-4.74v-117A5.23,5.23,0,0,0,193,26Zm0-.56Zm0,18h0Z"></path>
              <path d="M157.5,74h-99a4.5,4.5,0,0,1,0-9h99a4.5,4.5,0,0,1,0,9Z"></path>
              <path d="M117.5,108h-59a4.5,4.5,0,0,1,0-9h59a4.5,4.5,0,0,1,0,9Z"></path>
            </g>
          </svg>
        </span>
        &nbsp;
        <span style={{ fontWeight: "700", fontSize: "18px" }}>
          Ghi chú cho tài xế
        </span>
      </h4>
      <input
        style={{
          height: "150px",
          backgroundColor: "#fbfafc",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        className="note-for-driver"
        placeholder="Thêm hướng dẫn cho đơn hàng (ví dụ như danh mục hàng hóa, điểm gần địa chỉ nào...)"
        value={noteDriver}
        onChange={(e) => setNoteDriver(e.target.value)}
      ></input>

      {/* Chi tiết hàng hóa */}
      <div style={{ marginTop: "20px" }}>
        <span class="css-1umumsd e69w3h63">
          <svg
            aria-hidden="false"
            role="img"
            aria-labelledby="title"
            focusable="false"
            viewBox="0 0 217 217"
            style={{
              verticalAlign: "middle",
              fill: "rgb(241, 102, 34)",
              width: "24px",
              height: "24px",
            }}
          >
            <title>DefaultStatus</title>
            <g>
              <rect fill="none" width="217" height="217"></rect>
              <path d="M108.85,197.93a4.87,4.87,0,0,1-.75.07,4.11,4.11,0,0,1-.77-.08l-.31-.09-.33-.08-.14,0-83.9-32.36A4.09,4.09,0,0,1,20,161.65V55.37c0-.28.12-.57.12-.82,0,0,0-.14.06-.25s.1-.36.15-.53,0-.15.06-.22a4.55,4.55,0,0,1,.25-.67c0-.07.07-.13.1-.19a4.5,4.5,0,0,1,.39-.57l.18-.24a4.81,4.81,0,0,1,.51-.47,2.1,2.1,0,0,0,.37-.35l.32-.22.06-.18a1.93,1.93,0,0,1,.28-.22L24,50l0-.43,82.67-31.46a1.94,1.94,0,0,1,.66-.11,6.82,6.82,0,0,1,2.21.54l83.92,32.38a3.56,3.56,0,0,1,.77.4l.17.14a4.78,4.78,0,0,1,.51.45l.21.25a4.58,4.58,0,0,1,.31.46l.16.27a6.31,6.31,0,0,1,.24.64c0,.08,0,.14.06.21a3.77,3.77,0,0,1,.09.83V161.65a3.94,3.94,0,0,1-2.53,3.71l-83.91,32.37-.36.1ZM113,91.74v94.51l74-29.33V62.4ZM29,156.93l75,29.29V91.71L71,78.63v43c0,2-2.15,4-4.5,4s-4.5-2-4.5-4v-46L29,62.45ZM77.19,70.81l30.92,11.93L181,54.63,150.07,42.7Zm-42-16.18L66.15,66.55,139,38.44,108.11,26.51Z"></path>
            </g>
          </svg>
        </span>
        &nbsp;
        <span style={{ fontWeight: "700", fontSize: "18px" }}>
          Chi tiết hàng hóa
        </span>
      </div>

      <div className="tab_choose_item">
        <Tabs defaultActiveKey="1" items={dataItem} onChange={onChange} />
      </div>
    </div>
  );
}

export default Step4;
