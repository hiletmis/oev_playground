import React from "react";
import { Button, VStack } from '@chakra-ui/react';

const Hero = ({isDisabled, onClick, text, minWidth="200px", height="50px"}) => { 
  return (
<VStack spacing={4} w="100%">
      <Button
        borderColor="gray.500"
        borderWidth="1px"
        color="white"
        size="md"
        height={height}
        minWidth={minWidth}
        isDisabled={isDisabled}
        onClick={() => {onClick()}}
      >
      {text}
      </Button>
    </VStack>
  );
};

export default Hero;