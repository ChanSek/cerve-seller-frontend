import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/validateToken";
import { AuthProvider } from "./AuthProvider"
import AppInitLayout from '../Components/AppLayout/AppInitLayout'

export default function PrivateInitRoute({ children }) {
  const authenticated = isLoggedIn();
  return authenticated ? (
    <AuthProvider>
      <AppInitLayout>
        {children}
      </AppInitLayout>
    </AuthProvider>
  ) : (
    <Navigate to="/login" />
  )
}
