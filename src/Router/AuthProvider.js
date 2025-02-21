import { createContext, useContext, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCall, postCall } from "./../Api/axios.js";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const getUser = async (id) => {
    const url = `/api/v1/seller/subscriberId/${id}/subscriber`;
    const res = await getCall(url);
    return res[0];
  };

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    getUser(user_id).then((u) => {
      // roles - Organization Admin, Super Admin
      setUser(u);
      if (u?.isSystemGeneratedPassword) navigate("/initial-steps");
      else {
        if (u?.role?.name === "Organization Admin") {
          if (u?.organization) {
            var isActive = u?.organization?.active;
            if (isActive) {
              //let category = org?.providerDetail?.storeDetails?.category;
              if (!u?.organization?.storeDetailsAvailable) navigate(`/application/store-details/${u.organization._id}`);
            }
          }
        }
      }
    });
  }, [])

  // call this function when you want to authenticate the user

  const value = useMemo(
    () => ({
      user,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
