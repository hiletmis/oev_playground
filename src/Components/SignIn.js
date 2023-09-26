import React from "react";
import { VStack, Heading, Flex, Spacer, Text, Image } from '@chakra-ui/react';

const Hero = () => {
  return (
    <VStack spacing={4} p={8} alignItems={"left"} >
      <Flex>
        <Heading size={"lg"}>Connect Wallet</Heading>
        <Spacer />
        <Image src={`/caution.svg`} width={"30px"} height={"30px"} />
      </Flex>
      <Text fontSize={"sm"}>Connect your wallet to continue.</Text>
    </VStack>
  );
};

export default Hero;