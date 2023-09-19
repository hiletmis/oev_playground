import React from "react";
import { Button, Text, Box, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

const Hero = ({header, text, margin=0}) => { 
  return (
    <VStack direction="row" align="left" m={margin}>
        <Text fontWeight={"bold"} fontSize={"md"}>{header}</Text>                
        <Box p= "2" width={"100%"} bgColor={COLORS.app} borderRadius={"10"} alignItems={"center"}>
            <Flex className='box'>
                <Text noOfLines={1} fontSize={"md"}>{text}</Text>
                <Spacer />
                <Button 
                    onClick={() => {
                    navigator.clipboard.writeText(text)
                    }}
                >Copy</Button>
            </Flex>
        </Box>
    </VStack>
  );
};

export default Hero;