import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork, useSignMessage, useAccount, useBalance } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import { PostBidsCancel, POST } from "../Helpers/Endpoints";
import BidInfoParams from "../Custom/BidInfoParams";
import BidAmount from "../Custom/BidAmount";


import CustomHeading from "../Custom/Heading";

import {
  VStack, Box
} from "@chakra-ui/react";


const Hero = () => {
  const {address} = useAccount()
  const { chain } = useNetwork()

  const [request , setRequest] = useState(null);
  const [payload, setPayload] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [ethAmount, setEthAmount] = useState("")
  const [ethBalance, setEthBalance] = useState(0);


  const [bidId, setBidId] = useState("");

  const { signMessage } = useSignMessage({
    onSuccess: (signature) => {
        payload.signature = signature;
        setRequest(payload);
        setPayload(null);
        setMessage(null);
        handleClick(payload)
    },
    onError: (error) => {
      setIsLoading(false);
    },
  })

  const fetchETHBalance_ = useBalance({
    address: address,
  })

  const handleClick = (params) => {
    POST({ payload: params, endpoint:"bids/cancel", setResponse, setError});
  }

  const bidsCancel = () => {
    setIsLoading(true);
    if (request != null) {
      handleClick(request)
      return
    }
    if (bidId === "") {
      alert("Please enter a bid ID")
      setIsLoading(false);
      return
    }
    PostBidsCancel({address, bid:bidId, setPayload, setMessage});
  }

  useEffect(() => {
    setIsLoading(false);
  }, [response, error]);

  useEffect(() => {
    setRequest(null);
  }, [bidId]);

  useEffect(() => {
    if (payload == null) return;
    if (message == null) return;
    if (signMessage == null) return;

    signMessage({message: message});
  }, [payload, message, signMessage]);

  useEffect(() => {
    if (fetchETHBalance_.data != null) {
      setEthBalance(fetchETHBalance_.data.formatted)
    }
}, [fetchETHBalance_]);

  return (
    chain == null ? <SignIn></SignIn> :
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
        <CustomHeading header={"Prepayment Depository"} description={"Searchers utilize PrepaymentDepository contract to deposit and/or withdraw collateral"} isLoading={isLoading}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="orange.500" header={"Function"} text={"applyPermitAndDeposit"}></InfoRow>
              <BidInfoParams id={bidId} setBidId={setBidId} paramName={"Encoded Update Transaction"}></BidInfoParams>
              <ExecuteButton isDisabled={isLoading} onClick={() => bidsCancel()} text={"EXECUTE"} ></ExecuteButton>
          </VStack>
        </Box>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="orange.500" header={"Function"} text={"withdraw"}></InfoRow>
              <BidInfoParams id={bidId} setBidId={setBidId} paramName={"Oev Proxy"}></BidInfoParams>
              <ExecuteButton isDisabled={isLoading} onClick={() => bidsCancel()} text={"EXECUTE"} ></ExecuteButton>
          </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;