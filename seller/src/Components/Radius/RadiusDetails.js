import { Button } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { getCall } from "../../Api/axios";
import ScriptTag from "react-script-tag";
import RenderInput from "../../utils/RenderInput";

let circleFields = [
    {
        id: "area_location",
        title: "Area Location",
        placeholder: "Area Location",
        type: "location-picker",
        required: true,
    }
]

const RadiusDetails = (props) => {
    const { showRadiusModal, polygonPoints, setPolygonPoints, setShowRadiusModal } = props;
    const [storeCircleFields, setStoreCircleFields] = useState(circleFields);
    const [circleDetails, setCircleDetails] = useState({
        area_location: {}
    });
    const [errors, setErrors] = useState(null);
    const [apiKey, setApiKey] = useState();
    const [map, setMap] = useState(null);
    const [script1Loaded, setScript1Loaded] = useState(false);
    const [editablePolygon, setEditablePolygon] = useState(polygonPoints);
    const [polygon, setPolygon] = useState(null);
    const [toggle, setToggle] = useState(false);

    const getAccessToken = async () => {
        const url = `/api/v1/seller/mmi/token`;
        const res = await getCall(url);
        return res.data;
    };

    useEffect(() => {
        // getAccessToken().then((data) => {
        //     setApiKey(data.access_token);
        // });
        setStoreCircleFields(circleFields);
    }, []);

    const resetPolygon = () => {
        window.mappls.remove({ map: map, layer: polygon });
        //setToggle(!toggle);
        setPolygonPoints([]);
        setEditablePolygon([]);
    };

    return (
        <div>
            <div className="m-auto w-10/12 md:w-3/4 h-max">
            {storeCircleFields.map((item) => (
                <RenderInput
                  // previewOnly={true}
                  // item={item}
                  item={{
                    ...item,
                    error: !!errors?.[item.id],
                    helperText: errors?.[item.id] || "",
                  }}
                  state={circleDetails}
                  stateHandler={setCircleDetails}
                />
              ))}
            </div>
            <div className="flex justify-end mt-4">
                <Button style={{ marginRight: 14 }} variant="outlined" onClick={() => setShowRadiusModal(false)}>
                    Cancel
                </Button>
                <Button color="error" style={{ marginRight: 14 }} size="small" variant="outlined" onClick={resetPolygon}>
                    Reset
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        //if (editablePolygon.length > 0) setPolygonPoints(editablePolygon);
                        setShowRadiusModal(false);
                    }}
                >
                    Done
                </Button>
            </div>
        </div>
    );
};

export default RadiusDetails;
