import React from "react";
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const Hero = ({isDisabled, link, caption}) => { 
  return (
    <Link to={link} >
        <Button isDisabled={isDisabled} borderRadius={"10px"} color="white" size="sm" width={"100%"} height={"50px"}>
        {caption}
        </Button>
    </Link>
  );
};

export default Hero;