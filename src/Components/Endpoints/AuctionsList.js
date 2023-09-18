import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork, useSignMessage, useAccount } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import { PostAuctionsList, POST } from "../Helpers/Endpoints";
import BidsListParams from "../Custom/BidsListParams";

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

  const [cursor, setCursor] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

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
    POST({ payload: params, endpoint:"auctions/list", setResponse, setError});
  }

  const getBidsList = () => {
    setIsLoading(true);
    if (request != null) {
      handleClick(request)
      return
    }
    PostAuctionsList({address, cursor, sortDirection, setPayload, setMessage});
  }

  useEffect(() => {
    setIsLoading(false);
  }, [response, error]);

  useEffect(() => {
    setRequest(null);
  }, [cursor, sortDirection]);

  useEffect(() => {
    if (payload == null) return;
    if (message == null) return;
    if (signMessage == null) return;

    signMessage({message: message});
  }, [payload, message, signMessage]);

  useEffect(() => {
    if (response == null) return;
    response.cursor == null 
    ? setCursor("")
    : setCursor(response.cursor);
  }, [response]);

  return (
    chain == null ? <SignIn></SignIn> :
    <VStack overflowY={"scroll"} spacing={4} p={8} width="600px" alignItems={"left"} >
        <CustomHeading header={"POST /auctions/list"} description={"Returns a list of the searcher's auctions. The category parameter determines the type of auctions to be queried. The cursor parameter is used for pagination."} isLoading={isLoading}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="green.500" header={"HTTP Request"} text={"POST https://oev.api3dev.com/api/auctions/list"}></InfoRow>
              <BidsListParams cursor={cursor} setCursor={setCursor} setSortDirection={setSortDirection} sortDirection={sortDirection}></BidsListParams>
              <ExecuteButton isDisabled={isLoading} onClick={() => getBidsList()} text={"POST"} ></ExecuteButton>
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