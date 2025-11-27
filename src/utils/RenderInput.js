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
  InputAdornment, Tooltip, Typography, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { DeleteOutlined, PictureAsPdf } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import dayjs from "dayjs";
import { postMediaCall } from "../Api/axios";
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
  const [openPreview, setOpenPreview] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState("");
  
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
              value = value.replace(".", "");
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

            // ✅ Highlight options in actual color
            renderOption={(props, option) => (
              <li {...props}>
                {item.id.toLowerCase().includes("color") || item.id.toLowerCase().includes("colour") ? (
                  <span style={{ color: option.value, fontWeight: "bold", textTransform: "capitalize" }}>
                    {option.key}
                  </span>
                ) : (
                  option.key
                )}
              </li>
            )}

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
          minDate={item.disablePast ? moment().startOf("day").toDate() : undefined}
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
  const allowedMaxSize = 2 * 1024 * 1024; // 2 MB

  const handleOpenPreview = (url) => {
    setPreviewUrl(url);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewUrl("");
  };

  // 🖼️ Render uploaded images (like fileUpload)
  const renderUploadedUrls = () => {
    const getImageElement = (url) => {
      console.log("url : ",url);
      if (!url) return null;

      const getImageName = (path) => {
        return "";
        // if (!path) return "";
        // try {
        //   const cleanedPath = path.split("?")[0]; // remove signed query params
        //   const splitPath = cleanedPath.split("/");
        //   const fileTypeIndex = splitPath.indexOf(item.file_type);
        //   if (fileTypeIndex !== -1 && fileTypeIndex + 1 < splitPath.length) {
        //     return splitPath[fileTypeIndex + 1];
        //   }
        //   return splitPath[splitPath.length - 1];
        // } catch {
        //   return "";
        // }
      };

      const imageName = getImageName(url);

      return (
        <Stack
          key={url}
          direction="row"
          spacing={1}
          alignItems={"center"}
          style={{ marginBottom: 20 }}
        >
          {/* Delete Button */}
          <IconButton
            style={{ width: 35, height: 35 }}
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              uploadFileRef.current.value = null;
              stateHandler((prevState) => {
                const newState = {
                  ...prevState,
                  [item.id]: Array.isArray(prevState[item.id])
                    ? prevState[item.id].filter((ele) => ele !== url)
                    : "",
                  uploaded_urls: [],
                };
                return newState;
              });
            }}
          >
            <DeleteOutlined fontSize="small" />
          </IconButton>

          {/* Preview Image with Dialog Click */}
          <Tooltip title="Click to preview image" arrow>
            <img
              src={url}
              alt={imageName}
              height={50}
              width={50}
              style={{
                cursor: "pointer",
                objectFit: "cover",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
              }}
              onClick={() => handleOpenPreview(url)}
            />
          </Tooltip>

          {/* File Name */}
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: "primary.main",
              textDecoration: "underline",
              "&:hover": { color: "#1565c0" },
            }}
            onClick={() => handleOpenPreview(url)}
          >
            {imageName}
          </Typography>
        </Stack>
      );
    };

    if (item?.multiple) {
      const urls = state?.imageUrls || state?.[item.id];
      if (urls?.length) return urls.map((url) => getImageElement(url));
    } else {
      const singleUrl = state?.backImage?.[item.id] || state?.tempURL?.[item.id] || state[item.id];
      if (singleUrl) return getImageElement(singleUrl);
    }
    return null;
  };

  return (
    <div className="py-1 flex flex-col">
      <label
        htmlFor="contained-button-file"
        className="text-sm py-2 ml-0 font-medium text-left text-[#606161] inline-block"
      >
        {item.title}
        {item.required && <span className="text-[#FF0000]"> *</span>}
      </label>

      {/* Uploaded Image List */}
      <div>{renderUploadedUrls()}</div>

      <FormControl error={item.error}>
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
          onChange={async (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            for (const file of files) {
              // ✅ Validate type
              if (!file.type.startsWith("image/")) {
                cogoToast.warn("Only image files are allowed");
                uploadFileRef.current.value = null;
                return;
              }

              // ✅ Validate size
              if (file.size > allowedMaxSize) {
                cogoToast.warn("File size should be less than 2 MB");
                uploadFileRef.current.value = null;
                return;
              }

              const formData = new FormData();
              formData.append("file", file);

              try {
                const url = `/api/v1/seller/upload/${item?.file_type}`;
                const response = await postMediaCall(url, formData);
                const uploadedUrl = response?.endPoint || response?.urls;

                setIsImageChanged(true);

                if (item.multiple) {
                  const updatedValue = [
                    ...(state[item.id] || []),
                    ...(Array.isArray(uploadedUrl)
                      ? uploadedUrl
                      : [uploadedUrl]),
                  ];
                  stateHandler({
                    ...state,
                    [item.id]: updatedValue,
                    uploaded_urls: [],
                  });
                } else {
                  const reader = new FileReader();
                  reader.onload = function (ev) {
                    const tempUrl = ev.target.result;
                    stateHandler({
                      ...state,
                      [item.id]: uploadedUrl,
                      tempURL: {
                        ...state.tempURL,
                        [item.id]: tempUrl,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              } catch (err) {
                console.error("Upload failed:", err);
                const msg =
                  err.response?.data?.message ||
                  err.message ||
                  "Image upload failed";
                cogoToast.error(msg);
              }
            }
          }}
        />

        {item.error && <FormHelperText>{item.helperText}</FormHelperText>}
      </FormControl>

      {/* 🖼️ Image Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          dividers
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            background: "#fff",
          }}
        >
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

else if (item.type === "fileUpload") {
  const allowedMaxSize = 2 * 1024 * 1024; // 2 MB

  // ✅ Allow both images and PDFs
  const getAcceptType = () => "image/*,application/pdf";

  const handleOpenPreview = (url) => {
    setPreviewUrl(url);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewUrl("");
  };

  // ✅ Handles both PDFs and images, with signed URLs
  const UploadedFile = ({ name, url }) => {
    if (!name) return null;

    const getFileName = (path) => {
      if (!path) return "";
      try {
        const cleanPath = path.split("?")[0];
        return cleanPath.split("/").pop();
      } catch (e) {
        console.error("Error extracting filename:", e);
        return "";
      }
    };

    // ✅ Detect file type from URL (before ?)
    const isPdf = (() => {
      if (!url) return false;
      try {
        const cleanUrl = url.split("?")[0].toLowerCase();
        return cleanUrl.endsWith(".pdf");
      } catch {
        return false;
      }
    })();

    return (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          p: 1,
          border: "1px solid #ddd",
          borderRadius: "8px",
          mb: 1,
          background: "#fafafa",
        }}
      >
        {/* ✅ Thumbnail or PDF icon */}
        {isPdf ? (
          <Tooltip title="Click to preview PDF" arrow>
            <PictureAsPdf
              sx={{
                color: "#d32f2f",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.1)" },
                transition: "transform 0.2s ease",
              }}
              onClick={() => handleOpenPreview(url)}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Click to preview Image" arrow>
            <img
              src={url}
              alt={getFileName(name)}
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 4,
                cursor: "pointer",
              }}
              onClick={() => handleOpenPreview(url)}
            />
          </Tooltip>
        )}

        {/* ✅ File name */}
        <Tooltip
          title={isPdf ? "Click to preview PDF" : "Click to preview Image"}
          arrow
        >
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: "primary.main",
              textDecoration: "underline",
              "&:hover": { color: "#1565c0" },
            }}
            onClick={() => handleOpenPreview(url)}
          >
            {getFileName(name)}
          </Typography>
        </Tooltip>

        {/* ✅ Delete */}
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            uploadFileRef.current.value = null;
            stateHandler((prev) => {
              const newVal = Array.isArray(prev[item.id])
                ? prev[item.id].filter((f) => f !== name)
                : "";
              const newPreview = { ...prev.previewUrls };
              delete newPreview[item.id];
              return { ...prev, [item.id]: newVal, previewUrls: newPreview };
            });
          }}
        >
          <DeleteOutlined fontSize="small" />
        </IconButton>
      </Stack>
    );
  };

  return (
    <div className="py-1 flex flex-col">
      <label
        htmlFor="contained-button-file"
        className="text-sm py-2 font-medium text-[#606161]"
      >
        {item.title}
        {item.required && <span className="text-[#FF0000]"> *</span>}
      </label>

      <FormControl error={item.error}>
  <input
    ref={uploadFileRef}
    id="contained-button-file"
    name="contained-button-file"
    accept={getAcceptType()}
    type="file"
    multiple={item?.multiple || false}
    key={item?.id}
    onChange={async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      for (const file of files) {
        // ✅ Type validation (images + PDFs only)
        if (
          !file.type.startsWith("image/") &&
          file.type !== "application/pdf"
        ) {
          cogoToast.warn("Only image or PDF files are allowed");
          uploadFileRef.current.value = null;
          return;
        }

        // ✅ Size check
        if (file.size > allowedMaxSize) {
          cogoToast.warn("File size should be less than 2 MB");
          uploadFileRef.current.value = null;
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const url = `/api/v1/seller/upload/${item?.file_type}`;
          const response = await postMediaCall(url, formData);
          const { endPoint, urls } = response; // urls = signed URL

          // ✅ Update state
          if (item.multiple) {
            stateHandler((prev) => ({
              ...prev,
              [item.id]: [...(prev[item.id] || []), endPoint],
              previewUrls: {
                ...(prev.previewUrls || {}),
                [item.id]: [
                  ...((prev.previewUrls || {})[item.id] || []),
                  urls,
                ],
              },
            }));
          } else {
            stateHandler((prev) => ({
              ...prev,
              [item.id]: endPoint,
              previewUrls: { ...(prev.previewUrls || {}), [item.id]: urls },
            }));
          }

          // ✅ Trigger parent validation (important)
          if (typeof handleChange === "function") {
            handleChange(
              {
                target: { files, value: endPoint },
              },
              item
            );
          }
        } catch (err) {
          console.error("Upload failed:", err);
          cogoToast.error(
            err.response?.data?.message || err.message || "Upload failed"
          );
        }
      }
    }}
  />

  {/* ✅ Uploaded files list */}
  {item.multiple
    ? (state[item.id] || []).map((name, idx) => (
        <UploadedFile
          key={name}
          name={name}
          url={(state?.previewUrls?.[item.id] || [])[idx]}
        />
      ))
    : state[item.id] && (
        <UploadedFile
          name={state[item.id]}
          url={state.previewUrls?.[item.id] || state[item.id]}
        />
      )}

  {item.error && <FormHelperText>{item.helperText}</FormHelperText>}
</FormControl>


      {/* ✅ Unified Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogContent dividers sx={{ height: "80vh" }}>
          {(() => {
            const cleanUrl = previewUrl?.split("?")[0]?.toLowerCase() || "";
            const isPdf = cleanUrl.endsWith(".pdf");
            return isPdf ? (
              <iframe
                src={previewUrl}
                title="PDF Viewer"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}



  else if (item.type === "switch") {
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
