import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Navbar from '../Shared/Navbar'
import Sidebar from '../Shared/Sidebar'
import { getValueFromCookie } from '../../utils/cookies'
import SessionExpired from '../SessionExpired/SessionExpired';
import { postCall } from "../../Api/axios";


let refreshIntervalId = null;
let initTokenRefreshed = false;

const refreshAccessToken = async (url) => {
    try {
        await postCall(url, {});
    } catch (error) {
        console.error("Error refreshing token:", error);
    }
};

const startTokenRefreshInterval = (url) => {
    if (refreshIntervalId) {
        return; 
    }
    refreshIntervalId = setInterval(() => {
        refreshAccessToken(url);
        if(!getValueFromCookie('signed')){
            stopTokenRefreshInterval();
        }
    }, 15 * 60 * 1000);
};

const stopTokenRefreshInterval = () => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      initTokenRefreshed = false;
      refreshIntervalId = null;
    }
  };

const AppLayout = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isSessionExpired, setIsSessionExpired] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            const token = getValueFromCookie('signed');
            if (!token) setIsSessionExpired(true);
            if (!initTokenRefreshed && !isSessionExpired) {
                startTokenRefreshInterval("/api/v1/auth/refresh");
                initTokenRefreshed = true;
            }
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    return (
        <Box>
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <main style={{ height: '100%' }}>
                {props.children}
            </main>
            {isSessionExpired && <SessionExpired />}
        </Box>
    ) 
}

export default AppLayout
