import React from "react";
import { Text, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import { OevContext } from '../../OevContext';
import { useContext } from "react";

import {
    NumberInput,
    NumberInputField,
  } from '@chakra-ui/react'
  
const Hero = ({ethAmount, ethBalance, chain, setEthAmount, title="Bid Amount", image, bgColor=COLORS.app}) => {

  const { collapsed } = useContext(OevContext);

  return (
    chain == null ? null :
    <VStack alignItems={"left"} >
        <Text fontWeight={"bold"} fontSize={"md"}>{title}</Text>
        <Box width={"100%"}  bgColor={bgColor} borderRadius={"10"}>
            <VStack spacing={3} direction="row" align="left" m="1rem">
                <Flex>
                    <NumberInput value={ethAmount} step={1} min={0} size={"lg"} onChange={(valueString) => setEthAmount(valueString)}>
                    <NumberInputField borderWidth={"0px"} focusBorderColor={"red.200"} placeholder="0.0" fontSize={"4xl"} />
                    </NumberInput>
                    <Spacer />
                    <Image marginRight={2} src={image == null ?'/chainIcons/' + chain.id + '.svg' : image} width={"40px"} height={"40px"} />
                </Flex>
                <Flex>
                  {
                    collapsed ? null :
                    <Text 
                    color={parseFloat(ethBalance) < parseFloat(ethAmount) ? "red.500" : "white"}
                    fontWeight={"bold"} 
                    fontSize={"sm"}>
                    {parseFloat(ethBalance) < parseFloat(ethAmount)  ? "Insufficient Balance" : chain.nativeCurrency.name + " Balance"}
                    </Text>
                  }

                    <Spacer />
                    <Image src={'/wallet.svg'} width={"40px"} height={"20px"} />
                    <Text fontSize={"sm"}>{ethBalance}</Text>
                </Flex>
            </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;


