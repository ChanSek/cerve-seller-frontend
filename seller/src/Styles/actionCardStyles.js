// Shared sx-prop styles for action card components (Complaints module)
// Replaces the former actionCard.module.scss

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
    backgroundColor: "#12121a",
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
    backgroundColor: "#12121a",
    borderBottom: "1px solid rgba(0, 210, 255, 0.15)",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    alignItems: "center",
  },
  cardHeaderTitle: {
    fontFamily: '"Fira Sans", sans-serif',
    fontSize: "18px",
    fontWeight: 500,
    textAlign: "left",
    color: "#e0e0e0",
    m: 0,
  },
  cardBody: {
    p: "20px 25px",
    borderBottom: "1px solid rgba(0, 210, 255, 0.15)",
  },
  cardBodyText: {
    fontSize: "14px",
    textAlign: "left",
    color: "#00d2ff",
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
    color: "#e0e0e0",
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
      backgroundColor: "rgba(108, 92, 231, 0.15)",
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
    backgroundColor: "#12121a",
    border: "1px solid #6c5ce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    m: "2px 0",
  },
  active: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#6c5ce7",
    border: 0,
  },
  nonActive: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#12121a",
    border: 0,
  },
  parentRadio: {
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  editButton: {
    fontSize: "12px",
    color: "#6c5ce7",
    textAlign: "left",
    m: 0,
    backgroundColor: "transparent",
    border: 0,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(108, 92, 231, 0.15)",
      transition: "background-color 0.3s",
      borderRadius: "10px",
    },
  },
  parentEditButton: {
    width: "30px",
  },
};
