import React from "react";
import { Button, VStack } from '@chakra-ui/react';

const Hero = ({isDisabled, onClick, text, minWidth="100px", height="40px"}) => { 
  return (
<VStack spacing={2}>
      <Button
        borderColor="gray.500"
        borderWidth="1px"
        color="white"
        size="xs"
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