import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork, useSignMessage, useAccount } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import { PostWithdrawalsList, POST } from "../Helpers/Endpoints";
import { Flex, Spacer, Image } from "@chakra-ui/react";
import { saveToLocalStorage } from "../Helpers/Utils";
import { useNavigate } from "react-router-dom";

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

  const [lastRequest, setLastRequest] = useState({});

  const navigate = useNavigate();

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
    POST({ payload: params, endpoint:"withdrawals/list", setResponse, setError});
  }

  const getBidsList = () => {
    setIsLoading(true);
    if (request != null) {
      handleClick(request)
      return
    }
    PostWithdrawalsList({address, setPayload, setMessage});
  }

  useEffect(() => {
    setIsLoading(false);

    if (response == null) return;
    if (response.withdrawals == null) return;
    setLastRequest(response.withdrawals[response.withdrawals.length - 1]);
  }, [response, error]);


  useEffect(() => {
    if (payload == null) return;
    if (message == null) return;
    if (signMessage == null) return;

    signMessage({message: message});
  }, [payload, message, signMessage]);

  const handleExport = () => {
    saveToLocalStorage("withdrawInfo", lastRequest)
    navigate("/prepayment/depository")
  }

  return (
    chain == null ? <SignIn></SignIn> :
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
        <CustomHeading header={"POST /withdrawals/list"} description={"Returns a list of the searcher's auctions. The category parameter determines the type of auctions to be queried. The cursor parameter is used for pagination."} isLoading={isLoading}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="green.500" header={"HTTP Request"} text={"POST https://oev.api3dev.com/api/withdrawals/list"}></InfoRow>
              <ExecuteButton isDisabled={isLoading} onClick={() => getBidsList()} text={"POST"} ></ExecuteButton>
          </VStack>
        </Box>
        {response == null ? null :
                <Box cursor={"pointer"} width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
                <VStack spacing={3} direction="row" align="left" m="1rem">
                <Flex className='box'>
                  <Text fontWeight={"bold"} fontSize={"sm"}>Response</Text>  
                    <Spacer />
                    <Image marginLeft={"3"} cursor={"pointer"} onClick={() => handleExport()} src={`/export.svg`} width={"24px"} height={"24px"} />
                  </Flex>  
                  <JsonTree readOnly={true} data={response} />             
                </VStack>
                </Box>
        }
    </VStack>
  );
};

export default Hero;