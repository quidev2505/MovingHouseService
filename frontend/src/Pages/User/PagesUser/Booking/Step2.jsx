import React, { useState, useEffect } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import MapBox from "./Map/MapBox";

import axios from "axios";

import DatalistInput from "react-datalist-input";

// eslint-disable-next-line
import "react-datalist-input/dist/styles.css"; // eslint-disable-next-line
// eslint-disable-next-line

import goongjs from "@goongmaps/goong-js";

import polyline from "@mapbox/polyline";

import { Toast } from "../../../../Components/ToastColor";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";

function Step2({ check_fill, setCheckFill, current, setCurrent }) {
  const [isActive, setIsActive] = useState(true);

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

  //Khu vực giao hàng
  const [deliveryArea, setDeliveryArea] = useState("");

  //Tính khoảng cách
  const [distance, setDistance] = useState();

  //Tính thời gian hoàn thành giao hàng
  const [duration, setDuration] = useState();

  //Thiết lập địa lấy hàng FROM
  const get_location_list = async () => {
    await axios
      .get(
        `https://rsapi.goong.io/geocode?address=${locationFrom}&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
      )
      .then((data) => {
        let result = data.data.results;
        if (result) {
          let arr_result = result.map((item, index) => {
            const ob = {
              id: item.formatted_address,
              value: item.formatted_address,
              location: {
                lat: item.geometry.location.lat,
                lon: item.geometry.location.lng,
                display_name: item.formatted_address,
              },
            };
            return ob;
          });

          console.log(arr_result);
          setDataList(arr_result);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  function checkTinh(latitude, longitude) {
    // Lấy danh sách tỉnh lân cận của TPHCM và Hà Nội
    const tinhLanCanTphcm = [
      "Long An",
      "Đồng Nai",
      "Bình Dương",
      "Bình Phước",
      "Tây Ninh",
      "Bà Rịa - Vũng Tàu",
      "Tiền Giang",
      "Bến Tre",
      "Trà Vinh",
      "Vĩnh Long",
      "Đồng Tháp",
      "An Giang",
      "Kiên Giang",
      "Cần Thơ",
    ];
    const tinhLanCanHaNoi = [
      "Hà Nam",
      "Hưng Yên",
      "Thái Bình",
      "Nam Định",
      "Bắc Ninh",
      "Lạng Sơn",
      "Quảng Ninh",
      "Thái Nguyên",
      "Bắc Giang",
      "Phú Thọ",
      "Vĩnh Phúc",
      "Hà Nội",
      "Hải Phòng",
      "Hưng Yên",
    ];

    // Tính toán tọa độ trung tâm của TPHCM và Hà Nội
    const tinhTphcm = {
      latitude: 10.827021,
      longitude: 106.693918,
    };
    const tinhHaNoi = {
      latitude: 21.027767,
      longitude: 105.833132,
    };

    // Kiểm tra vị trí có nằm trong bán kính 500km xung quanh trung tâm của TPHCM
    const isInRadiusTphcm =
      calculateDistance(
        latitude,
        longitude,
        tinhTphcm.latitude,
        tinhTphcm.longitude
      ) <= 500;

    // Kiểm tra vị trí có nằm trong bán kính 500km xung quanh trung tâm của Hà Nội
    const isInRadiusHaNoi =
      calculateDistance(
        latitude,
        longitude,
        tinhHaNoi.latitude,
        tinhHaNoi.longitude
      ) <= 500;

    // Trả về kết quả
    return isInRadiusTphcm
      ? "TPHCM và các tỉnh lân cận"
      : isInRadiusHaNoi
      ? "Hà Nội và các tỉnh lân cận"
      : null;
  }

  // Hàm tính toán khoảng cách giữa hai điểm
  function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    const R = 6371; // Bán kính Trái Đất (km)

    // Tính toán toạ độ x và y của hai điểm
    const x1 = (longitude1 * Math.PI * R) / 180;
    const y1 = (latitude1 * Math.PI * R) / 180;
    const x2 = (longitude2 * Math.PI * R) / 180;
    const y2 = (latitude2 * Math.PI * R) / 180;

    // Tính toán khoảng cách
    const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    return d;
  }

  const get_location_from_choose = () => {
    let choose_option = locationFromChoose;
    if (choose_option) {
      const ob = {
        lat: Number(choose_option.lat),
        lng: Number(choose_option.lon),
        name: choose_option.display_name,
      };

      console.log(ob);

      if (!isInVietnam(ob)) {
        Toast.fire({
          icon: "warning",
          title: "Chỉ có thể chọn địa chỉ trong phạm vi Việt Nam !",
        });
        setLocationFrom("");
      } else {
        setDeliveryArea(checkTinh(ob.lat, ob.lng));
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
    if (locationFrom && locationFrom.length >= 6) {
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
        `https://rsapi.goong.io/geocode?address=${locationTo}&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
      )
      .then((data) => {
        let result = data.data.results;
        if (result) {
          let arr_result = result.map((item, index) => {
            const ob = {
              id: item.formatted_address,
              value: item.formatted_address,
              location: {
                lat: item.geometry.location.lat,
                lon: item.geometry.location.lng,
                display_name: item.formatted_address,
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
    if (locationTo && locationTo.length >= 6) {
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
        map.on("load", function() {
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
              alternatives: true,
              vehicle: "car",
            })
            .send()
            .then(function(response) {
              console.log(response);
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
              var marker = new goongjs.Marker({ color: "red", draggable: true })
                .setLngLat([fromLocation.lng, fromLocation.lat])
                .addTo(map);

              var marker_1 = new goongjs.Marker({
                color: "#00bab3",
                draggable: true,
              })
                .setLngLat([ob.lng, ob.lat])
                .addTo(map);

              //Location From
              function onDragEnd() {
                var lngLat = marker.getLngLat();
                changeLocation(lngLat.lng, lngLat.lat);
              }

              marker.on("dragend", onDragEnd);

              //Location To
              function onDragEndTo() {
                var lngLat = marker_1.getLngLat();
                changeLocation_To(lngLat.lng, lngLat.lat);
              }

              marker_1.on("dragend", onDragEndTo);

              // //Cho mapFirst biến mất
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

  const changeLocation = async (lng, lat) => {
    try {
      Toast.fire({
        icon: "warning",
        title: "Xin vui lòng chờ cập nhật lại địa điểm !",
      });
      const data = await axios.get(
        `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&1`
      );
      let data_location = data.data;
      // // Sử dụng DOM parser để parse đoạn String XML
      // const parser = new DOMParser();
      // const doc = parser.parseFromString(data_location, "text/xml");

      // // Lấy ra element <result>
      // const resultElement = doc.querySelector("result");

      // // Lấy ra text content của element <result>
      // const resultText = resultElement.textContent;

      // Trả về text content của element <result>
      const ob = {
        lat: Number(lat),
        lon: Number(lng),
        display_name: data_location.display_name,
      };

      const ob_new = {
        lat: Number(lat),
        lng: Number(lng),
        name: data_location.display_name,
      };

      setLocationFromChoose(ob);
      // draw_between_two_location(ob, toLocation);

      //Thực hiện set vào localStorage
      let data_from_local = JSON.parse(localStorage.getItem("order_moving"));
      let step2 = data_from_local.step2;
      step2.fromLocation = ob_new;

      localStorage.setItem("order_moving", JSON.stringify(data_from_local));

      // get_location_from_choose();

      setTimeout(() => {
        setCurrent(current - 1);
        setTimeout(() => {
          setCurrent(current + 0);
        }, 4000);
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  const changeLocation_To = async (lng, lat) => {
    try {
      const data = await axios.get(
        `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&1`
      );
      let data_location = data.data;
      // console.log(data_location);
      // // Sử dụng DOM parser để parse đoạn String XML
      // const parser = new DOMParser();
      // const doc = parser.parseFromString(data_location, "text/xml");

      // // Lấy ra element <result>
      // const resultElement = doc.querySelector("result");

      // // Lấy ra text content của element <result>
      // const resultText = resultElement.textContent;

      // Trả về text content của element <result>
      const ob = {
        lat: Number(lat),
        lon: Number(lng),
        display_name: data_location.display_name,
      };

      const ob_new = {
        lat: Number(lat),
        lng: Number(lng),
        name: data_location.display_name,
      };

      setLocationToChoose(ob);
      // draw_between_two_location(ob, toLocation);

      //Thực hiện set vào localStorage
      let data_from_local = JSON.parse(localStorage.getItem("order_moving"));
      let step2 = data_from_local.step2;
      step2.toLocation = ob_new;

      localStorage.setItem("order_moving", JSON.stringify(data_from_local));

      // get_location_from_choose();

      setTimeout(() => {
        setCurrent(current - 1);
        setTimeout(() => {
          setCurrent(current + 0);
        }, 4000);
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  //Tính năng tính khoảng cách giữa 2 điểm và tính thời gian hoàn tất.
  const total_distance = async (fromLocation, ob) => {
    try {
      await axios
        .get(
          `https://rsapi.goong.io/Direction?origin=${fromLocation.lat},${fromLocation.lng}&destination=${ob.lat},${ob.lng}&vehicle=truck&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
        )
        .then((data) => {
          console.log(data);
          let result_data_distance = data.data.routes[0].legs[0].distance.text; //Tính khoảng cách
          let result_data_duration = data.data.routes[0].legs[0].duration.text; //Tính thời gian hoàn thành
          setDistance(result_data_distance);
          setDuration(result_data_duration);
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
      distance !== undefined &&
      duration !== undefined
    ) {
      setCheckFill(true);

      const object_order_local = JSON.parse(
        localStorage.getItem("order_moving")
      );

      const step2 = {
        locationFrom: fromLocation.display_name,
        locationTo: toLocation.display_name,

        deliveryArea: deliveryArea,

        locationFromChoose: locationFromChoose,
        from_location_detail: from_location_detail,
        fromLocation: fromLocation,

        locationToChoose: locationToChoose,
        to_location_detail: to_location_detail,
        toLocation: toLocation,

        distance: distance,
        duration: duration,
      };

      object_order_local.step2 = step2;

      localStorage.setItem("order_moving", JSON.stringify(object_order_local));
    } else {
      setCheckFill(false);
    }
  }, [
    deliveryArea,
    locationFrom,
    locationTo,
    fromLocation,
    toLocation,
    locationFromChoose,
    locationToChoose,
    from_location_detail,
    to_location_detail,
    distance,
    duration,
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

      setIsActive(false);
    }
  }, []);

  return (
    <LoadingOverlayComponent status={isActive}>
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
                  marginBottom: "16px",
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
                marginTop: "23px",
                left: "10px",
              }}
            >
              Khoảng cách: <span style={{ color: "#ed883b" }}>{distance}</span>{" "}
              | Thời gian: <span style={{ color: "#ed883b" }}>{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlayComponent>
  );
}

export default Step2;
