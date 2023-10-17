import * as React from "react";
import { useState, useEffect } from "react";

import database from "../../firebase";
// app.js
import "@goongmaps/goong-js/dist/goong-js.css";

import polyline from "@mapbox/polyline";

import goongjs from "@goongmaps/goong-js";

import { useNavigate, useParams } from "react-router-dom";

function MapNavigation() {
  // const params = useParams();
  const [stepDraw, setStepDraw] = useState([]);

  const draw_two_location = () => {
    goongjs.accessToken = "e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu";
    var map = new goongjs.Map({
      container: "map",
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [105.80278, 20.99245],
      zoom: 12,
    });

    var size = 200;

    var marker = new goongjs.Marker()
      .setLngLat([105.783206, 21.031011])
      .addTo(map);

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
          origin: "20.981971,105.864323",
          destination: "21.031011,105.783206",
          vehicle: "car",
        })
        .send()
        .then(function(response) {
          var directions = response.body;
          var route = directions.routes[0];

          console.log(route);
          // Tách ra lat và lon theo từng cung đường theo Step
          var step_arr = route.legs[0].steps.map((item, index) => {
            return [item.start_location.lng, item.start_location.lat];
          });

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

          let count = 0;
          let navigation = setInterval(() => {
            if (count === step_arr.length) {
              alert("Đã đến điểm dừng");
              clearInterval(navigation);
            } else {
              var marker = new goongjs.Marker({ color: "red" })
                .setLngLat([step_arr[count][0], step_arr[count][1]])
                .addTo(map);

              //Lưu vô CSDL
              database
                .ref("navigation")
                .set({
                  lng: step_arr[count][0],
                  lat: step_arr[count][1],
                })
                .catch(alert);

              map.flyTo({
                center: [step_arr[count][0], step_arr[count][1]],
                zoom: 20,
                essential: true, // this animation is considered essential with respect to prefers-reduced-motion
              });
              count++;
            }
          }, 3000);
        });
    });
  };

  useEffect(() => {
    draw_two_location();
  }, []);

  return (
    <div
      className="container showMap"
      style={{
        overFlow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        id="map"
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      ></div>
    </div>
  );
}

export default MapNavigation;
