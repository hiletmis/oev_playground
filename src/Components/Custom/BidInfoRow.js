import React, {useState, useContext, useEffect} from "react";
import { useAccount, useSignMessage, useNetwork, usePrepareContractWrite, useWaitForTransaction, useContractWrite, useContractRead} from "wagmi";
import { OevContext } from '../../OevContext';
import { Grid } from 'react-loader-spinner'

import { Text, Box, Image, Stack, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS, API3SERVERV1, API3SERVERV1_ABI, UpdatedOevProxyBeaconSetWithSignedData, DATA_FEED_PROXY_ABI } from "../../data/abi";
import { ethers } from "ethers";
import MiniButton from "./MiniButton";
import InfoRow from "./InfoRow";
import TransactionHash from "./TransactionHash";

const Hero = ({item}) => { 
  const { chain } = useNetwork()
  const { address } = useAccount()

  const [payload, setPayload] = useState(null);
  const [isLoadingSign, setIsLoadingSign] = useState(false);

  const [bidAuction, setBidAuction] = useState(null);
  const [dataFeedVal0, setDataFeedVal0] = useState({value: "...", timestamp: "..."});
  const [dataFeedVal1, setDataFeedVal1] = useState({value: "...", timestamp: "..."});
  const [encodedUpdateTransaction, setEncodedUpdateTransaction] = useState("");
  const [nativeCurrencyAmount, setNativeCurrencyAmount] = useState("");
  const [bidId, setBidId] = useState("");
  const [request , setRequest] = useState(null);
  const [proxyAddress, setProxyAddress] = useState(null);
  const [chainId, setChainId] = useState(chain != null ? chain.id : 0);

  const [initalDataFeed, setInitalDataFeed] = useState(false);
  const [isDataFeedUpdated, setIsDataFeedUpdated] = useState(false);
  const [manuelUpdateParams, setManuelUpdateParams] = useState([]);
  const [txHash, setTxHash] = useState(null);

  const { auction, setAuction, bid } = useContext(OevContext);

  const getColor = (status) => {
    switch (status) {
      case "PENDING":
        return "yellow.500";
      case "WON":
        return "green.500";
      case "CANCELLED":
        return "gray.500";
      case "EXECUTED":
        return "black";
      case "SLASHED":
        return "red.500";
      case "REFRESH":
        return "blue.500";
      case "FRONT-RUN":
        return "orange.500";
      case "PROCESSING":
        return "blue.500";
      default:
        return "blue.500";
    }
  }

  const { signMessage } = useSignMessage({
    onError: (error) => {
      setIsLoadingSign(false);
    },
    onSuccess: (signature) => {
        payload.signature = signature;
        setIsLoadingSign(false);
        switch (payload.requestType) {
          case "API3 OEV Relay, /bids/cancel":
            postMessage({ payload: payload, endpoint: "bids/cancel" });
            break;
          case "API3 OEV Relay, /auctions/info":
            postMessage({ payload: payload, endpoint: "auctions/info" });
            break
          case "API3 OEV Relay, /bids/info":
            postMessage({ payload: payload, endpoint: "bids/info" });
            break
          default:
            break;
        }
    }
})

const { config } = usePrepareContractWrite({
  address: API3SERVERV1(chainId),
  abi: API3SERVERV1_ABI,
  functionName: 'updateOevProxyDataFeedWithSignedData',
  enabled: bidAuction != null && manuelUpdateParams.length === 6,
  args: manuelUpdateParams,
  value: nativeCurrencyAmount,
})

const { data, write } = useContractWrite(config)

const { isLoading, isSuccess } = useWaitForTransaction({
  hash: data?.hash,
  confirmations: 1,
  onSuccess: () => {
    setTxHash(data.hash);
}
});

const dataFeedValue = useContractRead({
  address: proxyAddress,
  abi: DATA_FEED_PROXY_ABI,
  functionName: 'read',
  args: [],
  enabled: (initalDataFeed) || (isDataFeedUpdated),
  watch: true,
})

useEffect(() => {
  if (dataFeedValue.data != null && !isDataFeedUpdated && initalDataFeed && dataFeedVal0.value === "...") {
    setDataFeedVal0(dataFeedValue.data)
  }
}, [dataFeedVal0.value, dataFeedValue, initalDataFeed, isDataFeedUpdated]);

useEffect(() => {
  if (dataFeedValue.data != null && isDataFeedUpdated) {
    setDataFeedVal1(dataFeedValue.data)
  }
}, [isDataFeedUpdated, dataFeedValue, dataFeedVal0.value]);

useEffect(() => {
  setIsDataFeedUpdated(false)
  setInitalDataFeed(false)
  setManuelUpdateParams([])
  setDataFeedVal0({value: "...", timestamp: "..."})
  setDataFeedVal1({value: "...", timestamp: "..."})
  setTxHash(null)
  setRequest(null)
}, [bid]);

const postMessage = async ({ payload, endpoint }) => {
    const response = await fetch('https://oev.api3dev.com/api/' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    setIsLoadingSign(false);
    const data = await response.json()

    if (data != null) {
      switch (endpoint) {
        case "auctions/info":
          setEncodedUpdateTransaction(data.encodedUpdateTransaction)
          setNativeCurrencyAmount(data.nativeCurrencyAmount)
          setBidAuction(data)
        break

        case "bids/cancel":
        const newAuction = auction.map((item) => {
          let found = data.bids.find((bid) => bid === item.id);
          if (found != null) {
            item.auction.status = "SEARCHER_CANCELED"
          }
          return item;
      });
      setAuction(newAuction)  
        break

        case "bids/info":
          setRequest(payload);
        if (data == null) return
        if (auction == null) setAuction([])
        setProxyAddress(data.dAppProxyAddress)
        const refreshedAuction = auction.map((item) => {
          if (data.id === item.id) {
            if (item.auction != null && data.status === "WON" && initalDataFeed) {
              item.auction.status = "PROCESSING"
              return item
            } 
            if (data.status === "EXECUTED") {
              setRequest(null)
              setTimeout(() => setIsDataFeedUpdated(data.status === "EXECUTED"), 1000);
            }
            item.auction = data
          }
          return item;
        });

        setAuction(refreshedAuction)  
      break
        default:
          break;
      } 
    }
}

const refresh = () => {
  const validUntil = new Date();
  validUntil.setMinutes(validUntil.getMinutes() + 5);

  let payload = {
      id: item.id,
      searcherAddress: address,
      validUntil: validUntil,
      prepaymentDepositoryChainId: 11155111,
      prepaymentDepositoryAddress: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
      requestType: 'API3 OEV Relay, /bids/info',
  }

  setPayload(payload);
  const sorted = JSON.stringify(payload, Object.keys(payload).sort());
  setIsLoadingSign(true);
  
  if (request == null) {
    signMessage({ message: sorted });
    return
  }

  if (request.validUntil > Date.now()) {
      postMessage({ payload: request, endpoint: "bids/info" })
  } else {
      signMessage({ message: sorted });
  }
}

const formatFeedData = (data) => {
  if (data == null) return {value: "...", timestamp: "..."}
  if (data.length === 0) return {value: "...", timestamp: "..."}
  if (data[0] == null) return {value: "...", timestamp: "..."}
  if (data[1] == null) return {value: "...", timestamp: "..."}

  const time = parseInt(data[1]) * 1000
  let date = new Date(time)
  const eth = ethers.utils.formatUnits(data[0], 18)

  return {
    value: eth,
    timestamp: date.toLocaleString()
  }
}

const updateDataFeed = (bid) => {
  const validUntil = new Date();
  validUntil.setMinutes(validUntil.getMinutes() + 5); 

  let payload = {
      id: bid.auctionId,
      searcherAddress: address,
      validUntil: validUntil,
      prepaymentDepositoryChainId: 11155111,
      prepaymentDepositoryAddress: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
      requestType: 'API3 OEV Relay, /auctions/info',
  }

  setPayload(payload);
  const sorted = JSON.stringify(payload, Object.keys(payload).sort());
  setIsLoadingSign(true);
  setBidId(bid.id)
  signMessage({ message: sorted });
}

const cancelBid = (bid) => {
  const validUntil = new Date();
  validUntil.setMinutes(validUntil.getMinutes() + 5); 
  let payload = {
      bids: [item.id],
      searcherAddress: address,
      validUntil: validUntil,
      prepaymentDepositoryChainId: 11155111,
      prepaymentDepositoryAddress: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
      requestType: 'API3 OEV Relay, /bids/cancel',
  }

    setPayload(payload);
    const sorted = JSON.stringify(payload, Object.keys(payload).sort());
    signMessage({ message: sorted });
  }

  const execute = (auction) => {

    switch (auction) {
      case "CANCEL":
        cancelBid();
        break;
      case "WON":
        setInitalDataFeed(true)
        updateDataFeed(item.auction);
        break;
      case "PROCESSING":
        refresh();
        break;
        case "CHECK":
          refresh();
          break;
      default:
        refresh();

        break;
  }
}

useEffect(() => {
  if (auction == null) return
  if (bidId == null) return
  if (isSuccess) {
    const newAuction = auction.map((item) => {
      if (item.id === bidId) {
        item.auction.status = "PROCESSING"
      }
      return item;
  });
  setBidId(null)
  setAuction(newAuction) 
  }

}, [auction, bidId, data, isSuccess, setAuction]);

useEffect(() => {
  if (manuelUpdateParams.length === 0) return
  if (bidAuction == null) return
  if (write == null) return
  write?.()
  setBidAuction(null)
  setManuelUpdateParams([])
}, [bidAuction, manuelUpdateParams, write]);

useEffect(() => {
  if (bidAuction != null) {
    const values = ethers.utils.defaultAbiCoder.decode(UpdatedOevProxyBeaconSetWithSignedData,
      ethers.utils.hexDataSlice(encodedUpdateTransaction, 4)
    )
    setManuelUpdateParams([values.oevProxy, values.dataFeedId, values.updateId, values.timestamp, values.data, values.packedOevUpdateSignatures])
  }

}, [address, bidAuction, encodedUpdateTransaction, write]);

useEffect(() => {
  setChainId(chain != null ? chain.id : 0);
}, [chain]);

  return (
    item == null ? <></> :
    <Stack direction="column" spacing={"2"} width={"100%"}>
    <Stack direction="row" spacing={"2"}>
      <Stack direction="row" spacing={"1"}>
        <Image src={`/coins/${item.dataFeed.p1}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
        <Image src={`/coins/${item.dataFeed.p2}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
      </Stack>
      <Text fontSize="md" fontWeight="bold">{item.dataFeed.p1 + '/' + item.dataFeed.p2}</Text>
        

      <Spacer />
      <Grid height="20" width="20" radius="9" color="green" ariaLabel="loading" visible={isLoading || isLoadingSign}/>

      <Box paddingLeft={2} paddingRight={2} borderRadius={"10"} bgColor={COLORS.table} height={5} alignItems={"center"} >
      <Text fontSize="xs" fontWeight={"bold"}>{item.chain}</Text>
      </Box>


    </Stack>

      <Flex float={"left"} wrap={"wrap"} direction={"row"} p={2} bgColor={COLORS.table} borderRadius={10} align={"center"}>
      <InfoRow header={"Bid Amount"} text={item.bidAmount} bgColor={COLORS.main}/>
      <InfoRow header={"Fullfilment Value"} text={(item.condition === 'LTE' ? "<" : ">") + item.fulfillValue} bgColor={COLORS.main}/>
      </Flex>

      {
        !initalDataFeed ? null :
        <>
            <Flex float={"left"} wrap={"wrap"} direction={"row"} p={2} bgColor={COLORS.table} borderRadius={10} align={"center"}>
            <InfoRow header={"Current Feed Data"} text={formatFeedData(dataFeedVal0).value} bgColor={COLORS.main}/>
            <InfoRow header={"Current Feed Timestamp"} text={formatFeedData(dataFeedVal0).timestamp} bgColor={COLORS.main}/>
            <InfoRow header={"Updated Feed Data "} text={formatFeedData(dataFeedVal1).value} bgColor={COLORS.main}/>
            <InfoRow header={"Updated Feed Timestamp"} text={formatFeedData(dataFeedVal1).timestamp} bgColor={COLORS.main}/>
            </Flex>
        </>
      }

      <VStack p={2} spacing={"10"} bgColor={COLORS.table} width={"100%"} borderRadius={"10"}> 
        <Flex wrap={"wrap"}  width={"100%"} alignItems={"center"} justify={"space-between"}>

          <MiniButton isDisabled={item.auction == null ? false : (item.auction.status === "EXECUTED" || item.auction.status === "SLASHED"  || item.auction.status === "SEARCHER_CANCELED")}  onClick={() => {execute("CHECK")}} text={"CHECK"} ></MiniButton>
          <MiniButton isDisabled={item.auction == null ? true : item.auction.status !== "WON"} onClick={() => {execute("WON")}} text={"UPDATE"} ></MiniButton>
          <MiniButton isDisabled={item.auction == null ? true : item.auction.status !== "PENDING"} onClick={() => {execute("CANCEL")}} text={"CANCEL"} ></MiniButton>

          <Spacer />
          <Flex justify={"center"} alignItems={"center"} minWidth={"100px"} height={"40px"} paddingLeft={2} paddingRight={2} borderRadius={"5"} bgColor={item.auction == null ? "blue.500" : getColor(item.auction == null ? "" : item.auction.status)} >
            <Text align={"center"} fontWeight={"bold"} fontSize="xs">{item.auction == null ? "CHECK STATUS" : item.auction.status.replace("_", " ") }</Text>
          </Flex>  
        </Flex>       
      </VStack>
      <TransactionHash chain={chain} txHash={txHash}></TransactionHash>
  </Stack>
  
  );
};

export default Hero;





