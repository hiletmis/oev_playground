import {useContext, useEffect, useState} from "react";
import SignIn from '../SignIn';
import Welcome from '../Welcome';
import { useNetwork, useSignMessage, useAccount } from "wagmi";
import { OevContext } from '../../OevContext';
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import { PostWithdrawalsRequest, POST } from "../Helpers/Endpoints";

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
    POST({ payload: params, endpoint:"/withdrawals/request", setResponse, setError});
  }

  const getStatus = () => {
    setIsLoading(true);
    if (request != null) {
      handleClick(request)
      return
    }
    PostWithdrawalsRequest({address, setPayload, setMessage});
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


  return (
    chain == null ? <SignIn></SignIn> :
    searcher == null ? <Welcome></Welcome> : 
    <VStack overflowY={"scroll"} spacing={4} p={8} width="600px" alignItems={"left"} >
        <CustomHeading header={"POST /withdrawals/request"} description={"Initiates a withdrawal from a designated prepayment depository contract and its associated chain ID. Be aware that the provided signature for withdrawal will only remain valid for a limited period."} isLoading={isLoading}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="green.500" header={"HTTP Request"} text={"POST https://oev.api3dev.com/api/withdrawals/request"}></InfoRow>
              <ExecuteButton isDisabled={isLoading} onClick={() => getStatus()} text={"POST"} ></ExecuteButton>
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