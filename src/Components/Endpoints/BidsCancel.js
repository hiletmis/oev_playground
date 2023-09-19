import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork, useSignMessage, useAccount } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import { PostBidsCancel, POST } from "../Helpers/Endpoints";
import BidInfoParams from "../Custom/BidInfoParams";

import CustomHeading from "../Custom/Heading";

import {
  JsonTree
} from 'react-editable-json-tree'

import {
  VStack, Text, Box
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

  return (
    chain == null ? <SignIn></SignIn> :
    <VStack spacing={4} p={8} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
        <CustomHeading header={"POST /bids/cancel"} description={"Cancels bids. If the bid is already fulfilled, it cannot be cancelled. If no bids are specified, all of the searcher's bids will be cancelled."} isLoading={isLoading}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="green.500" header={"HTTP Request"} text={"POST https://oev.api3dev.com/api/bids/cancel"}></InfoRow>
              <BidInfoParams id={bidId} setBidId={setBidId} paramName={"Bid Id"}></BidInfoParams>
              <ExecuteButton isDisabled={isLoading} onClick={() => bidsCancel()} text={"POST"} ></ExecuteButton>
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