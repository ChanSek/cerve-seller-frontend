import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./PlacePickerMap.css";
import {getCall} from "../../Api/axios";

function useScript(src, onLoad) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = onLoad;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [src, onLoad]);
}

export default function MapPointer(props) {
  const {
    center = [28.62, 77.09],
    zoom = 15,
    zoomControl = true,
    search = true,
    hybrid = false,
    location,
    setLocation,
  } = props;
  const [apiKey, setApiKey] = useState();
  const [map, setMap] = useState();
  const [mapInitialised, setMapInitialised] = useState(false);
  const [script1Loaded, setScript1Loaded] = useState(false);
  const [script2Loaded, setScript2Loaded] = useState(false);

  const getAccessToken = async () => {
    const url = `/api/v1/seller/mmi/token`;
    const res = await getCall(url);
    return res.data;
  };

  // fetch MMI API token
  useEffect(() => {
    getAccessToken().then((data) => {
      setApiKey(data.access_token);
    });
  }, []);

  const ref = useCallback((node) => {
    if (!mapInitialised && node != null) {
      // eslint-disable-next-line
      const map = new MapmyIndia.Map(node, {
        center,
        zoom,
        zoomControl,
        search,
      });
      setMap(map);
      setMapInitialised(true);
    }
  }, []);

  const onChange = (data) => {
    const { lat, lng } = data;
    if (lat && lng) {
      setLocation(data);
    } else toast.error("Location not found. Please try moving map.");
  };

  useEffect(() => {
    if (!mapInitialised) return;
    const options = {
      map,
      callback: onChange,
      search: true,
      closeBtn: false,
      topText: " ",
    };
    options.location =
      location?.lat && location?.lng
        ? location
        : { lat: 30.679079, lng: 77.06971 };
    // eslint-disable-next-line
    new MapmyIndia.placePicker(options);
  }, [mapInitialised, props]);

  useScript(
    `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/map_load?v=1.3`,
    () => setScript1Loaded(true)
  );
  useScript(
    `https://apis.mapmyindia.com/advancedmaps/api/${apiKey}/map_sdk_plugins`,
    () => setScript2Loaded(true)
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {script1Loaded && script2Loaded && <div id="map" ref={ref} />}
    </div>
  );
}
