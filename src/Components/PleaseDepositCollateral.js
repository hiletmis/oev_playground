import React from "react";
import { VStack, Heading, Flex, Spacer, Text, Image } from '@chakra-ui/react';

const Hero = () => {
  return (
    <VStack spacing={4} alignItems={"left"} >
      <Flex>
        <Heading size={"lg"}>Deposit Collateral</Heading>
        <Spacer />
        <Image src={`/caution.svg`} width={"30px"} height={"30px"} />
      </Flex>
      <Text fontSize={"sm"}>Your wallet is registered as a searcher but you have not deposited any collateral.</Text>
        <Text fontSize={"sm"}>Please deposit collateral to start bidding.</Text>      
        <Text fontSize={"sm"}>If you have deposited recently please wait 2-3 minutes until deposit is processed.</Text>
    </VStack>
  );
};

export default Hero;