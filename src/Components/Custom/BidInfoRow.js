import React, {useState, useContext, useEffect} from "react";
import { useAccount, useSignMessage, useNetwork, usePrepareContractWrite, useWaitForTransaction, useContractWrite} from "wagmi";
import { OevContext } from '../../OevContext';
import { Grid } from 'react-loader-spinner'

import { Text, Box, Image, Stack, Flex, Spacer } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS, MULTICALLABI, API3SERVERV1, API3SERVERV1_ABI, UpdatedOevProxyBeaconSetWithSignedData } from "../../data/abi";
import { ethers } from "ethers";

const Hero = ({item}) => { 
  const { chain } = useNetwork()
  const { address } = useAccount()

  const [payload, setPayload] = useState(null);
  const [isLoadingSign, setIsLoadingSign] = useState(false);

  const [bidAuction, setBidAuction] = useState(null);
  const [encodedUpdateTransaction, setEncodedUpdateTransaction] = useState("");
  const [nativeCurrencyAmount, setNativeCurrencyAmount] = useState("");
  const [updateExecutorAddress, setUpdateExecutorAddress] = useState("");
  const [bidId, setBidId] = useState("");
  const [request , setRequest] = useState(null);

  const [manuelUpdateParams, setManuelUpdateParams] = useState([]);

  const { auction, setAuction, level } = useContext(OevContext);

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
      case "IN PROGRESS":
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
  address: updateExecutorAddress,
  abi: MULTICALLABI,
  functionName: 'externalMulticallWithValue',
  enabled: bidAuction != null && level > 1,
  args: [[API3SERVERV1(chain.id)], [encodedUpdateTransaction], [nativeCurrencyAmount]],
  value: nativeCurrencyAmount,
})

const { data, write } = useContractWrite(config)

const { isLoading, isSuccess } = useWaitForTransaction({
  hash: data?.hash,
});


const { config: config2 } = usePrepareContractWrite({
  address: API3SERVERV1(chain.id),
  abi: API3SERVERV1_ABI,
  functionName: 'updateOevProxyDataFeedWithSignedData',
  enabled: bidAuction != null && manuelUpdateParams.length === 6 && level === 0,
  args: manuelUpdateParams,
  value: nativeCurrencyAmount,
})

const { data: data2, write: write2 } = useContractWrite(config2)

const { isLoading: isLoading2, isSuccess: isSuccess2 } = useWaitForTransaction({
  hash: data2?.hash,
});


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
        setUpdateExecutorAddress(data.updateExecutorAddress)
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
        const refreshedAuction = auction.map((item) => {
          if (data.id === item.id) {
            if (item.auction != null && data.status === "WON") {
              item.auction.status = "IN PROGRESS"
              return item
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
      bids: [bid.id],
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
    if (auction == null) {
      refresh();
      return;
    }

    switch (auction.status) {
      case "PENDING":
        refresh();
        break;
      case "WON":
        updateDataFeed(auction);
        break;
      case "IN PROGRESS":
      case "NEED REFRESH":
        refresh();
        break;
      default:
        break;
  }
}

useEffect(() => {
  if (auction == null) return
  if (bidId == null) return
  if (isSuccess || isSuccess2) {
    const newAuction = auction.map((item) => {
      if (item.id === bidId) {
        item.auction.status = "IN PROGRESS"
      }
      return item;
  });
  setBidId(null)
  setAuction(newAuction) 
  }

}, [auction, bidId, data, isSuccess, isSuccess2, setAuction]);

useEffect(() => {
  if (manuelUpdateParams.length === 0) return
  if (bidAuction == null) return
  if (write2 == null) return
  write2?.()
  setBidAuction(null)
  setManuelUpdateParams([])
}, [bidAuction, manuelUpdateParams, write2]);

useEffect(() => {
  if (bidAuction != null) {
    if (bidAuction.updateExecutorAddress === address) { 
      const values = ethers.utils.defaultAbiCoder.decode(UpdatedOevProxyBeaconSetWithSignedData,
        ethers.utils.hexDataSlice(encodedUpdateTransaction, 4)
      )
      setManuelUpdateParams([values.oevProxy, values.dataFeedId, values.updateId, values.timestamp, values.data, values.packedOevUpdateSignatures])
    } else {
      if (write == null) return
      write?.()
      setBidAuction(null)
    }
  }

}, [address, bidAuction, encodedUpdateTransaction, write, write2]);

  return (
    item == null ? <></> :
    <Stack direction="column"  spacing={"2"} width={"100%"}>
    <Stack direction="row" spacing={"2"}>
      <Stack direction="row" spacing={"-2"}>
        <Image zIndex={2} src={`/coins/${item.dataFeed.p1}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
        <Image zIndex={1} src={`/coins/${item.dataFeed.p2}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
      </Stack>
      <Text fontSize="md" fontWeight="bold">{item.dataFeed.p1 + '/' + item.dataFeed.p2}</Text>
        
      <Box paddingLeft={2} paddingRight={2} borderRadius={"10"} bgColor={COLORS.info} height={5} alignItems={"center"} >
      <Text fontSize="xs">{item.chain}</Text>
      </Box>
      <Spacer />
      <Grid height="20" width="20" radius="9" color="green" ariaLabel="loading" visible={isLoading || isLoading2 || isLoadingSign}/>

      <Box onClick={() => {execute(item.auction)}} cursor={"pointer"} visibility={item.auction == null ? "visible" : (item.auction.status === "WON" || item.auction.status === "PENDING" || item.auction.status === "IN PROGRESS") ? "visible" : "hidden"} paddingLeft={2} paddingRight={2} borderRadius={"10"} bgColor={item.auction == null ? "black" : item.auction.status === "WON" ? "green.500" : "black"} height={5} >
      <Text fontWeight={"bold"} fontSize="xs">{item.auction == null ? "CHECK" : item.auction.status === "WON" ? "UPDATE DATA FEED" : item.auction.status === "IN PROGRESS" ? "CHECK" : "CANCEL"}</Text>
      </Box>

      <Box paddingLeft={2} paddingRight={2} borderRadius={"10"} bgColor={item.auction == null ? "blue.500" : getColor(item.auction == null ? "" : item.auction.status)} height={5} >
      <Text fontWeight={"bold"} fontSize="xs">{item.auction == null ? "..." : item.auction.status}</Text>
      </Box>
    </Stack>

    <Stack direction="row" spacing={"2"}>
    <Text width={"100%"} fontWeight={"bold"} noOfLines={1} fontSize="xs">Bid Amount</Text>
      <Spacer />
      <Flex><Text width={"100%"} noOfLines={1} fontSize="xs">{item.bidAmount}</Text></Flex>
    </Stack>
      <Stack direction="row" spacing={"2"}>
      <Text width={"100%"} fontWeight={"bold"} noOfLines={1} fontSize="xs">Condition</Text>
      <Spacer />
      <Flex><Text width={"100%"} noOfLines={1} fontSize="xs">{item.condition}</Text></Flex>
      </Stack>

      <Stack direction="row" spacing={"2"}>
      <Text width={"100%"} fontWeight={"bold"} noOfLines={1} fontSize="xs">Fullfilment Value</Text>
      <Spacer />
      <Flex><Text width={"100%"} noOfLines={1} fontSize="xs">{item.fulfillValue}</Text></Flex>
      </Stack>
  </Stack>
  
  );
};

export default Hero;





