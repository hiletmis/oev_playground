import React from "react";
import { Text, Image, Flex, Spacer, VStack, Box } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

const Hero = ({header, text, margin="2", image=null, bgColor=COLORS.app}) => { 
  return (

    <Box width={"100%"} height={"35px"} bgColor={COLORS.main} borderRadius={"10"}>
    <VStack spacing={3} direction="row" align="left" m={margin}>
        <Flex>
        <Text 
        marginLeft={"2px"}
        fontWeight={"bold"} 
        fontSize={"sm"}>
          {header}
          </Text>
        <Spacer />
        {
            image == null ? null : <Image marginRight={"2"} src={image} width={"20px"} height={"20px"} />
        }
        <Text fontSize={"sm"}>{text}</Text>
        </Flex>
    </VStack>
    </Box>
  );
};

export default Hero;