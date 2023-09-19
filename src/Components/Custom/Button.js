import React from "react";
import { Link } from 'react-router-dom';
import { Button, Box, Flex } from '@chakra-ui/react';
import { COLORS } from "../../data/colors";

const Hero = ({isDisabled, link, caption, height="40px", bgColor, isCollapsed = false}) => { 
  return (
    <Link to={link} >
      <Flex>
        {
          isCollapsed 
          ? <Box bgColor={isDisabled ? COLORS.buttonDisabled : COLORS.button} borderRadius={"10px"} width={"50px"} height={"50px"} marginRight={"2"}></Box>
          : <Button isDisabled={isDisabled} borderRadius={"10px"} bgColor={bgColor} color="white" size="sm" width={"100%"} height={height}>
              {caption}
          </Button>
}
      </Flex>

    </Link>
  );
};

export default Hero;