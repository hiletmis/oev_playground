import React from "react";
import { Text, Image, Flex, Spacer, VStack, Box } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import { InfoIcon } from "@chakra-ui/icons";
import Popup from 'reactjs-popup';
import Heading from "./Heading";
import { CloseIcon } from "@chakra-ui/icons";

const Hero = ({header, text, margin="0", image=null, bgColor=COLORS.app, info=null}) => { 
  return (

    <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
    <VStack spacing={3} direction="row" align="left" m={margin}>
        <Flex>
        <Text fontWeight={"bold"}  fontSize={"md"}>{header}</Text>
          {info === null ? null : 
              <Popup trigger={<InfoIcon cursor={"pointer"} marginLeft={"2"} height={"24px"} />} modal>
              { close => (
                <VStack bgColor={COLORS.main} spacing={4} p={6} borderRadius="lg" boxShadow="lg" minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
                  <Flex alignItems={"center"}>
                  <Heading isLoading={false} description={""} header={header} ></Heading>
                    <Spacer />
                    <CloseIcon cursor={"pointer"} onClick={() => close()}></CloseIcon>
                  </Flex>

                  <Box width={"100%"} p={3} bgColor={COLORS.app} borderRadius={"10"}>
                    <Text fontSize={"md"}>{info}</Text>
                    </Box>
                  </VStack>
              )}
              </Popup>
          }
        <Spacer />
        {image == null ? null : <Image marginRight={"2"} src={image} width={"20px"} height={"20px"} />}
        <Text fontSize={"md"}>{text}</Text>
        </Flex>
    </VStack>
    </Box>
  );
};

export default Hero;