import React, { useState, useEffect } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import MapBox from "./Map/MapBox";

import axios from "axios";

import DatalistInput from "react-datalist-input";
import "react-datalist-input/dist/styles.css";

import goongjs from "@goongmaps/goong-js";

import goongSdk from "@goongmaps/goong-sdk";

import polyline from "@mapbox/polyline";

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

  useEffect(() => {
    goongjs.accessToken = "e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu";
    var map = new goongjs.Map({
      container: "map",
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [105.80278, 20.99245],
      zoom: 11.5,
    });

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
      // // Initialize goongClient with an API KEY
      // var goongClient = goongSdk({
      //   accessToken: "e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu",
      // });


      const goongClient = require("@goongmaps/goong-sdk");
      const goongDirections = require("@goongmaps/goong-sdk/services/directions");

      const baseClient = goongClient({
        accessToken: "x4WqDgXKiVktyzY4RVpr8t8CO6RPi2iR2j3g4HIB"
      });
      const directionService = goongDirections(baseClient);
      // Get Directions
      directionService
        .getDirections({
          origin: "20.981971,105.864323",
          destination: "21.031011,105.783206",
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
        });
    });
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
        </div>
      </div>
      <div className="image_ava_map col-lg-6">
        <MapBox fromLocation={fromLocation} toLocation={toLocation} />

        <div id="map"></div>
      </div>
    </div>
  );
}

export default Step2;
