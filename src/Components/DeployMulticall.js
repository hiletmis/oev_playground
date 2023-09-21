import React, { useState, useEffect, useContext } from "react";
import { OevContext } from '../OevContext';
import CopyInfoRow from './Custom/CopyInfoRow';
import ExecuteButton from './Custom/ExecuteButton';
import Heading from './Custom/Heading';
import { MULTICALL_FACTORY_ABI, MULTICALL_FACTORY } from '../data/abi';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractRead, useAccount, useNetwork, usePublicClient } from 'wagmi';

import { VStack, Box, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { COLORS } from '../data/colors';

const DeployMulticall = () => {
    const { address, isConnected } = useAccount()
    const { chain } = useNetwork()
    const [chainId, setChainId] = useState(chain != null ? chain.id : 0);
    const [isDeployable, setIsDeployable] = useState(false);
    const [bytecodeCheck, setBytecodeCheck] = useState(false);
 
    const publicClient = usePublicClient();
  
    const { multicall, setMulticall } = useContext(OevContext);
 
    const { config } = usePrepareContractWrite({
      address: MULTICALL_FACTORY(chainId),
      abi: MULTICALL_FACTORY_ABI,
      functionName: 'deployDeterministicMulticallV1', 
      enabled: isDeployable,
      args: [],
    })
  
    const { data, write } = useContractWrite(config)
  
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });
   
    const oevSearcherMulticallV1Address = useContractRead({
          address: MULTICALL_FACTORY(chainId),
          abi: MULTICALL_FACTORY_ABI,
          functionName: 'computeOevSearcherMulticallV1AddressZk',
          enabled: multicall == null,
          args: [address],
        }, 
    )

    useEffect(() => {
      setChainId(chain != null ? chain.id : 0);
    }, [chain]);

    useEffect(() => {
      if (isSuccess) {
        console.log("multicall", data)
      }
    }, [isSuccess, data]);


    useEffect(() => {
      if (bytecodeCheck) return
      if (multicall != null) return
      if (oevSearcherMulticallV1Address !== null) {  
        if (oevSearcherMulticallV1Address.data == null) return
        console.log("oevSearcherMulticallV1Address", oevSearcherMulticallV1Address.data)

        publicClient.getBytecode({
          address: oevSearcherMulticallV1Address.data,
          blockTag: 'latest',
        }).then((bytecode) => {
          setBytecodeCheck(true)
          setIsDeployable(bytecode == null)
          console.log("bytecode", "updatable", bytecode == null)
          if (bytecode != null) {
            setBytecodeCheck(false)
            setMulticall(oevSearcherMulticallV1Address.data)
          }
        }).catch((error) => {
          setBytecodeCheck(false)
        })
      }
    }, [bytecodeCheck, multicall, oevSearcherMulticallV1Address, publicClient, setMulticall]);

const deployMulticall = async () => { 
    if (!isConnected) return
    write?.()
}
    
  return (
    <VStack spacing={4} p={8} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
      <Heading isLoading={isLoading} header={"Deploy Multicall Contract"} description={"Deploy a multicall contract to update data feeds. Multicall contracts are deterministic wallets. You will only need to deploy it once on each blockchain you want to make a bid. "}></Heading>
      <Box width={"100%"} height={"160px"} bgColor={COLORS.main} borderRadius={"10"}>
        <VStack spacing={3} direction="row" align="left" m="1rem">
          <CopyInfoRow header={"Multicall Contract"} text={multicall} />
          <Link visibility={!multicall ? 'hidden': 'visible'} href={chain.blockExplorers.default.url + '/address/' + multicall} isExternal>
            Show in explorer <ExternalLinkIcon mx='2px' />
          </Link>
        </VStack>
      </Box>  
      <ExecuteButton isDisabled={isLoading || !isDeployable } onClick={() => deployMulticall()} text={ isLoading ? "Deploying" : "Deploy Multicall"}></ExecuteButton>
    </VStack>
  );
};

export default DeployMulticall;
