import { Text, Stack, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';

const Hero = ({dataFeed}) => { 
 
  return (
    <VStack alignItems={"left"} >
        <Text fontWeight={"bold"} fontSize={"md"}>Data Feed</Text>
        <Box p= "3" width={"100%"} height={"70px"} borderRadius={"10"} bgColor={COLORS.app}  alignItems={"left"}>
        <Flex className='box'>
          <Stack direction="column" spacing={"2"} width={"100%"}>
              <Stack direction="row" spacing={"2"} >
              <Stack visibility={!dataFeed ? "hidden" : "visible"} direction="row" spacing={"-2"}>
                  <Image src={dataFeed === null ? "" : `/coins/${dataFeed.p1}.webp`} fallbackSrc={`/coins/NA.webp`}  width={"24px"} height={"24px"} />
                  <Image src={dataFeed === null ? "" : `/coins/${dataFeed.p2}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
              </Stack>
              <Text fontSize="md" fontWeight="bold">{dataFeed === null ? "" : dataFeed.p1 + '/' + dataFeed.p2}</Text>
              <Spacer />
              </Stack>
              <Text width={"100%"} noOfLines={1} fontSize="xs">{dataFeed === null ? "" : dataFeed.beaconId}</Text>
          </Stack> 
          <Spacer />

        </Flex>
         </Box>
    </VStack>
  );
};

export default Hero;


