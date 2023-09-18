import React from "react";
import { Flex, VStack } from '@chakra-ui/react';
import { Box, Text, Image } from "@chakra-ui/react"
import { COLORS } from '../../data/colors';

const Hero = ({onClick, bgColor, description, icon}) => { 
  return (
    <VStack onClick={onClick} cursor={"pointer"} spacing={0} direction="row" align="left">
    <Box p={"1"} borderRadius={"10"} alignItems={"center"} bgColor={COLORS.main} width={"150px"} height={"150px"}>
        <Flex justify={"center"} bgColor={bgColor} width={"100%"} height={"100%"} borderRadius={"10"} alignItems={"center"}>
          <Image src={icon} width={"70px"} height={"70px"} />
        </Flex>
    </Box>
    <Box p={"1"} borderRadius={"10"} alignItems={"center"} bgColor={COLORS.main} width={"150px"} height={"50px"}>
        <Flex justify={"center"} bgColor={bgColor} width={"100%"} height={"100%"} borderRadius={"10"} alignItems={"center"}>
            <Text fontSize={"md"}>{description}</Text>
        </Flex>
    </Box>
    </VStack>
  );
};

export default Hero;






