import React from "react";
import { Text, Box, Flex, Spacer, VStack, Input} from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

const Hero = ({title, text, setText, margin=0}) => { 
  return (
    <VStack direction="row" align="left" m={margin}>
        <Text fontWeight={"bold"} fontSize={"md"}>{title}</Text>
        <Box p= "2" width={"100%"}  borderRadius={"10"} bgColor={COLORS.main}  alignItems={"center"}>
            <Flex className='box'>
                <Input type="number"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        size='md' />
                <Spacer />
            </Flex>
        </Box>
    </VStack>
  );
};

export default Hero;


