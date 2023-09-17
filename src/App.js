import './App.css';
import Header from './Components/Header';
import DeployProxy from './Components/DeployProxy';
import Prepayment from './Components/Prepayment';
import Navigator from './Components/Navigator';
import Multicall from './Components/Multicall';
import PlaceBid from './Components/Bids/PlaceBid';
import Auctions from './Components/Bids/Auctions';
import Welcome from './Components/Welcome';
import { COLORS } from './data/colors';
import { OevContext } from './OevContext';
import { useState, React, useEffect } from "react";
import { useNetwork, useAccount } from 'wagmi';

import {
  BrowserRouter as Router,
  Routes,
  Route,
 } from "react-router-dom";
import { ChakraProvider, extendTheme, Flex, VStack } from '@chakra-ui/react';
 
const modifiedTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        backgroundColor: props.colorMode === 'dark' ? COLORS.bg : 'white',
      },
    }),
  },
  shadows: {
    whiteShadow: '0px 30px 90px rgba(255, 255, 255, 0.12)',
  },
});

function App() {
const { chain } = useNetwork()
const { address } = useAccount()

const [level, setLevel] = useState(0);
const [wallet, setWallet] = useState(null);
const [contextDataFeed, setContextDataFeed] = useState(null);
const [auction, setAuction] = useState(null);
const [searcher, setSearcher] = useState(null);
const [contextProxyAddress, setContextProxyAddress] = useState(null);
const [multicall, setMulticall] = useState(null);
const [bid, setBid] = useState(null);
const [auctionStatus, setAuctionStatus] = useState(null);

useEffect(() => {
  setMulticall(null)
  setBid(null)
  setAuctionStatus(null)
  setContextDataFeed(null)
  setMulticall(null)
  setContextProxyAddress(null)
}, [chain]);

useEffect(() => {
  setMulticall(null)
  setBid(null)
  setAuctionStatus(null)
  setWallet(null)
  setSearcher(null)
  setContextDataFeed(null)
  setAuction(null)
  setContextProxyAddress(null)
  setBid(null)
}, [address]);

  return (
    <ChakraProvider theme={modifiedTheme}>
      <OevContext.Provider value={{ level, setLevel, wallet, setWallet, searcher, setSearcher, multicall, setMulticall, bid, setBid, contextProxyAddress, setContextProxyAddress, auction, setAuction, contextDataFeed, setContextDataFeed, auctionStatus, setAuctionStatus}}>
        <Router>
        <div class="container" >
        <div class="header"><Header /></div>
        <Flex>
        <div class="sidebar">
        <VStack spacing={10} p={2} boxShadow="lg" height={"100%"} alignItems={"left"} >
          <Navigator/>
          </VStack>
          </div>
        <div class="body">
        <VStack spacing={0} p={2} boxShadow="lg" width={"100%"} height={"100%"} alignItems={"left"} >
          <VStack bgColor={COLORS.app} borderRadius="lg" boxShadow="lg" height={"100%"} alignItems={"left"} >
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="proxy" element={<DeployProxy />} />
              <Route path="searcher" element={<Prepayment />} />
              <Route path="multicall" element={<Multicall />} />
              <Route path="bid" element={<PlaceBid />} />
              <Route path="auctions" element={<Auctions />} />
            </Routes>
          </VStack>
        </VStack>
        </div>
        </Flex>  
        </div>
 
        </Router>
      </OevContext.Provider>
    </ChakraProvider>
  );
}


export default App;
