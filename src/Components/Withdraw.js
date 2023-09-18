import React, { useState, useEffect, useContext } from "react";
import { Grid } from 'react-loader-spinner'
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

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [items, setItems] = useState([]);
    const { multicall, setMulticall } = useContext(OevContext);
    const { chain } = useNetwork()

    useEffect(() => { 
        if (isSuccess) {
          localStorage.setItem('multicall', JSON.stringify(items));
        }
        }, [isSuccess, items]);
    
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('multicall'));
        if (!items) return
        const multicall = items.find(item => item.address === address && item.chain === chain.id) 
        if (multicall) {setMulticall(multicall.multicall)} else setMulticall(null)

        if (items) {
        setItems(items);
        }
    }, [address, chain.id, setMulticall]);

const deployMulticall = async () => { 

    
}
    
  return (
    <VStack spacing={4} p={8} width="600px" alignItems={"left"} >
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
