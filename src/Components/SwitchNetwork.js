import {useContext} from "react";
import { VStack, Heading, Flex, Spacer, Text, Box, Image, Stack, Button} from '@chakra-ui/react';
import { COLORS } from '../data/colors';
import { OevContext } from '../OevContext';
import { useNetwork, useSwitchNetwork } from "wagmi";
import SignIn from './SignIn';
import Welcome from './Welcome';

const Hero = () => {

    const { chain } = useNetwork()
    const { switchNetwork, isLoading } = useSwitchNetwork()
    
    const { searcher, wallet } = useContext(OevContext);

    const switchChain = () => {
      if (isLoading) return
      switchNetwork?.(11155111)
    }

  return (
    chain == null ? <SignIn></SignIn> :
    wallet === null || searcher == null ? <Welcome></Welcome> : 
  <VStack spacing={4} p={8} width={"600px"} alignItems={"left"} >
    <Flex>
      <Heading size={"lg"}>Switch Network</Heading>
      <Spacer />
      <Image src={`/caution.svg`} width={"30px"} height={"30px"} />
    </Flex>

  <Text fontSize={"sm"}>Prepayment depository contract is deployed on Ethereum Sepolia network. Please switch to Ethereum Sepolia network to proceed adding collateral funds.</Text>

  <Box width={"100%"} height="85px" bgColor={COLORS.main} borderRadius={"10"}>
    <VStack spacing={3} direction="row" align="left" m="1rem">
    <Flex>
    <Spacer />

    <Image src={`/chainIcons/${chain == null ? 1 : chain.id}.svg`} width={"50px"} height={"50px"} />
    <Spacer />
    <Image src={`/switch.svg`} width={"50px"} height={"50px"} />
    <Spacer />
    <Image src={`/chainIcons/11155111.svg`} width={"50px"} height={"50px"} />
    <Spacer />

    </Flex>
    </VStack>
    </Box>
    <Stack alignItems={"center"} >
      <Button
        borderColor="gray.500"
        borderWidth="1px"
        color="white"
        size="md"
        minWidth={"200px"}
        isDisabled={isLoading || chain?.id === 11155111}
        onClick={switchChain}
      >
        {isLoading ? "Switching" : "Switch Network"}
      </Button>
      </Stack>
    </VStack>
  );
};

export default Hero;