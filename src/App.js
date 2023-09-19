import './App.css';
import Header from './Components/Header';
import DeployProxy from './Components/DeployProxy';
import Prepayment from './Components/Prepayment';
import Navigator from './Components/Navigator';
import Multicall from './Components/Multicall';
import PlaceBid from './Components/Bids/PlaceBid';
import Auctions from './Components/Bids/Auctions';
import Withdraw from './Components/Withdraw';
import Welcome from './Components/Welcome';

import GetConfiguration from './Components/Endpoints/GetConfiguration'
import WithdrawalsRequest from './Components/Endpoints/WithdrawalsRequest'
import WithdrawalsList from './Components/Endpoints/WithdrawalsList'
import Status from './Components/Endpoints/Status'
import BidsInfo from './Components/Endpoints/BidsInfo'
import BidsList from './Components/Endpoints/BidsList'
import BidsPlace from './Components/Endpoints/BidsPlace'
import BidsCancel from './Components/Endpoints/BidsCancel'
import AuctionsInfo from './Components/Endpoints/AuctionsInfo'
import AuctionsList from './Components/Endpoints/AuctionsList'

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
const [contextDataFeed, setContextDataFeed] = useState([]);
const [auction, setAuction] = useState(null);
const [searcher, setSearcher] = useState(null);
const [contextProxyAddress, setContextProxyAddress] = useState(null);
const [multicall, setMulticall] = useState(null);
const [bid, setBid] = useState(null);
const [auctionStatus, setAuctionStatus] = useState(null);
const [collapsed, setCollapsed] = useState(false);


useEffect(() => {
  setMulticall(null)
  setBid(null)
  setAuctionStatus(null)
  setContextDataFeed([])
  setMulticall(null)
  setContextProxyAddress(null)
}, [chain]);

useEffect(() => {
  setMulticall(null)
  setBid(null)
  setAuctionStatus(null)
  setWallet(null)
  setSearcher(null)
  setContextDataFeed([])
  setAuction(null)
  setContextProxyAddress(null)
  setBid(null)
}, [address]);

useEffect(() => {
  setMulticall(null)
}, [level]);

  return (
    <ChakraProvider theme={modifiedTheme}>
      <OevContext.Provider value={{ collapsed, setCollapsed, level, setLevel, wallet, setWallet, searcher, setSearcher, multicall, setMulticall, bid, setBid, contextProxyAddress, setContextProxyAddress, auction, setAuction, contextDataFeed, setContextDataFeed, auctionStatus, setAuctionStatus}}>
        <Router>
        <div class="container" >
        <div class="header"><Header /></div>
        <Flex>
        <div class="body">
        <Flex spacing={0} p={2} boxShadow="lg" width={"100%"} height={"100%"} alignItems={"left"} >
          <Navigator />
          <VStack bgColor={COLORS.app} overflow={"scroll"} borderRadius="lg" boxShadow="lg" height={"100%"} width={"100%"} alignItems={"left"} >
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="proxy" element={<DeployProxy />} />
              <Route path="searcher" element={<Prepayment />} />
              <Route path="multicall" element={<Multicall />} />
              <Route path="bid" element={<PlaceBid />} />
              <Route path="auctions" element={<Auctions />} />
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="configuration" element={<GetConfiguration />} />
              <Route path="withdrawals/request" element={<WithdrawalsRequest />} />
              <Route path="withdrawals/list" element={<WithdrawalsList />} />
              <Route path="status" element={<Status />} />
              <Route path="bids/info" element={<BidsInfo />} />
              <Route path="bids/list" element={<BidsList />} />
              <Route path="bids/place" element={<BidsPlace />} />
              <Route path="bids/cancel" element={<BidsCancel />} />
              <Route path="auctions/info" element={<AuctionsInfo />} />
              <Route path="auctions/list" element={<AuctionsList />} />
            </Routes>
          </VStack>
        </Flex>
        </div>
        </Flex>  
        </div>
 
        </Router>
      </OevContext.Provider>
    </ChakraProvider>
  );
}


export default App;
