import React from "react";
import { Text, Heading, Flex, Spacer, VStack } from '@chakra-ui/react';
import { Grid } from 'react-loader-spinner'

const Hero = ({isLoading, header, description}) => { 
  return (
    <VStack alignItems={"left"} >
        <Flex>
            <Heading size={"lg"}>{header}</Heading> 
            <Spacer />
            <Grid height="30px" width="30px" radius="9" color="green" ariaLabel="loading" visible={isLoading}/>
        </Flex>
        <Text fontSize={"sm"}>{description}</Text>
    </VStack>
  );
};

export default Hero;


