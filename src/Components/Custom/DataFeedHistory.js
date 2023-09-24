import React from "react";
import { Text, Stack, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import ColoredLabel from '../Custom/ColoredLabel';

const Hero = ({dataFeed, data}) => { 

  return (
    <VStack alignItems={"left"} >
        <Box p= "1" width={"100%"} borderRadius={"10"} bgColor={COLORS.app}  alignItems={"left"}>
        <Flex className='box'>
          <Stack direction="column" spacing={"2"} width={"100%"}>
              <Stack direction="row" spacing={"2"} >
              <Stack visibility={!dataFeed ? "hidden" : "visible"} direction="row" spacing={"-2"}>
                  <Image src={dataFeed === null ? "" : `/coins/${dataFeed.p1}.webp`} fallbackSrc={`/coins/NA.webp`}  width={"24px"} height={"24px"} />
                  <Image src={dataFeed === null ? "" : `/coins/${dataFeed.p2}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
              </Stack>
              <Text fontSize="md" fontWeight="bold">{dataFeed === null ? "" : dataFeed.p1 + '/' + dataFeed.p2}</Text>
              <Spacer />
              <ColoredLabel color={"blue.500"} label={String(data[0])} />
              <ColoredLabel color={"green.500"} label={data[1]} /> 
              </Stack>
          </Stack> 
          <Spacer />

        </Flex>
         </Box>
    </VStack>
  );
};

export default Hero;


