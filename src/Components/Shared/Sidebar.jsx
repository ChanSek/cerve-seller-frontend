import * as React from "react";
import {
  Box,
  SwipeableDrawer,
  List,
  Divider,
  ListItemButton,
  ListItemText,
  Collapse,
  Stack,
  Typography,
} from "@mui/material";
import logo from "../../Assets/Images/logo.png";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { deleteAllCookies } from "../../utils/cookies";
import { getCall, postCall } from "../../Api/axios";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [drawerState, setDrawerState] = React.useState({ left: false });
  const [category, setCategory] = React.useState("");
  const [menuOpen, setMenuOpen] = React.useState(true);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const toggleDrawer = (anchor, open) => () => {
    setDrawerState({ ...drawerState, [anchor]: open });
    setOpen(false);
  };

  const getUser = async (id) => {
    const res = await getCall(`/api/v1/seller/subscriberId/${id}/subscriber`);
    const userData = res[0];
    setUser(userData);
    if (userData?.organization?._id) setCategory(userData.category);
  };

  React.useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) getUser(user_id);
  }, []);

  React.useEffect(() => {
    setDrawerState({ left: open });
  }, [open]);

  const renderMenuItems = () => {
    const isOrgAdmin = user?.role?.name === "Organization Admin" && user?.organization?._id;
    const isSuperAdmin = user?.role?.name === "Super Admin";

    return (
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton onClick={toggleMenu}>
          <ListItemText primary="Dashboard" />
          {menuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={menuOpen} timeout="auto" unmountOnExit onClick={toggleDrawer("left", false)}>
          <List component="div" disablePadding>
            {isOrgAdmin && (
              <>
                <NavLink to="/application/inventory" className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Inventory" />
                  </ListItemButton>
                </NavLink>

                <NavLink to={`/user-listings/provider-details/${user?.organization?._id}`} className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Seller Details" />
                  </ListItemButton>
                </NavLink>

                <NavLink to={`/application/store-details/${user?.organization?._id}`} className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Store Details" />
                  </ListItemButton>
                </NavLink>

                <NavLink to="/application/returns" className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Returns" />
                  </ListItemButton>
                </NavLink>
              </>
            )}

            <NavLink to="/application/orders" className="no-underline text-black">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Orders" />
              </ListItemButton>
            </NavLink>

            <NavLink to="/application/complaints" className="no-underline text-black">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Complaints" />
              </ListItemButton>
            </NavLink>

            {isSuperAdmin && (
              <>
                <NavLink to="/application/user-listings" className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="User Listings" />
                  </ListItemButton>
                </NavLink>
                <NavLink to="/application/category-taxonomy" className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Category Taxonomy" />
                  </ListItemButton>
                </NavLink>

                <NavLink to="/application/settlement" className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Order Settlement" />
                  </ListItemButton>
                </NavLink>

                <NavLink to="/application/gateway-activity" className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Gateway Activity" />
                  </ListItemButton>
                </NavLink>

                <NavLink to="/application/admin-activity" className="no-underline text-black">
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Admin Activity" />
                  </ListItemButton>
                </NavLink>
              </>
            )}
          </List>
        </Collapse>
      </List>
    );
  };

  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={drawerState.left}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}
      >
        <Box sx={{ width: 250, position: "relative", height: "100%" }}>
          <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
            <img src={logo} alt="logo" style={{ height: "45px", marginRight: 8 }} />
            <Typography variant="h6">CERVE SELLER</Typography>
          </Stack>
          <Divider />
          {renderMenuItems()}
          
        </Box>
      </SwipeableDrawer>
      <Outlet />
    </>
  );
}
