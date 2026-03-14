// Shared sx-prop styles for action card components (Complaints module)
// Replaces the former actionCard.module.scss
import { ONDC_COLORS } from "../Components/Shared/Colors";

export const actionCardStyles = {
  overlay: {
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(224, 224, 224, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    animation: "fade 1s ease forwards",
    "@keyframes fade": {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
  popupCard: {
    minWidth: "40%",
    backgroundColor: ONDC_COLORS.CARDCOLOR,
    borderRadius: "10px",
    maxHeight: "95%",
    overflow: "auto",
    opacity: 1,
    animation: "slide 0.5s ease forwards",
    "@keyframes slide": {
      from: { marginBottom: "50px", opacity: 0 },
      to: { marginBottom: 0, opacity: 1 },
    },
  },
  cardHeader: {
    p: "20px 25px",
    backgroundColor: ONDC_COLORS.CARDCOLOR,
    borderBottom: `1px solid ${ONDC_COLORS.SECONDARYCOLOR}26`,
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    alignItems: "center",
  },
  cardHeaderTitle: {
    fontFamily: '"Fira Sans", sans-serif',
    fontSize: "18px",
    fontWeight: 500,
    textAlign: "left",
    color: ONDC_COLORS.PRIMARYCOLOR,
    m: 0,
  },
  cardBody: {
    p: "20px 25px",
    borderBottom: `1px solid ${ONDC_COLORS.SECONDARYCOLOR}26`,
  },
  cardBodyText: {
    fontSize: "14px",
    textAlign: "left",
    color: ONDC_COLORS.SECONDARYCOLOR,
    m: 0,
  },
  cardFooter: {
    p: "20px 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addressNameAndPhone: {
    fontSize: "16px",
    fontWeight: 500,
    textAlign: "left",
    color: ONDC_COLORS.PRIMARYCOLOR,
    m: 0,
  },
};

export const radioButtonStyles = {
  wrapper: {
    border: 0,
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "flex-start",
    flex: 1,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: `${ONDC_COLORS.ACCENTCOLOR}26`,
      transition: "background-color 0.3s",
      borderRadius: "10px",
    },
  },
  boxBasis: {
    flexBasis: "5%",
  },
  nameBasis: {
    flexBasis: "95%",
  },
  background: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: ONDC_COLORS.CARDCOLOR,
    border: `1px solid ${ONDC_COLORS.ACCENTCOLOR}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    m: "2px 0",
  },
  active: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: ONDC_COLORS.ACCENTCOLOR,
    border: 0,
  },
  nonActive: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: ONDC_COLORS.CARDCOLOR,
    border: 0,
  },
  parentRadio: {
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  editButton: {
    fontSize: "12px",
    color: ONDC_COLORS.ACCENTCOLOR,
    textAlign: "left",
    m: 0,
    backgroundColor: "transparent",
    border: 0,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: `${ONDC_COLORS.ACCENTCOLOR}26`,
      transition: "background-color 0.3s",
      borderRadius: "10px",
    },
  },
  parentEditButton: {
    width: "30px",
  },
};
