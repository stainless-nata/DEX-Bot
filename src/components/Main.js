import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import '../css/Main.css';
import Swap from './Swap';

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
                    <Tab label="Buy/Swap" value="1" />
                    <Tab label="Trades" value="2" />
                    <Tab label="History" value="3" />
                    <Tab label="Mempool" value="4" />
                </TabList>
                </Box>
                <TabPanel value="1">
                    <Swap/>
                </TabPanel>
                <TabPanel value="2">
                    
                </TabPanel>
                <TabPanel value="3">
                    
                </TabPanel>
                <TabPanel value="4">
                    
                </TabPanel>
            </TabContext>
        </Box>
    </div>
  );
}