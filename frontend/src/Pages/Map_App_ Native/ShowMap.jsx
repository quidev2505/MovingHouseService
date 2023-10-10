import * as React from "react";
import { useState } from "react";
import MapGL, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "@goongmaps/goong-map-react";

const geolocateStyle = {
  top: 0,
  left: 0,
  padding: "10px",
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: "10px",
};

const navStyle = {
  top: 72,
  left: 0,
  padding: "10px",
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: "10px",
};

function ShowMap() {
  const [viewport, setViewport] = useState({
    width: 700,
    height: 700,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  return (
    <MapGL
      goongApiAccessToken="e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu"
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      <GeolocateControl style={geolocateStyle} />
      <FullscreenControl style={fullscreenControlStyle} />
      <NavigationControl style={navStyle} />
      <ScaleControl style={scaleControlStyle} />
    </MapGL>
  );
}

export default ShowMap;
