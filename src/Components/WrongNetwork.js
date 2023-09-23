import React from "react";
import { VStack, Heading, Flex, Spacer, Text, Image } from '@chakra-ui/react';

const Hero = () => {
  return (
    <VStack spacing={4} p={8} alignItems={"left"} >
      <Flex>
        <Heading size={"lg"}>Wrong Network</Heading>
        <Spacer />
        <Image src={`/caution.svg`} width={"30px"} height={"30px"} />
      </Flex>
      <Text fontSize={"sm"}>Please change network to one of the supported networks.</Text>
      <Text fontSize={"sm"}>Supported networks are: Ethereum Sepolia, Binance Smart Chain Testnet, Polygon Mumbai Testnet.</Text>
    </VStack>
  );
};

export default Hero;