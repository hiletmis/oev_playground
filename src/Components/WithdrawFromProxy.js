import { VStack, Flex, Stack, Text, Image, Box } from '@chakra-ui/react';
import TransactionHash from './Custom/TransactionHash';
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi';
import { isWrongNetwork } from "./Helpers/Utils";
import SignIn from "./SignIn";
import WrongNetwork from "./WrongNetwork";
import Heading from "./Custom/Heading";
import { COLORS } from '../data/colors';
import { OevContext } from '../OevContext';
import { useContext, useState, useEffect } from "react";
import CopyInfoRow from "./Custom/CopyInfoRow";
import ExecuteButton from "./Custom/ExecuteButton";
import { API3SERVERV1_ABI } from "../data/abi";
import { API3SERVERV1 } from "../data/getContracts";
import { ethers } from 'ethers';
import DeployProxy from './DeployProxy';

const Hero = () => {

  const { chain } = useNetwork()
  const { contextDataFeed, contextProxyAddress } = useContext(OevContext);

  const [dataFeed, setDataFeed] = useState(null)
  const [isWithdrawReady, setIsWithdrawReady] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [proxyHasBalance, setProxyHasBalance] = useState(false);
  const [balance, setBalance] = useState("");
  const [txHash, setTxHash] = useState(null);

  const { data: proxyBalance } = useContractRead({
    address: API3SERVERV1(chainId),
    abi: API3SERVERV1_ABI,
    functionName: 'oevProxyToBalance',
    args: [contextProxyAddress],
    enabled: contextProxyAddress != null,
})

  const { config } = usePrepareContractWrite({
    address: API3SERVERV1(chainId),
    abi: API3SERVERV1_ABI,
    functionName: 'withdraw',
    enabled: isWithdrawReady,
    args: [contextProxyAddress],
  })

  const { data, write } = useContractWrite(config)

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
        setIsWithdrawReady(false);
        setProxyHasBalance(false);
        setTxHash(data.hash);
    }

  });

  const withdraw = () => {
    write?.();
  }

  useEffect(() => {
    if (proxyBalance === null) return
    if (chain == null) return

    setIsWithdrawReady(proxyBalance > 0);
    setProxyHasBalance(proxyBalance > 0);

    try {
        const eth = ethers.utils.formatUnits(proxyBalance, 18)
        setBalance(eth + " " + chain.nativeCurrency.symbol);
    } catch (error) {
        setBalance("0 " + chain.nativeCurrency.symbol);
    }

  }, [chain, proxyBalance]);

  useEffect(() => {
    setChainId(chain != null ? chain.id : 0);
  }, [chain]);

  useEffect(() => {
    if (contextDataFeed.length > 0) {
      setDataFeed(contextDataFeed[0]);
      setTxHash(null);
    }
    
  }, [contextDataFeed, dataFeed]);

  return (
    chain == null ? <SignIn></SignIn> :
    isWrongNetwork(chain) ? <WrongNetwork></WrongNetwork> :
    contextProxyAddress == null ? <DeployProxy></DeployProxy> :
    dataFeed == null ? null:
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"} alignItems={"left"} >
      <Heading isLoading={isLoading } description={"Withdraw the OEV proceedings from the proxy to the beneficiary."} header={"Withdraw"} ></Heading>

      <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
      <VStack spacing={3} direction="row" align="left" m="1rem">
      <Text fontWeight={"bold"} fontSize={"md"}>Data Feed</Text>
        <Box p= "3" width={"100%"}  borderRadius={"10"} bgColor={COLORS.app}  alignItems={"center"}>
        <Flex className='box'>
        <Stack direction="column" spacing={"2"}>
            <Stack direction="row" spacing={"2"}>
            <Stack direction="row" spacing={"1"}>
                <Image src={`/coins/${dataFeed.p1}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
                <Image src={`/coins/${dataFeed.p2}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
            </Stack>
            <Text fontSize="md" fontWeight="bold">{dataFeed.p1 + '/' + dataFeed.p2}</Text>
            </Stack>
            </Stack>
        </Flex>
        </Box>
        <CopyInfoRow header={"Proxy Address"} text={contextProxyAddress}></CopyInfoRow>
        <CopyInfoRow header={"Proxy Balance"} text={balance} copyEnabled={false}></CopyInfoRow>
        <TransactionHash chain={chain} txHash={txHash}></TransactionHash>


        </VStack>
        </Box>

        <ExecuteButton isDisabled={contextProxyAddress === null || isLoading || !proxyHasBalance || !isWithdrawReady } link="/withdraw" onClick={() => {withdraw()}} text={ isLoading ? "Withdrawing..." : "Withdraw"} />

    </VStack>
  );
};

export default Hero;