import React from "react";
import { Modal } from "@mui/material";
import PolygonMap from "../../PolygonMap/PolygonMap";

const PolygonMapModal = ({ open, onClose, polygonPoints, setPolygonPoints }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "16px 20px",
          borderRadius: 4,
        }}
      >
        <div style={{ width: "70vw" }}>
          <div className="flex justify-between mb-4">
            <h1 style={{ fontSize: 16, marginBottom: 10, fontWeight: 600 }}>
              Mark Your Locations and Define a Custom Area
            </h1>
          </div>
          <PolygonMap
            openPolygonMap={open}
            setOpenPolygonMap={onClose}
            polygonPoints={polygonPoints}
            setPolygonPoints={setPolygonPoints}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PolygonMapModal;
