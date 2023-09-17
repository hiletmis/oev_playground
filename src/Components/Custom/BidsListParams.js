import React from "react";
import { Text, Box, Radio, RadioGroup, Stack, Flex, VStack, Input } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
  
const Hero = ({cursor, setCursor, setSortDirection, sortDirection}) => { 
  return (
    <VStack alignItems={"left"} >
        <Text fontWeight={"bold"} fontSize={"sm"}>Params</Text>
        <Box width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
            <VStack direction="column" align="left" m="1rem">
                    <Text fontWeight={"bold"} marginLeft={"2"} fontSize={"sm"}>Cursor</Text>
                    <Input value={cursor} onChange={(e) => setCursor(e.target.value)} placeholder="" fontSize={"md"} />
                    <Text fontWeight={"bold"} marginLeft={"2"} fontSize={"sm"}>Sort Direction</Text>

                    <Flex alignItems={"center"}>
                        <RadioGroup onChange={setSortDirection} value={sortDirection}>
                        <Stack direction='row'>
                        <Radio size={"sm"} value='asc'>ASC</Radio>
                        <Radio size={"sm"} value='desc'>DESC</Radio>
                        </Stack>
                        </RadioGroup>
                    </Flex>
            </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;





