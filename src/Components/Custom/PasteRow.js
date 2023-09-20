import React from "react";
import { Text, Box, Flex, Spacer, VStack, Image } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

const Hero = ({title, text, setText, margin=0, color="white", bgColor=COLORS.main}) => { 
    

  const paste = () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(text => {setText(text)})
    } else {
      alert("Clipboard API not available");
    }
  }

  return (
    <VStack direction="row" align="left" m={margin}>
        <Text fontWeight={"bold"} fontSize={"md"}>{title}</Text>
        <Box p={2} width={"100%"}  borderRadius={"10"} bgColor={bgColor}  alignItems={"left"}>
        <Flex alignItems={"center"}>
        <Text noOfLines={1} width={"100%"} color={color} fontSize={"md"}>{text}</Text>
        <Spacer />
        <Image cursor={"pointer"} onClick={paste} src={`/paste.svg`} width={"30px"} height={"30px"} />
        </Flex>
        </Box>
    </VStack>
  );
};

export default Hero;


