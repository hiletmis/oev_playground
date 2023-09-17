import React from "react";
import { Text, Box, VStack, Input } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
  
const Hero = ({id, setBidId, paramName}) => { 
  return (
    <VStack alignItems={"left"} >
        <Text fontWeight={"bold"} fontSize={"sm"}>Params</Text>
        <Box width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
            <VStack direction="column" align="left" m="1rem">
                    <Text fontWeight={"bold"} marginLeft={"2"} fontSize={"sm"}>{paramName}</Text>
                    <Input value={id} onChange={(e) => setBidId(e.target.value)} placeholder="" fontSize={"md"} />
            </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;





