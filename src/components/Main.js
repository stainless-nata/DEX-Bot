import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import '../css/Main.css';
import SwapTab from './SwapTab';
import MainTab from './MainTab';
import TradesTab from './TradesTab';
import HistoryTab from './HistoryTab';

export default function Main() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="main-container">
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Main" value="1" />
                    <Tab label="Buy/Swap" value="2" />
                    <Tab label="Trades" value="3" />
                    <Tab label="History" value="4" />
                    <Tab label="Mempool" value="5" />
                </TabList>
                </Box>
                <TabPanel value="1">
                    <MainTab />
                </TabPanel>
                <TabPanel value="2">
                    <SwapTab />
                </TabPanel>
                <TabPanel value="3">
                    <TradesTab />
                </TabPanel>
                <TabPanel value="4">
                    <HistoryTab />
                </TabPanel>
                <TabPanel value="5">
                    
                </TabPanel>
            </TabContext>
        </Box>
    </div>
  );
}