import React from "react";
import { Text, Box, Flex, Spacer, VStack, Button } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

const Hero = ({title, text, setText, margin=0, color="white"}) => { 
    
  return (
    <VStack direction="row" align="left" m={margin}>
        <Text fontWeight={"bold"} fontSize={"md"}>{title}</Text>
        <Box p= "2" width={"100%"}  borderRadius={"10"} bgColor={COLORS.main}  alignItems={"center"}>
        <Flex className='box'>
        <Text noOfLines={1} width={"400px"} color={color} fontSize={"md"}>{text}</Text>
        <Spacer />
        <Button 
            onClick={() => {
            navigator.clipboard.readText()
            .then(text => {setText(text)})
            }}
        >Paste</Button>
        </Flex>
        </Box>
    </VStack>
  );
};

export default Hero;


