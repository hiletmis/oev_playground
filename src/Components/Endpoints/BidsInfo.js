import {useContext, useEffect, useState} from "react";
import SignIn from '../SignIn';
import Welcome from '../Welcome';
import { useNetwork, useSignMessage, useAccount } from "wagmi";
import { OevContext } from '../../OevContext';
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import { PostBidsInfo, POST } from "../Helpers/Endpoints";
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
  const { searcher } = useContext(OevContext);

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
    POST({ payload: params, endpoint:"bids/info", setResponse, setError});
  }

  const getBidsInfo = () => {
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
    PostBidsInfo({address, bidId, setPayload, setMessage});
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
    searcher == null ? <Welcome></Welcome> : 
    <VStack overflowY={"scroll"} spacing={4} p={8} width="600px" alignItems={"left"} >
        <CustomHeading header={"POST /bids/info"} description={"Returns a list of searcher's bids and their data. Consistently polling this endpoint will keep you informed about the fulfillment or cancellation of your bids."} isLoading={isLoading}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="green.500" header={"HTTP Request"} text={"POST https://oev.api3dev.com/api/bids/info"}></InfoRow>
              <BidInfoParams id={bidId} setBidId={setBidId} paramName={"Bid Id"}></BidInfoParams>
              <ExecuteButton isDisabled={isLoading} onClick={() => getBidsInfo()} text={"POST"} ></ExecuteButton>
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