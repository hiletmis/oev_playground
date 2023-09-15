import React from "react";
import { Button, VStack } from '@chakra-ui/react';

const Hero = ({isDisabled, onClick, text}) => { 
  return (
<VStack spacing={4} w="100%">
      <Button
        borderColor="gray.500"
        borderWidth="1px"
        color="white"
        size="md"
        minWidth={"200px"}
        isDisabled={isDisabled}
        onClick={onClick}
      >
      {text}
      </Button>
    </VStack>
  );
};

export default Hero;