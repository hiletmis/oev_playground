import React from "react";
import { Text, Image, Flex, Spacer, VStack, Box } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

const Hero = ({header, text, margin=0, image=null, bgColor=COLORS.app}) => { 
  return (

    <Box width={"100%"} height="60px" bgColor={COLORS.main} borderRadius={"10"}>
    <VStack spacing={3} direction="row" align="left" m="1rem">
        <Flex>
        <Text 
        fontWeight={"bold"} 
        fontSize={"lg"}>
          {header}
          </Text>
        <Spacer />
        {
            image == null ? null : <Image marginRight={"2"} src={image} width={"24px"} height={"24px"} />
        }
        <Text fontWeight={"bold"} fontSize={"lg"}>{text}</Text>
        </Flex>
    </VStack>
    </Box>
  );
};

export default Hero;