import React, { useRef} from "react";
import SignIn from './SignIn';
import { useNetwork, useSwitchNetwork} from "wagmi";
import { Grid } from 'react-loader-spinner'
import ScrollableFeed from 'react-scrollable-feed'
import { CheckIcon } from '@chakra-ui/icons'

import {
    Heading,
    VStack, Text, Flex, Spacer, Box, Stack, Image,
  } from "@chakra-ui/react";
import { COLORS } from "../data/colors";

import {
    arbitrumGoerli,
    avalancheFuji,
    bscTestnet,
    fantomTestnet,
    gnosisChiado,
    moonbaseAlpha,
    optimismGoerli,
    polygonMumbai,
    polygonZkEvmTestnet,
    zkSyncTestnet,
    sepolia
  } from 'wagmi/chains';


const Hero = () => {
    const { chain } = useNetwork()

    const { switchNetwork, isLoading } = useSwitchNetwork()

    const ref = useRef(null);

    let networks = [ 
        arbitrumGoerli,
        avalancheFuji,
        bscTestnet,
        fantomTestnet,
        gnosisChiado,
        moonbaseAlpha,
        optimismGoerli,
        polygonMumbai,
        polygonZkEvmTestnet,
        zkSyncTestnet,
        sepolia
    ]

    const switchChain = (id) => {
        if (isLoading) return
        switchNetwork?.(id)
    }
        
  return (
    chain == null ? <SignIn></SignIn> : 
        <VStack spacing={4} p={8} width="500px" height={"100%"} alignItems={"left"} >
            <Flex>
                <Heading size={"lg"}>Select a Network</Heading> 
                <Spacer />
                <Grid height="40" width="40" radius="9" color="green" ariaLabel="loading" visible={isLoading}/>
            </Flex>
        <Text fontSize={"sm"}>List of networks that supported by Nodary OEV Relay. 
        <p></p>Select a network to deploy data feed proxy and start bidding an update!</Text>
        <ScrollableFeed
          forceScroll={false}
          onScrollComplete={() => {
            ref.current.scrollIntoView();
           }           
        }>
        {networks.map((item, i) => {
          return (
            <Box className='dataFeedItem' ref={i === 0 ? ref : null} key={i} p={3} shadow="md" margin={"3"} borderWidth="px" flex="1" borderRadius={"10"} bgColor={COLORS.main}
            onClick={() => switchChain(item.id)}>
                <Stack direction="row" spacing={"2"} width={"100%"}>
                <Flex>
                    <Image marginRight={2} src={'./chainIcons/' + item.id + '.svg'} width={"24px"} height={"24px"} />
                    <Text fontSize="md" fontWeight="bold">{item.name}</Text>
                </Flex>
                <Spacer />
                <CheckIcon height={"24px"} visibility={ item.id === chain.id ? "visible" : "hidden"}></CheckIcon>

                </Stack>
            </Box>
          );
        })}
      </ScrollableFeed>

      </VStack>    
  );
};

export default Hero;