import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

const CssTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    color: theme.palette.text.primary,
    "& fieldset": {
      borderColor: theme.palette.text.secondary,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInput-root": {
    color: theme.palette.text.primary,
    "&:before": {
      borderBottomColor: theme.palette.text.secondary,
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: theme.palette.primary.main,
    },
    "&:after": {
      borderBottomColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  "& .MuiInput-input::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
  },
}));

export default CssTextField;
