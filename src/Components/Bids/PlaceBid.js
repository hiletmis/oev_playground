import React, {useState, useContext, useEffect } from "react";
import SignIn from '../SignIn';
import Welcome from '../Welcome';
import { useNetwork, useAccount, useBalance, useSignMessage } from "wagmi";
import { COLORS } from '../../data/colors';
import { OevContext } from '../../OevContext';
import { ethers } from "ethers";
import DataFeedRow from "../Custom/DataFeedRow";
import CustomHeading from "../Custom/Heading";
import BidAmount from "../Custom/BidAmount";
import BidConditions from "../Custom/BidConditions";
import ExecuteButton from "../Custom/ExecuteButton";
import BidInfoRow from "../Custom/BidInfoRow";

import {
    VStack, Box, Text, Flex, Spacer
  } from "@chakra-ui/react";

  import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS } from "../../data/abi";

const Hero = () => {
    const { chain } = useNetwork()
    const { address } = useAccount()

    const [dataFeed, setDataFeed] = useState(null);
    const [mullticallContract, setMulticallContract] = useState(address);
    const [ethAmount, setEthAmount] = useState("");
    const [ethBalance, setEthBalance] = useState(0);
    const [fulfillValue, setFulfillValue] = useState("");
    const [condition, setCondition] = useState(null);
    const [showBidId, setShowBidId] = useState(false);

    const [payload, setPayload] = useState(null);

    const { level, searcher, contextDataFeed, contextProxyAddress, multicall, auction, setAuction, bid, setBid } = useContext(OevContext);

    useEffect(() => {
        if (contextDataFeed.length > 0) {
          setDataFeed(contextDataFeed[0]);
        }        
        if (multicall !== null) {
          setMulticallContract(multicall);
        }
      }, [contextDataFeed, dataFeed, multicall]);


    const fetchETHBalance_ = useBalance({
        address: address,
    })
    
    useEffect(() => {
        if (fetchETHBalance_.data != null) {
        setEthBalance(fetchETHBalance_.data.formatted)
        }
    }, [fetchETHBalance_]);


    useEffect(() => {
        if (bid != null) {
            setShowBidId(true);
        }
    }, [bid]);

    const { isLoading, signMessage } = useSignMessage({
        message: "1",
        onSuccess: (signature) => {
            payload.signature = signature;
            postMessage({ payload: payload });
        }
    })

    const postMessage = async ({ payload }) => {
        const response = await fetch('https://oev.api3dev.com/api/bids/place', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const data = await response.json()

        if (data != null) {
            if (data.bids == null) return
            if (data.bids.length === 0) {
                console.log("Bid was not placed");
                return;
            }

            const bid = {
                id: data.bids[0],
                dataFeed: dataFeed,
                bidAmount: ethAmount,
                condition: condition,
                fulfillValue: fulfillValue,
                chain: chain.name
            }

            setBid(bid);
            setShowBidId(true);

            if (auction != null) {
                let newAuctions = auction.reverse()
                newAuctions.push(bid);
                setAuction(newAuctions.reverse());
            } else {
                setAuction([bid]);
            }   
        }
    }

    const signPayload = () => {
        setShowBidId(false);

        const validUntil = new Date();
        validUntil.setMinutes(validUntil.getMinutes() + 5); 

        const bid = { 
            bidAmount: ethers.utils.parseEther(ethAmount).toString(),
            dAppProxyAddress:contextProxyAddress,
            dAppProxyChainId:chain.id,
            condition:condition,
            fulfillmentValue: ethers.utils.parseEther(fulfillValue).toString(),
            updateExecutorAddress:mullticallContract
        }

        let payload = {
            bids: [bid],
            searcherAddress: address,
            validUntil: validUntil,
            prepaymentDepositoryChainId: 11155111,
            prepaymentDepositoryAddress: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
            requestType: 'API3 OEV Relay, /bids/place',
        }

        setPayload(payload);

        const sortedBids = JSON.stringify(bid, Object.keys(bid).sort());
        const sorted = JSON.stringify(payload, Object.keys(payload).sort());
        const merged = sorted.replace('{}', sortedBids);

        signMessage({ message: merged });
    }

  return (
    chain == null ? <SignIn></SignIn> :
    ((contextProxyAddress === null || multicall === null) && (level === 2)) || (contextDataFeed.length === 0 && level===0) || searcher === null ? <Welcome></Welcome> : 
        <VStack overflowY={"scroll"} spacing={4} p={8} minWidth={"600px"} maxWidth={"700px"}  alignItems={"left"} >
            <CustomHeading header={"Place a Bid"} description={"Places bids in anticipation of an OEV opportunity on a specific data feed."} isLoading={isLoading}></CustomHeading>
            <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>

            <VStack spacing={3} direction="row" align="left" m="1rem">
                <DataFeedRow dataFeed={dataFeed}></DataFeedRow>
                <BidAmount ethAmount={ethAmount} setEthAmount={setEthAmount} ethBalance={ethBalance} chain={chain}></BidAmount>
                <BidConditions fulfillValue={fulfillValue} setFulfillValue={setFulfillValue} condition={condition} setCondition={setCondition}></BidConditions>
                <ExecuteButton 
                    isDisabled={isLoading || !ethAmount || !fulfillValue || !condition ||isNaN(parseFloat(ethAmount)) || parseFloat(ethAmount) <= 0 || parseFloat(ethBalance) < parseFloat(ethAmount)}
                    text={isLoading ? 'Bidding...' : 'Bid'}
                    onClick={signPayload}>
                </ExecuteButton>
            </VStack>

            </Box>

            <VStack visibility={bid != null && showBidId ? "visible":"hidden"} p={4} shadow="md" borderWidth="px" flex="1" borderRadius={"10"} bgColor={COLORS.main} alignItems={"left"}>
                
            <Flex>
                <Text fontWeight={"bold"} fontSize={"md"}>Bid</Text>
                <Spacer />
                </Flex>
                
                {bid == null && !showBidId ? null :
                <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <BidInfoRow item={bid}></BidInfoRow>
                </Box>}

            </VStack>

</VStack>    
  );
};

export default Hero;