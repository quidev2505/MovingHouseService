import * as React from "react";
import { useState, useEffect } from "react";

import * as turf from "@turf/turf";

// app.js
import "@goongmaps/goong-js/dist/goong-js.css";

import polyline from "@mapbox/polyline";

import goongjs from "@goongmaps/goong-js";

function ShowMap() {
  const get_from_location = () => {
    goongjs.accessToken = "e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu";
    var map = new goongjs.Map({
      container: "map",
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [105.864323, 20.981971],
      zoom: 18,
    });

    var size = 200;

    // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
    // see https://docs.goong.io/javascript/properties/#customlayerinterface for more info
    var pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd: function() {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      // called once before every frame where the icon will be used
      render: function() {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 100, 100, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      },
    };

    // San Francisco
    var origin = [105.864323, 20.981971];

    // Washington DC
    var destination = [105.783206, 21.031011];

    // A simple line from origin to destination.
    var route = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [origin, destination],
          },
        },
      ],
    };

    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    var point = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: origin,
          },
        },
      ],
    };

    // Calculate the distance in kilometers between route start/end point.
    var lineDistance = turf.lineDistance(route.features[0], "kilometers");

    var arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    var steps = 2000;

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i += lineDistance / steps) {
      var segment = turf.along(route.features[0], i, "kilometers");
      arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

    // Used to increment the value of the point measurement against the route.
    var counter = 0;
    map.on("load", function() {
      //Trên đây vẽ tuyến đường ra
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
          origin: "20.981971, 105.864323",
          destination: "21.031011,105.783206",
          vehicle: "car",
        })
        .send()
        .then(function(response) {
          var directions = response.body;
          var route = directions.routes[0];

          let arr_check = route.legs[0].steps.map((item, index) => {
            return [item.start_location.lng, item.start_location.lng];
          });

					//Coi lại đoạn
          // route.features[0].geometry.coordinates = arr_check

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

      //Dưới đây để vẽ máy bay ra
      // Add a source and layer displaying a point which will be animated in a circle.
      // map.addSource("route", {
      //   type: "geojson",
      //   data: route,
      // });

      map.addSource("point", {
        type: "geojson",
        data: point,
      });

      map.addLayer({
        id: "route",
        source: "route",
        type: "line",
        paint: {
          "line-width": 2,
          "line-color": "#007cbf",
        },
      });

      map.addLayer({
        id: "point",
        source: "point",
        type: "symbol",
        layout: {
          "icon-image": "airport-15",
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });

      function animate() {
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.

        point.features[0].geometry.coordinates =
          route.features[0].geometry.coordinates[counter];

        // Calculate the bearing to ensure the icon is rotated to match the route arc
        // The bearing is calculate between the current point and the next point, except
        // at the end of the arc use the previous point and the current point
        point.features[0].properties.bearing = turf.bearing(
          turf.point(
            route.features[0].geometry.coordinates[
              counter >= steps ? counter - 1 : counter
            ]
          ),
          turf.point(
            route.features[0].geometry.coordinates[
              counter >= steps ? counter : counter + 1
            ]
          )
        );

        // Update the source with this new data.
        map.getSource("point").setData(point);

        // Request the next frame of animation so long the end has not been reached.
        if (counter < steps) {
          requestAnimationFrame(animate);
        }

        counter = counter + 1;
      }

      document.getElementById("replay").addEventListener("click", function() {
        // Set the coordinates of the original point back to origin
        point.features[0].geometry.coordinates = origin;

        // Update the source layer
        map.getSource("point").setData(point);

        // Reset the counter
        counter = 0;

        // Restart the animation.
        animate(counter);
      });

      // Start the animation.
      animate(counter);
    });

    // map.on("load", function() {
    //   map.addImage("pulsing-dot", pulsingDot, {
    //     pixelRatio: 2,
    //   });

    //   map.addSource("points", {
    //     type: "geojson",
    //     data: {
    //       type: "FeatureCollection",
    //       features: [
    //         {
    //           type: "Feature",
    //           properties: {
    //             message: "Foo",
    //             iconSize: [60, 60],
    //           },
    //           geometry: {
    //             type: "Point",
    //             coordinates: [105.7652286, 10.0165936],
    //           },
    //         },
    //       ],
    //     },
    //   });
    //   map.addLayer({
    //     id: "points",
    //     type: "symbol",
    //     source: "points",
    //     layout: {
    //       "icon-image": "pulsing-dot",
    //     },
    //   });

    //   var popup = new goongjs.Popup({ closeOnClick: false })
    //     .setLngLat([105.7652286, 10.0165936])
    //     .setHTML("<h1>Hello World!</h1>")
    //     .addTo(map);

    //   // Add zoom and rotation controls to the map.
    //   map.addControl(new goongjs.NavigationControl());
    // });
  };

  useEffect(() => {
    get_from_location();
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
      <div class="overlay">
        <button id="replay">Replay</button>
      </div>
    </div>
  );
}

export default ShowMap;
