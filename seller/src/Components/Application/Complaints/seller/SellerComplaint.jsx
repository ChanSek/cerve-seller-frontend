import React, { useState } from "react";
import {
    Card,
    CardContent,Button
} from "@mui/material";
import RenderInput from "../../../../utils/RenderInput";

const SellerComplaint = () => {
        const [formData, setFormData] = useState({
          id: "",
          status: "OPEN",
          level: "ISSUE",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          expected_response_time: "",
          expected_resolution_time: "",
          refs: [{ ref_id: "", ref_type: "" }],
          actors: [{
            id: "",
            type: "",
            info: {
              org: { name: "" },
              person: { name: "" },
              contact: { phone: "", email: "" },
            },
          }],
          descriptor: {
            code: "",
            short_desc: "",
            long_desc: "",
            additional_desc: { url: "", content_type: "" },
          },
          actions: [],
        });
      
        const handleInputChange = (value, field, index, subField) => {
          if (index !== undefined && subField) {
            const updatedArray = [...formData[field]];
            updatedArray[index][subField] = value;
            setFormData({ ...formData, [field]: updatedArray });
          } else {
            setFormData({ ...formData, [field]: value });
          }
        };
      
        const handleAddRef = () => {
          setFormData({ ...formData, refs: [...formData.refs, { ref_id: "", ref_type: "" }] });
        };
      
        const handleAddActor = () => {
          setFormData({
            ...formData,
            actors: [
              ...formData.actors,
              {
                id: "",
                type: "",
                info: {
                  org: { name: "" },
                  person: { name: "" },
                  contact: { phone: "", email: "" },
                },
              },
            ],
          });
        };
      
        const handleSubmit = () => {
          //onSubmit(formData);
        };
      
        return (
          <div className="p-4 space-y-6">
            <Card>
              <CardContent className="space-y-4">
              </CardContent>
            </Card>
          </div>
        );
      };

export default SellerComplaint;
