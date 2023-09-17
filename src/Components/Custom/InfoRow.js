import React from "react";
import { Text, Box, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

const Hero = ({header, text, margin=0, bgColor=COLORS.app}) => { 
  return (
    <VStack direction="row" align="left" m={margin}>
        <Text fontWeight={"bold"} fontSize={"sm"}>{header}</Text>                
        <Box p= "1" width={"100%"} bgColor={bgColor} borderRadius={"10"} alignItems={"center"}>
            <Flex className='box'>
                <Text marginLeft={"2"} fontSize={"xs"}>{text}</Text>
                <Spacer />
            </Flex>
        </Box>
    </VStack>
  );
};

export default Hero;