
import React from "react";
import { Box, Text } from '@chakra-ui/react';

const Hero = ({color, label, action = () => {}, visibility = true}) => { 
  return (
    <Box visibility={visibility} cursor={action !== {} ? "pointer" : ""} onClick={action} paddingLeft={2} paddingRight={2} borderRadius={"10"} bgColor={color} height={5} >
        <Text fontWeight={"bold"} fontSize="xs">{label}</Text>
    </Box>
  );
};

export default Hero;



