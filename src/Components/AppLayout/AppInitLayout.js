import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { getValueFromCookie } from '../../utils/cookies'
import SessionExpired from '../SessionExpired/SessionExpired'

const AppInitLayout = (props) => {
    const [isSessionExpired, setIsSessionExpired] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            const token = getValueFromCookie('token')
            console.log("token "+token);
            if (!token) setIsSessionExpired(true)
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    return (
        <Box>
            <main style={{ height: '100%' }}>
                {props.children}
            </main>
            {isSessionExpired && <SessionExpired />}
        </Box>
    )
}

export default AppInitLayout
