import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn, isSuperAdmin, getSellerActive  } from "../utils/validateToken";
import { AuthProvider } from "../Router/AuthProvider.js"
import AppLayout from '../Components/AppLayout/AppLayout'
import { StoreProvider } from "./StoreContext.jsx";

export default function PrivateRoute({ children }) {
  const authenticated = isLoggedIn();
  const sellerActive = getSellerActive();
  const superAdmin = isSuperAdmin();
  return authenticated ? (
    <AuthProvider>
      {sellerActive || superAdmin ? <StoreProvider><AppLayout>{children}</AppLayout></StoreProvider> : <>{children}</>}
    </AuthProvider>
  ) : (
    <Navigate to="/login" />
  );
}
