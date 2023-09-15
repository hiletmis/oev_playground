import React, {useEffect, useState} from "react";
import { Text, Stack, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import NodaryFeed from '../Helpers/GetFeed';
import { ethers } from "ethers";

const Hero = ({dataFeed}) => { 

  const [beaconData, setBeaconData] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (price == null && dataFeed != null) {
      NodaryFeed({ dataFeedId: dataFeed.beaconId, setBeaconData: setBeaconData})
    }
  }, [dataFeed, price]);

  useEffect(() => {
    if (beaconData) {
      const decodedValue = ethers.utils.defaultAbiCoder.decode(
        ["int256"],
        beaconData.encodedValue
      );
      setPrice("$ " + (decodedValue / 1e18).toFixed(3));
    } else {
      console.log("No data found for the specified hashKey");
    }
  }, [beaconData]);

  return (
    <VStack alignItems={"left"} >
        <Text fontWeight={"bold"} fontSize={"md"}>Data Feed</Text>
        <Box p= "3" width={"100%"} height={"70px"} borderRadius={"10"} bgColor={COLORS.app}  alignItems={"left"}>
        <Flex className='box'>
          <Stack direction="column" spacing={"2"} width={"100%"}>
              <Stack direction="row" spacing={"2"} >
              <Stack visibility={!dataFeed ? "hidden" : "visible"} direction="row" spacing={"-2"}>
                  <Image zIndex={2} src={dataFeed === null ? "" : `https://market.api3.org/images/asset-logos/${dataFeed.p1}.webp`} width={"24px"} height={"24px"} />
                  <Image zIndex={1} src={dataFeed === null ? "" : `https://market.api3.org/images/asset-logos/${dataFeed.p2}.webp`} width={"24px"} height={"24px"} />
              </Stack>
              <Text fontSize="md" fontWeight="bold">{dataFeed === null ? "" : dataFeed.p1 + '/' + dataFeed.p2}</Text>
              <Spacer />
              <Text fontSize="md" fontWeight="bold">{dataFeed === null ? "" : price}</Text>

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


