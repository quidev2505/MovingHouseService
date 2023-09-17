import React, { useState, useEffect } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import MapBox from "./Map/MapBox";

import axios from "axios";

import DatalistInput from "react-datalist-input";
import "react-datalist-input/dist/styles.css";

function Step2({ check_fill, setCheckFill }) {
  const [locationFrom, setLocationFrom] = useState();
  const [dataList, setDataList] = useState([]);
  const [locationFromChoose, setLocationFromChoose] = useState();
  const [fromLocation, setFromLocation] = useState({});

  const [locationTo, setLocationTo] = useState();
  const [dataList_To, setDataList_To] = useState([]);
  const [locationToChoose, setLocationToChoose] = useState();
  const [toLocation, setToLocation] = useState({});

  //FROM
  const get_location_list = async () => {
    await axios
      .get(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${process.env.REACT_APP_GOONG_API_KEY}&input=${locationFrom}`
      )
      .then((data) => {
        let result = data.data.predictions;
        if (result) {
          let arr_result = result.map((item, index) => {
            const ob = {
              key: item.description,
              value: item.description,
              place_id: item.place_id,
            };
            return ob;
          });

          setDataList(arr_result);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const get_location_from_choose = async () => {
    await axios
      .get(
        `https://rsapi.goong.io/Place/Detail?place_id=${locationFromChoose}&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
      )
      .then((data) => {
        let result = data.data.result.geometry.location;
        let name = data.data.result.formatted_address;

        const ob = {
          lat: result.lat,
          lng: result.lng,
          name: name,
        };

        setFromLocation(ob);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      get_location_list();
    }, 1000);
  }, [locationFrom]);

  useEffect(() => {
    setTimeout(() => {
      get_location_from_choose();
    }, 1000);
  }, [locationFromChoose]);

  //TO
  const get_location_list_to = async () => {
    await axios
      .get(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${process.env.REACT_APP_GOONG_API_KEY}&input=${locationTo}`
      )
      .then((data) => {
        console.log(data);
        let result = data.data.predictions;
        if (result) {
          let arr_result = result.map((item, index) => {
            const ob = {
              key: item.description,
              value: item.description,
              place_id: item.place_id,
            };
            return ob;
          });

          setDataList_To(arr_result);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [img_draw, setImgDraw] = useState();

  const show_draw_between_location = async () => {
    axios
      .get(
        `https://rsapi.goong.io/staticmap/route?origin=20.981971,105.864323&destination=21.03876,105.79810&vehicle=car&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
      )
      .then(async (data) => {
        let data_new = data.data;

        console.log(data_new);
        let data_result =
          "https://images.unsplash.com/photo-1682685796186-1bb4a5655653?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60";
        setImgDraw(data_result);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const get_location_to_choose = async () => {
    await axios
      .get(
        `https://rsapi.goong.io/Place/Detail?place_id=${locationToChoose}&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
      )
      .then((data) => {
        let result = data.data.result.geometry.location;
        let name = data.data.result.formatted_address;

        const ob = {
          lat: result.lat,
          lng: result.lng,
          name: name,
        };

        setToLocation(ob);

        if (toLocation !== undefined) {
          setTimeout(() => {
            show_draw_between_location();
          }, 5000);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      get_location_list_to();
    }, 1000);
  }, [locationTo]);

  useEffect(() => {
    setTimeout(() => {
      get_location_to_choose();
    }, 1000);
  }, [locationToChoose]);

  return (
    <div className="booking_step_2 row" style={{ margin: "30px -160px" }}>
      <div
        className="location col-lg-6"
        style={{ overflowY: "scroll", maxHeight: "430px" }}
      >
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "10px",
                color: "#9d9d9d",
                marginBottom: "5px",
              }}
            >
              <QuestionCircleOutlined />
            </span>
            <span style={{ fontWeight: "700", fontSize: "16px" }}>
              {" "}
              Địa điểm lấy hàng
            </span>
          </h3>
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
                display: "block",
                borderRadius: "5px",
                backgroundColor: "red",
                width: "28px",
                height: "28px",
                position: "absolute",
                top: "17px",
                left: "10px",
              }}
            >
              1
            </div>
            <DatalistInput
              type="text"
              placeholder="Nhập vào điểm lấy hàng"
              style={{
                width: "100%",
                height: "60px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                padding: "7px",
                paddingLeft: "50px",
                backgroundColor: "#fbfafc",
              }}
              value={locationFrom}
              onChange={(e) => setLocationFrom(e.target.value)}
              items={dataList}
              onSelect={(item) => setLocationFromChoose(item.place_id)}
            />
          </div>

          <span style={{ fontSize: "14px", fontWeight: "400" }}>
            Thông tin địa chỉ cụ thể:
          </span>
          <input
            type="text"
            placeholder="Nhập vào thông tin cụ thể..."
            style={{
              width: "100%",
              height: "100px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              padding: "7px",
              backgroundColor: "#fbfafc",
            }}
          />
        </div>

        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "10px",
                color: "#9d9d9d",
                marginBottom: "5px",
              }}
            >
              <QuestionCircleOutlined />
            </span>
            <span style={{ fontWeight: "700", fontSize: "16px" }}>
              {" "}
              Địa điểm nhận hàng
            </span>
          </h3>
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
                display: "block",
                borderRadius: "5px",
                backgroundColor: "#00bab3 ",
                width: "28px",
                height: "28px",
                position: "absolute",
                top: "17px",
                left: "10px",
              }}
            >
              2
            </div>
            <DatalistInput
              type="text"
              placeholder="Nhập vào điểm nhận hàng"
              style={{
                width: "100%",
                height: "60px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                padding: "7px",
                paddingLeft: "50px",
                backgroundColor: "#fbfafc",
              }}
              value={locationTo}
              onChange={(e) => setLocationTo(e.target.value)}
              items={dataList_To}
              onSelect={(item) => setLocationToChoose(item.place_id)}
            />
          </div>

          <span style={{ fontSize: "14px", fontWeight: "400" }}>
            Thông tin địa chỉ cụ thể:
          </span>
          <input
            type="text"
            placeholder="Nhập vào thông tin cụ thể..."
            style={{
              width: "100%",
              height: "100px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              padding: "7px",

              backgroundColor: "#fbfafc",
            }}
          />

          {img_draw ? <img alt="ok" src={img_draw} /> : ""}
        </div>
      </div>
      <div className="image_ava_map col-lg-6">
        <MapBox fromLocation={fromLocation} toLocation={toLocation} />
      </div>
    </div>
  );
}

export default Step2;
