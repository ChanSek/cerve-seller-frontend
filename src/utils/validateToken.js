import Cookies from "js-cookie";
import { deleteAllCookies } from "./cookies";

export function isLoggedIn() {
  const token = Cookies.get("signed");
  if (token) {
    return true;
  }
  deleteAllCookies();
  return false;
}

export function getSellerActive() {
  const status = Cookies.get("sellerActive");
  return status === "true"; // Only check the cookie, no need to call isLoggedIn()
}

export function isSuperAdmin() {
  const status = Cookies.get("isSuperAdmin");
  return status === "true"; // Only check the cookie, no need to call isLoggedIn()
}
