import React from "react";
import { VStack, Heading, Flex, Spacer, Text, Image } from '@chakra-ui/react';

const Hero = () => {

  return (
    <VStack spacing={4} p={8} alignItems={"left"} >
    <Flex>
      <Heading size={"lg"}>Welcome</Heading>
      <Spacer />
      <Image src={`/caution.svg`} width={"30px"} height={"30px"} />
    </Flex>

  <Text fontSize={"sm"}>Welcome to OEV Relay Playground.</Text>
    </VStack>


  );
};

export default Hero;