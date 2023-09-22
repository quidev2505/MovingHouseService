import React, { useState, useEffect } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import MapBox from "./Map/MapBox";

import axios from "axios";

import DatalistInput from "react-datalist-input";

// eslint-disable-next-line
import "react-datalist-input/dist/styles.css";
// eslint-disable-next-line

import goongjs from "@goongmaps/goong-js";

import polyline from "@mapbox/polyline";

import { Toast } from "../../../../Components/ToastColor";

function Step2({ check_fill, setCheckFill, current, setCurrent }) {
  const [locationFrom, setLocationFrom] = useState(""); //Địa điểm nhập vào
  const [dataList, setDataList] = useState([]); //Hiển thị ra list danh sách
  const [locationFromChoose, setLocationFromChoose] = useState(""); //Địa điểm đã chọn từ danh sách
  const [fromLocation, setFromLocation] = useState({}); //Chọn địa điểm đưa vào bản đồ
  const [from_location_detail, setFromLocationDetail] = useState(""); //Địa chỉ lấy hàng cụ thể

  const [locationTo, setLocationTo] = useState("");
  const [dataList_To, setDataList_To] = useState([]);
  const [locationToChoose, setLocationToChoose] = useState("");
  const [toLocation, setToLocation] = useState({});
  const [to_location_detail, setToLocationDetail] = useState(""); //Địa chỉ nhận hàng cụ thể

  //Tính khoảng cách
  const [distance, setDistance] = useState();

  //Thiết lập địa lấy hàng FROM
  const get_location_list = async () => {
    await axios
      .get(
        `https://nominatim.openstreetmap.org/search?q=${locationFrom}&format=json`
      )
      .then((data) => {
        let result = data.data;
        if (result) {
          let arr_result = result.map((item, index) => {
            const ob = {
              id: item.display_name,
              value: item.display_name,
              location: {
                lat: item.lat,
                lon: item.lon,
                display_name: item.display_name,
              },
            };
            return ob;
          });

          setDataList(arr_result);
          console.log(arr_result);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const get_location_from_choose = () => {
    let choose_option = locationFromChoose;
    if (choose_option) {
      const ob = {
        lat: Number(choose_option.lat),
        lng: Number(choose_option.lon),
        name: choose_option.display_name,
      };

      if (!isInVietnam(ob)) {
        Toast.fire({
          icon: "warning",
          title: "Chỉ có thể chọn địa chỉ trong phạm vi Việt Nam !",
        });
        setLocationFrom("");
      } else {
        setFromLocation(ob);
      }
    }
  };

  // Hàm kiểm tra địa chỉ có nằm trong Việt Nam hay không
  function isInVietnam(coordinates) {
    const latitude = coordinates.lat;
    const longitude = coordinates.lng;
    return (
      latitude >= 8.526794234832764 &&
      latitude <= 23.2021484375 &&
      longitude >= 102.22265625 &&
      longitude <= 109.3125
    );
  }

  useEffect(() => {
    if (locationFrom.length >= 5) {
      get_location_list();
    }
  }, [locationFrom]);

  useEffect(() => {
    setTimeout(() => {
      get_location_from_choose();
    }, 1000);
  }, [locationFromChoose]);

  //Thiết lập địa điểm nhận hàng TO
  const get_location_list_to = async () => {
    await axios
      .get(
        `https://nominatim.openstreetmap.org/search?q=${locationTo}&format=json`
      )
      .then((data) => {
        let result = data.data;
        if (result) {
          let arr_result = result.map((item, index) => {
            const ob = {
              id: item.display_name,
              value: item.display_name,
              location: {
                lat: item.lat,
                lon: item.lon,
                display_name: item.display_name,
              },
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

  const get_location_to_choose = () => {
    let choose_option = locationToChoose;
    if (choose_option) {
      const ob = {
        lat: Number(choose_option.lat),
        lng: Number(choose_option.lon),
        name: choose_option.display_name,
      };

      //Kiểm tra xem điểm nhập vào có nằm ở Việt nam không.
      if (!isInVietnam(ob)) {
        Toast.fire({
          icon: "warning",
          title: "Chỉ có thể chọn địa chỉ trong phạm vi Việt Nam !",
        });
        setLocationTo("");
      } else {
        setToLocation(ob);

        setTimeout(() => {
          draw_between_two_location(fromLocation, ob);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (locationTo.length >= 5) {
      get_location_list_to();
    }
  }, [locationTo]);

  useEffect(() => {
    setTimeout(() => {
      get_location_to_choose();
    }, 4000);
  }, [locationToChoose]);

  //Thiết lập tính năng vẽ giữa 2 điểm
  const draw_between_two_location = (fromLocation, ob) => {
    try {
      // Get the map element
      goongjs.accessToken = "e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu";
      var map = new goongjs.Map({
        container: "map",
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [fromLocation.lng, fromLocation.lat],
        zoom: 8,
      });

      map &&
        map.on("load", function () {
          var layers = map.getStyle().layers;
          // Find the index of the first symbol layer in the map style
          var firstSymbolId;
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === "symbol") {
              firstSymbolId = layers[i].id;
              break;
            }
          }

          const goongClient = require("@goongmaps/goong-sdk");
          const goongDirections = require("@goongmaps/goong-sdk/services/directions");

          const baseClient = goongClient({
            accessToken: "5aqYNFbo45HBk3GB5hqCRX2FlXEBioT41FsZopYy",
          });
          const directionService = goongDirections(baseClient);
          // Get Directions
          directionService
            .getDirections({
              origin: `${fromLocation.lat}, ${fromLocation.lng}`,
              destination: `${ob.lat}, ${ob.lng}`,
              vehicle: "car",
            })
            .send()
            .then(function (response) {
              var directions = response.body;
              var route = directions.routes[0];

              var geometry_string = route.overview_polyline.points;
              var geoJSON = polyline.toGeoJSON(geometry_string);
              map.addSource("route", {
                type: "geojson",
                data: geoJSON,
              });
              // Add route layer below symbol layers
              map.addLayer(
                {
                  id: "route",
                  type: "line",
                  source: "route",
                  layout: {
                    "line-join": "round",
                    "line-cap": "round",
                  },
                  paint: {
                    "line-color": "#1e88e5",
                    "line-width": 8,
                  },
                },
                firstSymbolId
              );

              //Thêm 2 điểm marker vào 2 đầu
              var marker = new goongjs.Marker({ color: "red" })
                .setLngLat([fromLocation.lng, fromLocation.lat])
                .addTo(map);

              var marker_1 = new goongjs.Marker({ color: "#00bab3" })
                .setLngLat([ob.lng, ob.lat])
                .addTo(map);

              //Cho mapFirst biến mất
              // document.querySelector("#Map_first").style.display = "none";

              //Cho map phia dưới nhảy lên trên
              let element = document.getElementById("map");
              if (element) {
                element.style.top = "-441px";
              }

              //Thực hiện gọi hàm tính khoảng cách
              total_distance(fromLocation, ob);
            });
        });
    } catch (e) {
      console.log(e);
    }
  };

  //Tính năng tính khoảng cách giữa 2 điểm
  const total_distance = async (fromLocation, ob) => {
    try {
      await axios
        .get(
          `https://rsapi.goong.io/Direction?origin=${fromLocation.lat},${fromLocation.lng}&destination=${ob.lat},${ob.lng}&vehicle=truck&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
        )
        .then((data) => {
          let result_data = data.data.routes[0].legs[0].distance.text;
          setDistance(result_data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  //Kiểm tra khi nhập đủ hết các trường
  useEffect(() => {
    if (
      fromLocation !== undefined &&
      toLocation !== undefined &&
      from_location_detail !== undefined &&
      to_location_detail !== undefined &&
      distance !== undefined
    ) {
      setCheckFill(true);

      const object_order_local = JSON.parse(
        localStorage.getItem("order_moving")
      );

      const step2 = {
        locationFrom: fromLocation.display_name,
        locationTo: toLocation.display_name,

        locationFromChoose: locationFromChoose,
        from_location_detail: from_location_detail,
        fromLocation: fromLocation,

        locationToChoose: locationToChoose,
        to_location_detail: to_location_detail,
        toLocation: toLocation,

        distance: distance,
      };

      object_order_local.step2 = step2;

      localStorage.setItem("order_moving", JSON.stringify(object_order_local));
    } else {
      setCheckFill(false);
    }
  }, [
    locationFrom,
    locationTo,
    fromLocation,
    toLocation,
    locationFromChoose,
    locationToChoose,
    from_location_detail,
    to_location_detail,
    distance,
  ]);

  //Khi đã nhập rồi thì kiểm tra trong localStorage
  useEffect(() => {
    if (localStorage.getItem("order_moving")) {
      if (
        JSON.parse(localStorage.getItem("order_moving")).step2 !== undefined
      ) {
        let data = JSON.parse(localStorage.getItem("order_moving"));
        let step2 = data.step2;

        setLocationFrom(step2.fromLocation.name);

        setLocationTo(step2.toLocation.name);

        setFromLocation(step2.fromLocation);
        setToLocation(step2.toLocation);
        setLocationFromChoose(step2.locationFromChoose);
        setLocationToChoose(step2.locationToChoose);
        setFromLocationDetail(step2.from_location_detail);
        setToLocationDetail(step2.to_location_detail);
        setDistance(step2.distance);
      }
    }
  }, []);

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
              className="data_list"
              placeholder="Nhập vào điểm lấy hàng"
              style={{
                width: "100%",
                height: "60px",
                marginBottom: "14px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                paddingLeft: "50px",
                backgroundColor: "#fbfafc",
                width: "100% !important",
                borderRadius: "10px !important",
                padding: "3px !important",
                border: "1px solid #ccc",
              }}
              value={locationFrom}
              onChange={(e) => setLocationFrom(e.target.value)}
              items={dataList}
              onSelect={(item) => setLocationFromChoose(item.location)}
            />
          </div>

          <span style={{ fontSize: "14px", fontWeight: "400" }}>
            Thông tin địa chỉ cụ thể:
          </span>
          <input
            type="text"
            value={from_location_detail}
            onChange={(e) => setFromLocationDetail(e.target.value)}
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
              className="data_list_2"
              placeholder="Nhập vào điểm nhận hàng"
              style={{
                width: "100%",
                height: "60px",
                marginBottom: "16px",
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
              onSelect={(item) => setLocationToChoose(item.location)}
            />
          </div>

          <span style={{ fontSize: "14px", fontWeight: "400" }}>
            Thông tin địa chỉ cụ thể:
          </span>
          <input
            type="text"
            placeholder="Nhập vào thông tin cụ thể..."
            value={to_location_detail}
            onChange={(e) => setToLocationDetail(e.target.value)}
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
      </div>
      <div className="image_ava_map col-lg-6">
        <MapBox
          fromLocation={fromLocation}
          toLocation={toLocation}
          id="Map_first"
        />

        <div id="map" style={{ marginTop: "10px" }}>
          <div
            id="distance"
            style={{
              top: 0,
              backgroundColor: "rgba(255,255,255,0.8)",
              padding: "5px",
              position: "absolute",
              color: "black",
              fontSize: "14px",
              fontWeight: "400",
              width: "600px",
              margin: "5px",
              borderRadius: "5px",
            }}
          >
            Khoảng cách: <span style={{ color: "#ed883b" }}>{distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2;
