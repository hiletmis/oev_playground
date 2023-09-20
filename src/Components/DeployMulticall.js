import React, { useState, useEffect, useContext } from "react";
import { OevContext } from '../OevContext';
import CopyInfoRow from './Custom/CopyInfoRow';
import ExecuteButton from './Custom/ExecuteButton';
import Heading from './Custom/Heading';

import {
  VStack, Box, Link
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { ethers, ContractFactory } from "ethers";
import { useAccount, useNetwork } from 'wagmi';

import { COLORS } from '../data/colors';
import OevSearcherMulticallV1 from "../Contracts/OevSearcherMulticallV1.json";

const DeployMulticall = () => {
    const { address, isConnected } = useAccount()

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [items, setItems] = useState([]);
    const { multicall, setMulticall } = useContext(OevContext);
    const { chain } = useNetwork()

    useEffect(() => { 
        if (isSuccess) {
          localStorage.setItem('multicall', JSON.stringify(items));
        }
        }, [isSuccess, items]);
    
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('multicall'));
        if (!items) return
        const multicall = items.find(item => item.address === address && item.chain === chain.id) 
        if (multicall) {setMulticall(multicall.multicall)} else setMulticall(null)

        if (items) {
        setItems(items);
        }
    }, [address, chain.id, setMulticall]);

const deployMulticall = async () => { 
    if (!isConnected) return
    let provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
    if (provider.getSigner == null) return
    setIsLoading(true)
    const factory = new ContractFactory(OevSearcherMulticallV1.abi, OevSearcherMulticallV1.bytecode, provider.getSigner())

    factory.connect(provider.getSigner()).deploy().then((contract) => {
      contract.deployTransaction.wait().then((receipt) => {
        setMulticall(contract.address)
        items.push( { address: address, chain: chain.id, multicall: contract.address})
        setIsLoading(false)
        setIsSuccess(true)
    }).catch((err) => {
        setIsLoading(false)
    })

    }).catch((err) => {
      console.log(err)
    })
}
    
  return (
    <VStack spacing={4} p={8} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
      <Heading isLoading={isLoading} header={"Deploy Multicall Contract"} description={"Deploy a multicall contract to update data feeds. Multicall contract address will be saved to your browser"}></Heading>
      <Box width={"100%"} height={"160px"} bgColor={COLORS.main} borderRadius={"10"}>
        <VStack spacing={3} direction="row" align="left" m="1rem">
          <CopyInfoRow header={"Multicall Contract"} text={multicall} />
          <Link visibility={!multicall ? 'hidden': 'visible'} href={chain.blockExplorers.default.url + '/address/' + multicall} isExternal>
            Show in explorer <ExternalLinkIcon mx='2px' />
          </Link>
        </VStack>
      </Box>  
      <ExecuteButton isDisabled={isLoading} onClick={() => deployMulticall()} text={ isLoading ? "Deploying" : "Deploy Multicall"}></ExecuteButton>
    </VStack>
  );
};

export default DeployMulticall;
