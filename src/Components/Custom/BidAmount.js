import React from "react";
import { Text, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

import {
    NumberInput,
    NumberInputField,
    NumberInputStepper
  } from '@chakra-ui/react'
  
const Hero = ({ethAmount, ethBalance, chain, setEthAmount}) => { 
  return (
    <VStack alignItems={"left"} >
        <Text fontWeight={"bold"} fontSize={"md"}>Bid Amount</Text>
        <Box width={"100%"} height="120px" bgColor={COLORS.app} borderRadius={"10"}>
            <VStack spacing={3} direction="row" align="left" m="1rem">
                <Flex>
                    <NumberInput value={ethAmount} step={1} min={0} size={"lg"} onChange={(valueString) => setEthAmount(valueString)}>
                    <NumberInputField borderWidth={"0px"} focusBorderColor={"red.200"} placeholder="0.0" fontSize={"4xl"} inputMode="numeric"/><NumberInputStepper></NumberInputStepper>
                    </NumberInput>
                    <Spacer />
                    <Image marginRight={2} src={'./chainIcons/' + chain.id + '.svg'} width={"40px"} height={"40px"} />
                </Flex>
                <Flex>
                    <Text 
                    color={parseFloat(ethBalance) < parseFloat(ethAmount) ? "red.500" : "white"}
                    fontWeight={"bold"} 
                    fontSize={"md"}>
                    {parseFloat(ethBalance) < parseFloat(ethAmount)  ? "Insufficient Balance" : chain.nativeCurrency.name + " Balance"}
                    </Text>
                    <Spacer />
                    <Image src={'/wallet.svg'} width={"40px"} height={"24px"} />
                    <Text fontWeight={"bold"} fontSize={"md"}>{ethBalance}</Text>
                </Flex>
            </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;


