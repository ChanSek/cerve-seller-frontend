import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Stack,
  Chip,
  Switch,
  InputAdornment,
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import dayjs from "dayjs";
import axios from "axios";
import cogoToast from "cogo-toast";
import Cookies from "js-cookie";
import PlacePickerMap from "../Components/PlacePickerMap/PlacePickerMap";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import DaysPicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

const CssTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black",
    },
    "&:hover fieldset": {
      borderColor: "#1c75bc",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1c75bc",
    },
  },
});

const RenderInput = (props) => {
  const { item, state, stateHandler, onChange, previewOnly, setFocusedField, handleChange = undefined, args } = props;
  const uploadFileRef = useRef(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [fetchedImageSize, setFetchedImageSize] = useState(0);

  const handleFocus = (fieldId) => {
    if (setFocusedField) {
      setFocusedField(fieldId);
    }
  };

  const handleBlur = () => {
    if (setFocusedField) {
      setFocusedField(null);
    }
  };

  const getSizeWithUnit = (size) => {
    if (size >= 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    } else if (size >= 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return size + " bytes";
    }
  };

  const getImageSizeFromUrl = async () => {
    try {
      const response = await fetch(state[item.id]);
      const blob = await response.blob();
      const sizeInBytes = blob.size;
      const sizeInKilobytes = sizeInBytes / 1024;
      setFetchedImageSize(sizeInKilobytes.toFixed(2) + " KB");
    } catch (error) {
      setFetchedImageSize("2 MB");
    }
  };

  const formatDecimal = (value) => {
    if (value === undefined || value === '' || value === null) return '';
    const cleanValue = value.toString().replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = cleanValue.split('.');
    const formattedIntegerPart = integerPart.slice(0, 10);
    const formattedDecimalPart = decimalPart ? decimalPart.slice(0, 2) : '';
    const result = formattedDecimalPart ? `${formattedIntegerPart}.${formattedDecimalPart}` : formattedIntegerPart;
    const numValue = parseFloat(result);
    if (isNaN(numValue)) return '';
    return numValue;
  };

  const formatDate = (value) => {
    if (value === undefined) return value;
    if (value.length == 2) return value + "/";
    if (value.length == 5) return value + "/";
    return value;
  };

  const formatMonthYear = (value) => {
    if (value === undefined) return value;
    if (value.length == 2) return value + "/";
    return value;
  };

  useEffect(() => {
    if (item.type !== "upload") return;
    if (isImageChanged === false && state[item.id] !== "") {
      getImageSizeFromUrl();
    } else {
      const sizeInBytes = getSizeWithUnit(uploadFileRef.current?.files[0]?.size);
      setFetchedImageSize(sizeInBytes);
    }
  }, [isImageChanged, state[item.id]]);

  if (item.type === "input") {
    return (
      <div className={props.containerClasses !== undefined ? `${props.containerClasses}` : "py-1 flex flex-col"}>
        <label
          className={
            props.labelClasses
              ? props.labelClasses
              : "text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          }
        >
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <CssTextField
          variant={item.variant ? item.variant : "standard"}
          type={item.password ? "password" : "input"}
          className={
            props.inputClasses
              ? props.inputClasses
              : "w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
          }
          sx={props.inputStyles && props.inputStyles}
          required={item.required}
          size="small"
          multiline={item.multiline || false}
          maxRows={item.multiline ? 5 : 1}
          autoComplete="off"
          placeholder={item.placeholder}
          error={item.error || false}
          disabled={item?.isDisabled || props.isDisabled || previewOnly || false}
          helperText={item.error && item.helperText}
          value={state[item.id]}
          onChange={(e) => {
            if (handleChange) {
              handleChange(e, item, item.args);
            } else {
              stateHandler({
                ...state,
                [item.id]: item.isUperCase ? e.target.value.toUpperCase() : e.target.value,
              });
            }
          }}
          inputProps={{
            maxLength: item.maxLength || undefined,
            minLength: item.minLength || undefined,
          }}
          InputProps={{
            startAdornment: item.prefix ? (
              <InputAdornment position="start">
                {item.prefix}
              </InputAdornment>
            ) : null,
          }}
          onFocus={() => handleFocus(item.id)}
          onBlur={handleBlur}
        />
      </div>
    );
  } else if (item.type === "number") {
    return (
      <div className={props.containerClasses ? props.containerClasses : "py-1 flex flex-col"}>
        <label
          className={
            props.labelClasses
              ? props.labelClasses
              : "text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          }
        >
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <CssTextField
          variant={item.variant ? item.variant : "standard"}
          type="number"
          className={
            props.inputClasses
              ? props.inputClasses
              : "w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
          }
          sx={props.inputStyles && props.inputStyles}
          required={item.required}
          size="small"
          InputProps={{
            //inputProps: { min: item.min || 0, max: item.max || 100000 },
            startAdornment: item.prefix ? (
              <InputAdornment position="start">
                {item.prefix}
              </InputAdornment>
            ) : null,
            // inputProps: {
            //   step: "0.01"  // Allows up to 2 decimal places
            // }
          }}
          placeholder={item.placeholder}
          error={item.error || false}
          disabled={item?.isDisabled || props.isDisabled || previewOnly || false}
          helperText={item.error && item.helperText}
          value={item.valueInDecimal ? formatDecimal(state[item.id]) : state[item.id]}
          onChange={(e) => {
            let value = e.target.value;
          
            // Check if field is decimal
            if (item.valueInDecimal) {
              value = formatDecimal(value);
            } else {
              value = value.replace(".","");
            }
          
            // Enforce maximum length
            const maxLength = item.maxLength || undefined;
            if (maxLength && value.length > maxLength) {
              return;
            }
          
            // Set the state
            stateHandler({
              ...state,
              [item.id]: value,
            });
          }}
          
          inputProps={{
            step: "1",
          }}
          onFocus={() => handleFocus(item.id)}
          onBlur={handleBlur}
        />
      </div>
    );
  } else if (item.type === "radio") {
    let isDisabled = false;
    if (item.id === "isVegetarian" && state["productCategory"] && state["productCategory"] !== "f_and_b") {
      isDisabled = true;
    } else {
    }
    isDisabled = props.isDisabled || isDisabled;
    return (
      <div>
        <FormControl>
          <div className={props.containerClasses !== undefined ? `${props.containerClasses}` : "py-1 flex flex-col"}>
            <label
              className={
                props.labelClasses
                  ? props.labelClasses
                  : "text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
              }
            >
              {item.title}
              {item.required && <span className="text-[#FF0000]"> *</span>}
            </label>
            <RadioGroup
              className={
                props.inputClasses
                  ? props.inputClasses
                  : "w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
              }
              aria-label={item.id}
              name={item.id}
              value={state[item.id]}
              onChange={(e) => {
                stateHandler({ ...state, [item.id]: e.target.value });
              }}
              disabled={isDisabled}
            >
              <div
              // className="flex flex-row"
              >
                {item.options.map((radioItem, i) => (
                  <FormControlLabel
                    disabled={item?.isDisabled || isDisabled || previewOnly || false}
                    key={i}
                    value={radioItem.value}
                    control={<Radio size="small" checked={radioItem.value === state[item.id]} />}
                    label={<div className="text-sm font-medium text-[#606161]">{radioItem.key}</div>}
                  />
                ))}
              </div>
            </RadioGroup>
          </div>
        </FormControl>
      </div>
    );
  } else if (item.type === "checkbox") {
    //  console.log("state[item.id]=====>", state[item.id]);
    //  console.log("item.options=====>", item.options);
    const onChange = (e) => {
      const val = e.target.name;
      const itemIndex = state[item.id].indexOf(val);
      if (itemIndex === -1) {
        stateHandler((prevState) => {
          const newState = {
            ...prevState,
            [item.id]: [...prevState[item.id], val],
          };
          return newState;
        });
      } else {
        stateHandler((prevState) => {
          const newState = {
            ...prevState,
            [item.id]: prevState[item.id].filter((ele) => ele !== val),
          };
          return newState;
        });
      }
    };
    return (
      <div className="py-1 flex flex-col">
        <label className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block">
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <FormGroup row>
          {item.options.map((checkboxItem) => (
            <FormControlLabel
              control={
                <Checkbox
                  disabled={item?.isDisabled || previewOnly || false}
                  key={checkboxItem.key}
                  onChange={onChange}
                  name={checkboxItem.value}
                  size="small"
                  checked={state[item.id] && state[item.id].find((day) => day === checkboxItem.value) ? true : false}
                />
              }
              label={
                <div className="text-sm font-medium text-[#606161]" key={checkboxItem.key}>
                  {checkboxItem.key}
                </div>
              }
            />
          ))}
        </FormGroup>
      </div>
    );
  } else if (item.type === "select") {
    //  console.log("state[item.id]=====>", item.id, "=====>", state[item.id]);

    return (
      <div className={props.containerClasses !== undefined ? `${props.containerClasses}` : "py-1 flex flex-col"}>
        <label
          className={
            props.labelClasses !== undefined
              ? `${props.labelClasses}`
              : "text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          }
        >
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <FormControl error={item.error || false}>
          <Autocomplete
            sx={props.inputStyles && props.inputStyles}
            disableClearable={item.disableClearable !== undefined ? item.disableClearable : false}
            disabled={item?.isDisabled || previewOnly || false}
            // filterSelectedOptions
            size="small"
            options={item?.options}
            getOptionLabel={(option) => option?.key}
            value={
              state[item.id] !== "" && item.options && item.options.length > 0
                ? item.options.find((option) => option.value === state[item.id])
                : null
            }
            onChange={(event, newValue) => {
              stateHandler((prevState) => {
                if (item.id === "productCategory") {
                  const newState = {
                    ...prevState,
                    [item.id]: newValue.value || "",
                    //   productSubcategory1: "",
                  };
                  return newState;
                } else {
                  const newState = {
                    ...prevState,
                    [item.id]: newValue?.value || "",
                  };
                  return newState;
                }
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={!previewOnly && !state[item.id] ? item.placeholder : ""}
                variant={item.variant ? item.variant : "standard"}
                error={item.error || false}
                helperText={item.error && item.helperText}
              />
            )}
          />
        </FormControl>
      </div>
    );
  } else if (item.type === "location-picker") {
    return (
      <div className="py-1 flex flex-col">
        <label className="text-sm py-2 ml-0 mb-1 font-medium text-left text-[#606161] inline-block">
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <div style={{ width: "100%", height: "400px" }}>
          <PlacePickerMap
            location={state[item.id] ? { lat: state[item.id].lat, lng: state[item.id].long } : {}}
            setLocation={(location) => {
              const {
                district,
                city,
                state: stateVal,
                area: country,
                pincode: area_code,
                locality,
                lat,
                lng,
              } = location;
              stateHandler({
                ...state,
                [item.id]: {
                  lat: lat,
                  long: lng,
                },
                city: city !== "" ? city : district,
                state: stateVal,
                country,
                area_code,
                locality,
              });
            }}
          />
        </div>
      </div>
    );
  } else if (item.type === "date-picker") {
    function reverseString(str) {
      // empty string
      let newString = "";
      for (let i = str.length - 1; i >= 0; i--) {
        newString += str[i];
      }
      return newString;
    }
    const dateValue = moment(state[item.id], item.format || "DD/MM/YYYY").format(
      item.format ? reverseString(item.format) : "YYYY/MM/DD"
    );
    return (
      <div className="py-1 flex flex-col">
        <label className="text-sm py-2 ml-0 mb-1 font-medium text-left text-[#606161] inline-block">
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disableFuture
            format={item.format || "DD/MM/YYYY"}
            views={item.views || ["year", "month", "day"]}
            onChange={(newValue) => {
              const date = moment(new Date(newValue))
                .format(item.format || "DD/MM/YYYY")
                .toString();
              stateHandler((prevState) => {
                const newState = {
                  ...prevState,
                  [item.id]: date,
                };
                return newState;
              });
            }}
            value={state[item.id] ? dayjs(dateValue) : ""}
            slots={{
              TextField: (params) => (
                <TextField
                  {...params}
                  variant="standard"
                  error={item.error || false}
                  helperText={item.error && item.helperText}
                />
              ),
            }}
          />
        </LocalizationProvider>
      </div>
    );
  } else if (item.type === "time-picker") {
    function reverseString(str) {
      // empty string
      let newString = "";
      for (let i = str.length - 1; i >= 0; i--) {
        newString += str[i];
      }
      return newString;
    }
    const dateValue = moment(state[item.id], item.format || "hh:mm A");
    //  console.log("item.format======>", item.format);
    //  console.log("dateValue=====>", dateValue);
    return (
      <div className="py-1 flex flex-col" style={{ position: "relative" }}>
        {item.title && (
          <label className="text-sm py-2 ml-0 mb-1 font-medium text-left text-[#606161] inline-block">
            {item.title}
            {item.required && <span className="text-[#FF0000]"> *</span>}
          </label>
        )}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            closeOnSelect={false}
            ampm={item.ampm !== undefined ? item.ampm : true}
            format={item.format || "hh:mm A"}
            onChange={(newValue) => {
              if (stateHandler) {
                const date = moment(new Date(newValue))
                  .format(item.format || "hh:mm A")
                  .toString();
                stateHandler((prevState) => {
                  const newState = {
                    ...prevState,
                    [item.id]: date,
                  };
                  return newState;
                });
              } else {
                const date = moment(new Date(newValue))
                  .format(item.format || "hh:mm A")
                  .toString();
                onChange(date);
              }
            }}
            value={state[item.id] ? dayjs(dateValue) : ""}
            slots={{
              TextField: (params) => (
                <TextField
                  {...params}
                  variant="standard"
                  error={item.error || false}
                  helperText={item.error && item.helperText}
                />
              ),
            }}
          />
        </LocalizationProvider>
      </div>
    );
  } else if (item.type === "days-picker") {
    function reverseString(str) {
      // empty string
      let newString = "";
      for (let i = str.length - 1; i >= 0; i--) {
        newString += str[i];
      }
      return newString;
    }
    let values = state[item.id];
    // if(values && values.length > 0){
    //   values = values.map((itemDate) => moment(itemDate, item.format || 'DD/MM/YYYY').format(item.format?reverseString(item.format):'YYYY/MM/DD'));
    // }else{}

    return (
      <div className="py-1 flex flex-col">
        <label className="text-sm py-2 ml-0 mb-1 font-medium text-left text-[#606161] inline-block">
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <DaysPicker
          value={values || []}
          multiple
          format={item.format || "DD/MM/YYYY"}
          plugins={[<DatePanel />]}
          onChange={(newValue) => {
            stateHandler((prevState) => {
              const newState = {
                ...prevState,
                [item.id]: newValue.map((itemDate) => {
                  const date = moment(new Date(itemDate))
                    .format(item.format || "DD/MM/YYYY")
                    .toString();
                  return date;
                }),
              };
              return newState;
            });
          }}
          render={(value, openCalendar) => {
            const valuesArray = value ? value.split(",") : "";
            return (
              <Autocomplete
                size="small"
                multiple
                id="tags-readOnly"
                options={[]}
                readOnly
                getOptionLabel={(option) => option}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip label={option} {...getTagProps({ index })} onClick={() => { }} />)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    //   placeholder={!previewOnly && !state[item.id] ? item.placeholder : ""}
                    placeholder={
                      (!previewOnly && !state[item.id]) ||
                        (typeof state[item.id] === "string" && state[item.id].trim() === "") ||
                        (Array.isArray(state[item.id]) && state[item.id].length === 0)
                        ? item.placeholder
                        : ""
                    }
                    onFocus={openCalendar}
                  />
                )}
                value={valuesArray || []}
              />
            );
          }}
        />
      </div>
    );
  } else if (item.type === "custom-date-picker") {
    return (
      <div className={props.containerClasses !== undefined ? `${props.containerClasses}` : "py-1 flex flex-col"}>
        <label
          className={
            props.labelClasses
              ? props.labelClasses
              : "text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          }
        >
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <CssTextField
          variant={item.variant ? item.variant : "standard"}
          type="input"
          className={
            props.inputClasses
              ? props.inputClasses
              : "w-full h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
          }
          sx={props.inputStyles && props.inputStyles}
          required={item.required}
          size="small"
          multiline={item.multiline || false}
          maxRows={item.multiline ? 5 : 1}
          autoComplete="off"
          placeholder={item.placeholder}
          error={item.error || false}
          disabled={item?.isDisabled || props.isDisabled || previewOnly || false}
          helperText={item.error && item.helperText}
          value={state[item.id]}
          onChange={(e) => {
            let value = e.target.value;
            // Enforce maximum length
            const maxLength = item.maxLength || undefined;
            if (maxLength && value.length > maxLength) {
              return;
            }
            const formattedValue = item.formatDate ? formatDate(value) : item.formatMonthYear ? formatMonthYear(value) : value;
            stateHandler({
              ...state,
              [item.id]: formattedValue,
            });
          }}
          onFocus={() => handleFocus(item.id)}
          onBlur={handleBlur}
        />
      </div>
    );
  } else if (item.type === "multi-select") {
    return (
      <div className="py-1 flex flex-col">
        {item.title && (
          <label className="text-sm py-2 ml-0 mb-1 font-medium text-left text-[#606161] inline-block">
            {item.title}
            {item.required && <span className="text-[#FF0000]"> *</span>}
          </label>
        )}
        <FormControl>
          <Autocomplete
            disabled={item?.isDisabled || previewOnly || false}
            multiple
            // filterSelectedOptions
            size="small"
            options={item.options}
            getOptionLabel={(option) => option.key}
            value={state[item.id]}
            onChange={(event, newValue) => {
              stateHandler((prevState) => {
                const newState = {
                  ...prevState,
                  [item.id]: newValue,
                };
                return newState;
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={state[item.id].length === 0 ? item.placeholder : ""}
                variant={item.variant ? item.variant : "standard"}
                error={item.error || false}
                helperText={item.error && item.helperText}
              />
            )}
          />
        </FormControl>
      </div>
    );
  } else if (item.type === "upload") {
    const allowedMaxSize = 2 * 1024 * 1024; // 2 MB in Bytes
    // const getSignUrl = async (file) => {
    //   const url = `/api/v1/seller/upload/${item?.file_type}`;
    //   const file_type = file.type.split("/")[1];
    //   const data = {
    //     fileName: file.name.replace(`\.${file_type}`, ""),
    //     fileType: file_type,
    //   };
    //   const res = await postMediaCall(url, data);
    //   return res;
    // };

    const renderUploadedUrls = () => {
      const getImageElement = (url) => (
        <div className="image-preview-container">
          <img src={url} height={50} width={50} style={{ margin: "10px" }} alt="" />
          <img src={url} className="image-preview-large" alt="zoom" />
        </div>
      );
      if (item?.multiple) {
        if (state?.imageUrls) {
          return state.imageUrls.map((url) => getImageElement(url));
        }
      } else {
        if ((!isImageChanged && state?.tempURL?.[item.id]) || state[item.id]) {
          return getImageElement(state?.tempURL?.[item.id] || state[item.id]);
        } else {
          return <></>;
        }
      }
    };

    if (previewOnly) {
      if (typeof state[item.id] == "string") {
        return (
          <div style={{ height: 100, width: 100, marginBottom: 40, marginTop: 10 }}>
            <label
              className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
              style={{ width: 200 }}
            >
              {item?.title}
            </label>
            <img className="ml-0 h-full w-full" src={state[item?.id]} alt="" />
          </div>
        );
      } else {
        return (
          <div style={{ height: 100, width: 100, marginBottom: 40, marginTop: 10 }} className="flex">
            <label className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block">{item.title}</label>
            {state[item.id]?.map((img_url) => (
              <img className="ml-0 h-full w-full" key={img_url} src={img_url} alt="" />
            ))}
          </div>
        );
      }
    }

    const UploadedFile = ({ name, size }) => {
      if (!name) return;

      const getImageName = (path) => {
        const splitPath = path.split("/");
        const fileTypeIndex = splitPath.indexOf(item.file_type);

        if (fileTypeIndex !== -1 && fileTypeIndex + 1 < splitPath.length) {
          const nameUrl = splitPath[fileTypeIndex + 1];
          return nameUrl;
        } else {
          return item.file_type;
        }
      };
      const getImageType = (path) => {
        const splitPath = path.split("/");
        const fileType = splitPath[splitPath.length - 1].split(".").pop();
        return fileType;
      };

      return (
        <Stack direction="row" spacing={1} alignItems={"center"} style={{ marginBottom: 20 }}>
          <IconButton
            style={{ width: 35, height: 35 }}
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              // reset file input
              uploadFileRef.current.value = null;
              stateHandler((prevState) => {
                const newState = {
                  ...prevState,
                  [item.id]: Array.isArray(prevState[item.id]) ? prevState[item.id].filter((ele) => ele !== name) : "",
                  uploaded_urls: [],
                };
                return newState;
              });
            }}
          >
            <DeleteOutlined fontSize="small" />
          </IconButton>
          <div>
            <div className="flex items-center">
              <p className="text-xs text-neutral-900 max-w-sm">File name: &nbsp;</p>
              <p className="text-xs text-neutral-600 max-w-sm">{getImageName(name)}</p>
            </div>
            <div className="flex items-center">
              <p className="text-xs text-neutral-900 max-w-sm">File type: &nbsp;</p>
              <p className="text-xs text-neutral-600 max-w-sm">{getImageType(name)}</p>
            </div>
            {!item.multiple && (
              <div className="flex items-center">
                <p className="text-xs text-neutral-900 max-w-sm">File size: &nbsp;</p>
                <p className="text-xs text-neutral-600 max-w-sm">{fetchedImageSize}</p>
              </div>
            )}
          </div>
        </Stack>
      );
    };
    return (
      <div className="py-1 flex flex-col">
        <label
          for="contained-button-file"
          className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
        >
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        {/* <Button sx={{ textTransform: 'none' }} variant="contained">
          <label for="contained-button-file">
            Choose file
          </label>
        </Button> */}
        <div style={{ display: "flex" }}>{renderUploadedUrls()}</div>

        <FormControl error={item.error}>
          {/* <label htmlFor="contained-button-file"> */}
          <input
            ref={uploadFileRef}
            id="contained-button-file"
            name="contained-button-file"
            style={{
              opacity: "none",
              color: item.fontColor ? item.fontColor : "#f0f0f0",
              marginBottom: 10,
            }}
            accept="image/*"
            type="file"
            multiple={item?.multiple || false}
            key={item?.id}
            onChange={(e) => {
              const token = Cookies.get("token");
              for (const file of e.target.files) {
                if (!file.type.startsWith("image/")) {
                  cogoToast.warn("Only image files are allowed");
                  // reset file input
                  uploadFileRef.current.value = null;
                  return;
                }
                if (file.size > allowedMaxSize) {
                  cogoToast.warn("File size should be less than 2 MB");
                  // reset file input
                  uploadFileRef.current.value = null;
                  return;
                }
                const formData = new FormData();
                formData.append("file", file);
                //getSignUrl(file).then((d) => {
                const url = `/api/v1/seller/upload/${item?.file_type}`;
                axios(url, {
                  method: "POST",
                  data: formData,
                  headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                  },
                })
                  .then((response) => {
                    setIsImageChanged(true);
                    if (item.multiple) {
                      stateHandler((prevState) => {
                        const newState = {
                          ...prevState,
                          [item.id]: [...prevState[item.id], response.data.urls],
                          uploaded_urls: [],
                        };
                        return newState;
                      });
                    } else {
                      let reader = new FileReader();
                      let tempUrl = "";
                      reader.onload = function (e) {
                        tempUrl = e.target.result;
                        stateHandler({
                          ...state,
                          [item.id]: (response.data?.endPoint ? response.data.endPoint : response.data.urls),
                          tempURL: {
                            ...state.tempURL,
                            [item.id]: tempUrl,
                          },
                        });
                      };

                      reader.readAsDataURL(file);
                    }
                  })
                  .then((json) => { });
                //});
              }
            }}
          />

          {item.multiple ? (
            state[item.id]?.map((name) => {
              return <UploadedFile name={name} />;
            })
          ) : (
            <UploadedFile name={state[item.id]} />
          )}
          {item.error && <FormHelperText>{item.helperText}</FormHelperText>}
          {/* </label> */}
        </FormControl>
      </div>
    );
  } else if (item.type === "switch") {
    return (
      <div className={item.containerClasses ? item.containerClasses : props.containerClasses || "py-1 flex flex-col"}>
        <label
          className={
            props.labelClasses
              ? props.labelClasses
              : "text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
          }
        >
          {item.title}
          {item.required && <span className="text-[#FF0000]"> *</span>}
        </label>
        <FormControlLabel
          control={
            <Switch
              sx={item.styles && item.styles}
              checked={state[item.id]}
              onChange={(e) => stateHandler({ ...state, [item.id]: e.target.checked })}
              disabled={item?.isDisabled || previewOnly || false}
              color="primary"
              size="medium"
            />
          }
          label={item.switchLabel || ""}
        />
      </div>
    );
  } else if (item.type === "custom-component") {
    return <>{item.component}</>;
  } else if (item.type === "label") {
    return <p className="text-2xl font-semibold mb-4 mt-14">{item.title}</p>;
  }
};

export default RenderInput;
