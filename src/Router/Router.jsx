import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Order from "../Components/Application/Order/Order";
import Returns from "../Components/Application/Returns/Returns";
import Inventory from "../Components/Application/Inventory/Inventory";
import AddProduct from "../Components/Application/Product/AddProduct";
import PageNotFound from "../Components/PageNotFound/PageNotFound";
import Login from "../Components/Auth/Login/Login";
import PrivateRoute from "./PrivateRoutes";
import OrderDetails from "../Components/Application/Order/OrderDetails";
import UserListings from "../Components/Application/UserListings/UserListings";
import Settlement from "../Components/Application/Settlement/Settlement";
import GatewayActivity from "../Components/Application/GatewayActivity/GatewayActivity.js";
import AdminDetails from "../Components/Application/AdminActivity/AdminDetails.js";
import ProviderInitialSteps from "../Components/Auth/ProviderInitialSteps/ProviderInitialSteps";
import ProviderDetails from "../Components/Application/UserListings/ProviderDetails";
import StoreDetails from "../Components/Application/UserListings/StoreDetails";
import InviteAdmin from "../Components/OnBoarding/InviteAdmin";
import AddProvider from "../Components/OnBoarding/addProvider";
import ForgotPassword from "../Components/Auth/ForgotPassword/ForgotPassword";
import BulkUpload from "../Components/Application/Product/BulkUpload";
import Complaints from "../Components/Application/Complaints/Complaints";
import ComplaintDetails from "../Components/Application/Complaints/ComplaintDetails";
import CustomMenu from "../Components/Application/CustomMenu/CustomMenu";
import MenuCategory from "../Components/Application/CustomMenu/MenuCategory";
import MenuDetails from "../Components/Application/CustomMenu/MenuDetails";
import CustomizationsIndex from "../Components/Application/Customizations/CustomizationsIndex.js";
import CustomizationGroups from "../Components/Application/Customizations/CustomizationGroups.js";
import CustomizationGroupDetails from "../Components/Application/Customizations/CustomizationGroupDetails.js";
import Offer from "../Components/Application/Offer/Offer";
import AddOffer from "../Components/Application/Offer/AddOffer";
import NewSeller from "../Components/OnBoarding/new-seller-account";
import ActivateSeller from "../Components/OnBoarding/activateSeller";
import SellerVerification from "../Components/Application/UserListings/SellerVerification.js";
import ReturnDetails from "../Components/Application/Returns/ReturnDetails.jsx";
import MallGrid from "../Components/Application/VirtualMall/MallGrid.jsx";

export default function OndcRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/sign-up" element={<SignUp />} /> */}
        <Route
          path="/initial-steps"
          element={
            <PrivateRoute>
              <ProviderInitialSteps />
            </PrivateRoute>
          }
        />
        <Route
          path={"/application/inventory"}
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path={"/application/menu-category"}
          element={
            <PrivateRoute>
              <MenuCategory />
            </PrivateRoute>
          }
        />
        <Route
          path={"/application/menu-category/:category"}
          element={
            <PrivateRoute>
              <CustomMenu />
            </PrivateRoute>
          }
        />
        <Route
          path={"/application/menu-category/:category/:menu/:menuId"}
          element={
            <PrivateRoute>
              <MenuDetails />
            </PrivateRoute>
          }
        />
        <Route
          path={"/application/customizations"}
          element={
            <PrivateRoute>
              <CustomizationsIndex />
            </PrivateRoute>
          }
        />
        <Route
          path={"/application/customizations/customization-groups"}
          element={
            <PrivateRoute>
              <CustomizationGroups />
            </PrivateRoute>
          }
        />
        {/* <Route
          path={"/application/customizations/customization-items"}
          element={
            <PrivateRoute>
              <CustomizationItems />
            </PrivateRoute>
          }
        /> */}
        <Route
          path={"/application/customizations/add/customization-group/"}
          element={
            <PrivateRoute>
              <CustomizationGroupDetails />
            </PrivateRoute>
          }
        />
        <Route
          path={"/application/customizations/customization-groups/:group/:groupId"}
          element={
            <PrivateRoute>
              <CustomizationGroupDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/orders"
          element={
            <PrivateRoute>
              <Order />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/application/orders/:id"
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/returns"
          element={
            <PrivateRoute>
              <Returns />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/returns/:id"
          element={
            <PrivateRoute>
              <ReturnDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/add-products"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/bulk-upload"
          element={
            <PrivateRoute>
              <BulkUpload />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/user-listings"
          element={
            <PrivateRoute>
              <UserListings />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/settlement"
          element={
            <PrivateRoute>
              <Settlement />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/gateway-activity"
          element={
            <PrivateRoute>
              <GatewayActivity />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/admin-activity"
          element={
            <PrivateRoute>
              <AdminDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-listings/provider-details/:id"
          element={
            <PrivateRoute>
              <SellerVerification/>
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/user-listings/provider-details/:id"
          element={
            <PrivateRoute>
              <ProviderDetails isFromUserListing={true} />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/invite-admin"
          element={
            <PrivateRoute>
              <InviteAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <NewSeller />
          }
        />
        <Route
          path="/activate"
          element={
            <ActivateSeller />
          }
        />
        <Route
          path="/add-provider-info"
          element={
            <PrivateRoute>
              <AddProvider />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/seller-details/:id"
          element={
            <PrivateRoute>
              <ProviderDetails />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/application/store-details/:id"
          element={
            <PrivateRoute>
              <StoreDetails />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/application/store-details/:id"
          element={
            <PrivateRoute>
              <MallGrid />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/complaints"
          element={
            <PrivateRoute>
              <Complaints />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/application/complaints/:id"
          element={
            <PrivateRoute>
              <ComplaintDetails />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/application/offers"
          element={
            <PrivateRoute>
              <Offer />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/add/offer"
          element={
            <PrivateRoute>
              <AddOffer />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/edit/offer/:id"
          element={
            <PrivateRoute>
              <AddOffer />
            </PrivateRoute>
          }
        />
        <Route path="/page-not-found" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
