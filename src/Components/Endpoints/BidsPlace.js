import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork, useSignMessage, useAccount, useBalance } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import { PostBidsPlace, POST } from "../Helpers/Endpoints";
import BidPlaceParams from "../Custom/BidPlaceParams";
import { ethers } from "ethers";

import CustomHeading from "../Custom/Heading";

import {JsonTree} from 'react-editable-json-tree'

import {
  VStack, Text, Box
} from "@chakra-ui/react";


const Hero = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [payload, setPayload] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const [ethBalance, setEthBalance] = useState(0);
  const [ethAmount, setEthAmount] = useState("");
  const [proxyAddress, setProxyAddress] = useState("");
  const [proxyChainId, setProxyChainId] = useState("");
  const [updateExecutorAddress, setUpdateExecutorAddress] = useState("");
  const [fulfillValue, setFulfillValue] = useState("");
  const [condition, setCondition] = useState("LTE");

  const [params, setParams] = useState({
    ethAmount: ethAmount,
    ethBalance: ethBalance,
    proxyAddress: proxyAddress,
    proxyChainId: proxyChainId,
    updateExecutorAddress: updateExecutorAddress,
    fulfillValue: fulfillValue,
    condition: condition
  })

  const [bid, setBid] = useState(null);

  const fetchETHBalance_ = useBalance({
    address: address,
  })

  const { signMessage } = useSignMessage({
    onSuccess: (signature) => {
        payload.signature = signature;
        setPayload(null);
        setMessage(null);
        handleClick(payload)
    },
    onError: (error) => {
      setIsLoading(false);
    },
  })

  const handleClick = (params) => {
    POST({ payload: params, endpoint:"bids/place", setResponse, setError});
  }

  const getBidsList = () => {
    setIsLoading(true);
    PostBidsPlace({address, bid, setPayload, setMessage});
  }

  useEffect(() => {
    setIsLoading(false);
  }, [response, error]);

  useEffect(() => {
    if (payload == null) return;
    if (message == null) return;
    if (signMessage == null) return;

    signMessage({message: message});
  }, [payload, message, signMessage]);

  useEffect(() => {
    setEthAmount(params.ethAmount)
    setEthBalance(params.ethBalance)
    setProxyAddress(params.proxyAddress)
    setProxyChainId(params.proxyChainId)
    setUpdateExecutorAddress(params.updateExecutorAddress)
    setFulfillValue(params.fulfillValue)
    setCondition(params.condition)
  }, [ethAmount, fulfillValue, ethBalance, params])

  useEffect(() => {
    if (setParams == null) return

    setBid({
      bidAmount: ethAmount !== "" ? ethers.utils.parseEther(ethAmount).toString() : "0",
      condition:condition,
      dAppProxyAddress:proxyAddress,
      dAppProxyChainId: parseInt(proxyChainId),
      fulfillmentValue: fulfillValue !== "" ? ethers.utils.parseEther(fulfillValue).toString() : "0",
      updateExecutorAddress:updateExecutorAddress
    })
  }, [ethAmount, ethBalance, proxyAddress, proxyChainId, updateExecutorAddress, fulfillValue, condition, setParams])


  useEffect(() => {
      if (fetchETHBalance_.data != null) {
        setEthBalance(fetchETHBalance_.data.formatted)
      }
  }, [fetchETHBalance_]);

  const validateAddress = (address) => {
    try {
      ethers.utils.getAddress(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  const isDisabled = () => {
    if (isLoading) return true;
    if (ethAmount === "") return true;
    if (ethBalance === 0) return true;
    if (proxyAddress === "") return true;
    if (proxyChainId === "") return true;
    if (updateExecutorAddress === "") return true;
    if (fulfillValue === "") return true;
    if (condition === "") return true;
    if (!validateAddress(proxyAddress)) return true;
    if (!validateAddress(updateExecutorAddress)) return true;
    return false;
  }

  return (
    chain == null ? <SignIn></SignIn> :
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
        <CustomHeading header={"POST /bids/place"} description={"Places bids in anticipation of an OEV opportunity on a specific data feed/chain. dAppProxyAddress is the data feed that the searcher wants to place a bid on. dAppProxyChainId is the chain ID of the data feed. bidAmount is the amount of collateral that will be reserved for the bid. condition is the condition that will be used to determine if the bid is fulfilled. fulfillmentValue is the value that will be used to determine if the condition is met. updateExecutorAddress is the address of the update executor contract that will be used to fulfill the bid."} isLoading={isLoading}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="green.500" header={"HTTP Request"} text={"POST https://oev.api3dev.com/api/bids/place"}></InfoRow>
              <BidPlaceParams params={params} setParams={setParams} ethBalance={ethBalance} isProxyAddressValid={validateAddress(proxyAddress)} isUpdateAddressValid={validateAddress(updateExecutorAddress)}></BidPlaceParams>
              <ExecuteButton isDisabled={isDisabled()} onClick={() => getBidsList()} text={"POST"} ></ExecuteButton>
          </VStack>
        </Box>
        {response == null ? null :
                <Box cursor={"pointer"} width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
                <VStack spacing={3} direction="row" align="left" m="1rem">
                  <Text fontWeight={"bold"} fontSize={"sm"}>Response</Text>   
                  <JsonTree readOnly={true} data={response} />             
                </VStack>
                </Box>
        }
    </VStack>
  );
};

export default Hero;