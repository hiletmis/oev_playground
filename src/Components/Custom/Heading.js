import React from "react";
import { Text, Heading, Flex, Spacer, VStack } from '@chakra-ui/react';
import { Grid } from 'react-loader-spinner'

const Hero = ({isLoading, header, description}) => { 
  return (
    <VStack alignItems={"left"} >
        <Flex>
            <Heading size={"lg"}>{header}</Heading> 
            <Spacer />
            <Grid height="40" width="40" radius="9" color="green" ariaLabel="loading" visible={isLoading}/>
        </Flex>
        <Text fontSize={"sm"}>{description}</Text>
    </VStack>
  );
};

export default Hero;


