import React, { useState, useEffect, useContext } from "react";
import { OevContext } from '../OevContext';
import ExecuteButton from "./Custom/ExecuteButton";
import CustomHeading from "./Custom/Heading";

import {
  Button, Heading,
  VStack, Text, Box, Flex, Spacer
} from "@chakra-ui/react";

import { useAccount, useNetwork } from 'wagmi';

import { COLORS } from '../data/colors';

const DeployMulticall = () => {
    const { address } = useAccount()
    const { chain } = useNetwork()

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [items, setItems] = useState([]);


const deployMulticall = async () => { 

    
}
    
  return (
    <VStack spacing={4} p={8} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
        <CustomHeading header={"Withdrawal Request"} description={"Initiates a withdrawal from a designated prepayment depository contract and its associated chain ID. Be aware that the provided signature for withdrawal will only remain valid for a limited period."} isLoading={isLoading}></CustomHeading>
        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
            <VStack spacing={3} direction="row" align="left" m="1rem">
                <VStack spacing={4} w="100%">
                <ExecuteButton 
                    isDisabled={isLoading}
                    text={isLoading ? 'Requesting...' : 'Request Withdraw'}
                    onClick={deployMulticall}>
                </ExecuteButton>
                </VStack>
            </VStack>
        </Box> 
    </VStack>
  );
};

export default DeployMulticall;
