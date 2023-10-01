import { useState, useEffect } from "react";
import Faucet from '../Faucet';
import Popup from 'reactjs-popup';
import { Button, Box, Flex, VStack, NumberInput, NumberInputField, Spacer, Image, Text } from '@chakra-ui/react';
import { COLORS } from "../../data/colors";
import { useNetwork, useBalance, useAccount } from "wagmi";

import { TOKEN_CONTRACT_ADDRESS } from "../../data/getContracts";

const Hero = ({ setTokenAmount, setTokenBalance, tokenAmount, tokenBalance, bgColor=COLORS.main }) => { 
    const { chain } = useNetwork()
    const { address } = useAccount()

    const [refreshBalance, setRefreshBalance] = useState(false);

    useBalance({
    address: address,
    token: TOKEN_CONTRACT_ADDRESS,
    chainId: 11155111,
    enabled: refreshBalance,
    onSuccess: (data) => {
        if (data.formatted == null) return
        setTokenBalance(data.formatted)
    }
  })

  useEffect(() => {
    setRefreshBalance(true)
  }, [chain]);

  useEffect(() => {
    if (refreshBalance) {
      setRefreshBalance(false)
    }
  }, [refreshBalance]);

  return (
    <Box width={"100%"} height="120px" bgColor={bgColor} borderRadius={"10"}>
    <VStack spacing={3} direction="row" align="left" m="1rem">
    <Flex>
    <NumberInput  value={tokenAmount} step={1} min={0} size={"lg"} onChange={(valueString) => {setTokenAmount(valueString)}}><NumberInputField borderWidth={"0px"} focusBorderColor={"red.200"} placeholder="0.0" fontSize={"4xl"} inputMode="numeric"/></NumberInput>
    <Spacer />
    <Image src={`/coins/USD.webp`} width={"40px"} height={"40px"} />
    </Flex>

      <Flex>
      <Text 
      color={parseFloat(tokenBalance) < parseFloat(tokenAmount) ? "red.500" : "white"}
      fontWeight={"bold"} 
      visibility={tokenBalance === "0" ? "hidden" : "visible"}
      fontSize={"sm"}>
        {parseFloat(tokenBalance) < parseFloat(tokenAmount)  ? "Insufficient Balance" : "Token Balance"}
        </Text>
      <Spacer />
      <Image src={tokenBalance === "0" ? '/getToken.svg' : '/wallet.svg'} width={"40px"} height={"20px"} />
      <Text onClick={() => {
        setTokenAmount(tokenBalance)
      }} fontSize={"sm"}>{tokenBalance === "0" 
      ? 
      <Popup
      trigger={<Button height={"30px"} width={"130px"} bgColor={"transparent"}>Get TestnetUSDC</Button> }
      modal>
      { close => (<Faucet stateChanger={close} refreshBalance={close}></Faucet>)  }
      </Popup>
      : tokenBalance}</Text>
      <Image cursor={"pointer"} src={'/refresh.svg'} width={"40px"} height={"20px"} onClick={() => {setRefreshBalance(true)}} />
      </Flex>

      </VStack>
      </Box>
  );
};

export default Hero;