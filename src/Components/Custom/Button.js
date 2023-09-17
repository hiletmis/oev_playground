import React from "react";
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const Hero = ({isDisabled, link, caption, height="40px", bgColor}) => { 
  return (
    <Link to={link} >
        <Button isDisabled={isDisabled} borderRadius={"10px"} bgColor={bgColor} color="white" size="sm" width={"100%"} height={height}>
        {caption}
        </Button>
    </Link>
  );
};

export default Hero;