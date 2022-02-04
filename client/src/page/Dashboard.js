// material
import { Box, Grid, Container, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

// components
// import Page from "../components/Page";
// import { AppNewsUpdate, AppTrafficBySite } from "../components/_dashboard/app";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import Intro from "../components/dashboard/Intro";
import DeviceTable from "../components/dashboard/deviceTable/deviceTable";
// ----------------------------------------------------------------------

export default function Dashboard() {
  // const { state: token } = useLocation();
  const token = Cookies.get("jwt");
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [devices, setDevices] = useState([]);

  const fetchUser = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        // jwt: token,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const userData = await axios.get(
        `${process.env.REACT_APP_DEVICE_URL}/users/currentuser`,
        config
      );
      setUser(userData.data.currentUser);

      const fetchDevice = await axios.get(
        `${process.env.REACT_APP_DEVICE_URL}/devices`,
        config
      );
      setDevices(fetchDevice.data);
    } catch (error) {
      console.log("from dash board", error);
    }
  };
  useEffect(() => {
    fetchUser();
    if (!token) {
      navigate("/login");
    }
  }, [devices.length]);
  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ pb: 5, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <Intro devices={devices} user={user} />
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <DeviceTable
                setDevices={setDevices}
                devices={devices}
                user={user}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
