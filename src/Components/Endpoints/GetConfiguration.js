import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import { GetConfiguration } from "../Helpers/Endpoints";

import CustomHeading from "../Custom/Heading";

import {
  JsonTree
} from 'react-editable-json-tree'

import {
  VStack, Text, Box
} from "@chakra-ui/react";


const Hero = () => {
  const { chain } = useNetwork()

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = () => {
    setIsLoading(true);
    GetConfiguration({setResponse, setError});
  };

  useEffect(() => {
    setIsLoading(false);
  }, [response, error]);


  return (
    chain == null ? <SignIn></SignIn> :
    <VStack overflowY={"scroll"} spacing={4} p={8} width="600px" alignItems={"left"} >
        <CustomHeading header={"GET /configuration"} description={"Returns the present values of settings that are determined by relay operators for every distinct OEV proxy. It is essential for searchers to frequently observe these values to ensure compliance with the OEV relay guidelines."} isLoading={isLoading}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="blue.500" header={"HTTP Request"} text={"GET https://oev.api3dev.com/api/configuration"}></InfoRow>
              <ExecuteButton onClick={handleClick} text={"GET"} ></ExecuteButton>
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