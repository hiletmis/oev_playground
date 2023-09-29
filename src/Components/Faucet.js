import React, { useState, useEffect } from "react";
import NodaryFeed from './Helpers/GetFeed';
import InfoBox from "./Custom/InfoBox";
import ExecuteButton from "./Custom/ExecuteButton";
import Heading from "./Custom/Heading";
import BidAmount from "./Custom/BidAmount";

import {
  VStack, Box, Flex,
} from "@chakra-ui/react";

import { ethers } from "ethers";
import { useBalance, useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi';

import { TOKEN_ABI, TOKEN_CONTRACT_ADDRESS } from "../data/abi";

import { COLORS } from '../data/colors';

const Hero = ({stateChanger}) => {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [ethAmount, setEthAmount] = useState("");
  const [ethPrice, setEthPrice] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [data_, setData] = useState("");
  const [signedMessage, setSignedMessage] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [items, setItems] = useState([]);
  const [refreshBalance, setRefreshBalance] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [beaconData, setBeaconData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

const fetchETHBalance_ = useBalance({
  address: address,
  chainId: 11155111,
})

useEffect(() => {
  if (fetchETHBalance_.data != null) {
    setEthBalance(fetchETHBalance_.data.formatted)
  }
}, [fetchETHBalance_]);

const balance = useBalance({
  address: address,
  token: TOKEN_CONTRACT_ADDRESS,
  chainId: 11155111,
  enabled: refreshBalance,
})

useEffect(() => {
  if (balance.data != null) {
    setTokenBalance(balance?.data.formatted)
  }
}, [balance]);

  useEffect(() => {
    if (!ethAmount || isNaN(parseFloat(ethAmount))) return;
    if (ethAmount <= 0) return;
    if (ethAmount) {
      setIsFetching(true)
      NodaryFeed({ dataFeedId: "0x4385954e058fbe6b6a744f32a4f89d67aad099f8fb8b23e7ea8dd366ae88151d", setBeaconData: setBeaconData})
    }
  }, [ethAmount]);

  useEffect(() => {
    setIsFetching(false)
    if (beaconData) {
      const decodedValue = ethers.utils.defaultAbiCoder.decode(
        ["int256"],
        beaconData.encodedValue
      );
      setEthPrice(decodedValue);
      setTimestamp(beaconData.timestamp);
      setSignedMessage(beaconData.signature);
      setData(beaconData.encodedValue);
    } 

  }, [beaconData]);

  const calculateAmountValue = () => {
    if (!ethAmount || isNaN(parseFloat(ethAmount))) return 0;
    if (ethPrice && ethAmount) {
      return ((ethPrice * ethAmount) / 1e18).toFixed(2);
    }
    return "0";
  };

  const { config } = usePrepareContractWrite({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'mint',
    chainId: 11155111,
    enabled: timestamp && data_ && signedMessage && !isNaN(parseFloat(ethAmount)) && parseFloat(ethAmount) > 0,
    args: [timestamp, data_, signedMessage],
    value: (!ethAmount || isNaN(parseFloat(ethAmount))) ? 0 : ethers.utils.parseEther(ethAmount),
  })

  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const mintTokens = async () => {
    setIsMinting(true)
  };

  useEffect(() => {
    if (!timestamp || !data_ || !signedMessage || isNaN(parseFloat(ethAmount)) || parseFloat(ethAmount) <= 0) return
    if (write == null || write === undefined) return
    
    if (isMinting) {
      setIsMinting(false)
      write?.()
    }
  }, [data_, ethAmount, isMinting, signedMessage, timestamp, write]);

  useEffect(() => { 
    if (isSuccess) {
      localStorage.setItem('items', JSON.stringify(items));
        setEthAmount("");
        setRefreshBalance(true)
    }
    }, [isSuccess, items]);

    useEffect(() => {
      const items = JSON.parse(localStorage.getItem('items'));
      if (items) {
       setItems(items);
      }
    }, []);


  return (
    <VStack bgColor={COLORS.main} spacing={4} p={2} borderRadius="lg" boxShadow="lg" minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >

      <VStack bgColor={COLORS.app} spacing={4} p={4} borderRadius="lg" boxShadow="lg" alignItems={"left"} >
        <Heading isLoading={isLoading || isFetching } description={"Deposit Sepolia ETH to get testUSDC"} header={"TestUSDC Faucet"} ></Heading>

        <Box width={"100%"} p={3} bgColor={COLORS.main} borderRadius={"10"}>
          <BidAmount title="Exchange Amount" ethAmount={ethAmount} setEthAmount={setEthAmount} ethBalance={ethBalance} chain={chain} ></BidAmount>
        </Box>

        <InfoBox margin={2} header={"TestUSDC will be minted"} text={parseFloat(calculateAmountValue())} image={'/coins/USD.webp'} ></InfoBox>
        <InfoBox margin={2} header={"Token Balance"} text={tokenBalance} image={'/coins/USD.webp'} ></InfoBox>

        <Flex>
          <ExecuteButton minWidth={"100px"} text={ isLoading ? 'Minting...' : 'Mint'} 
          onClick={mintTokens} 
          isDisabled={isLoading || !ethAmount || !beaconData || isNaN(parseFloat(ethAmount)) || parseFloat(ethAmount) <= 0 || parseFloat(ethBalance) < parseFloat(ethAmount)}></ExecuteButton>
          <ExecuteButton minWidth={"100px"} text={"Cancel"} onClick={() => stateChanger()}></ExecuteButton>
        </Flex>

      </VStack>
    </VStack>
  );
};

export default Hero;
