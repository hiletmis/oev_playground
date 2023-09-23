import React from "react";
import { VStack, Heading, Flex, Spacer, Text } from '@chakra-ui/react';
import LevelSelector from './Custom/LevelSelector';       
import WrongNetwork from './WrongNetwork';
import { useNetwork } from "wagmi";
import { isWrongNetwork } from "./Helpers/Utils";

const Hero = () => {
  const { chain } = useNetwork()

  return (
    isWrongNetwork(chain) ? <WrongNetwork></WrongNetwork> :
    <VStack spacing={4} p={8} alignItems={"left"} >
      <Flex>
        <Heading size={"lg"}>Welcome</Heading>
        <Spacer />
      </Flex>
      <Text fontSize={"sm"}>Welcome to OEV Relay Playground.</Text>
      <LevelSelector />
    </VStack>
  );
};

export default Hero;