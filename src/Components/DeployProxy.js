import React, { useState, useEffect, useContext } from 'react';
import { VStack, Button, Text, Image, Flex, Spacer, Box, Stack } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers';
import { useContractWrite, useWaitForTransaction, useAccount, useNetwork, usePublicClient } from 'wagmi';
import { ABI, CONTRACT_ADDRESS } from '../data/abi';
import DataFeedList from './DataFeedList';
import { computeDataFeedProxyWithOevAddress } from '@api3/contracts'; 
import { OevContext } from '../OevContext';
import { COLORS } from '../data/colors';
import SignIn from './SignIn';
import Welcome from './Welcome';
import CopyInfoRow from './Custom/CopyInfoRow';
import PasteRow from './Custom/PasteRow';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import Heading from './Custom/Heading';
import ExecuteButton from './Custom/ExecuteButton';
import { isWrongNetwork } from './Helpers/Utils';
import WrongNetwork from './WrongNetwork';

const Commit = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const publicClient = usePublicClient();

  const [dataFeedId, setDataFeedId] = useState('');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState(isConnected ? address : '');
  const [proxyAddress, setProxyAddress] = useState('');
  const [contractExists, setContractExists] = useState(false);
  const [contractDeployed, setContractDeployed] = useState(false);
  const [contractRegistered, setContractRegistered] = useState(false);
  const [contractRegisteredAddress, setContractRegisteredAddress] = useState(false);
  const [dataFeed, setDataFeed] = useState(null);
  const [chainId, setChainId] = useState(chain != null ? chain.id : 0);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [isDataFeedListOpen, setIsDataFeedListOpen] = useState(false);

  const { setContextProxyAddress } = useContext(OevContext);
  const { contextDataFeed, setContextDataFeed, searcher } = useContext(OevContext);

  const { data, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_ADDRESS(chainId),
    abi: ABI,
    functionName: 'deployDataFeedProxyWithOev',
    args: [
      dataFeedId,
      beneficiaryAddress,
      '0x',
    ], 
    enabled: !contractExists && !contractDeployed && !contractRegistered,
    onError: (error) => {
      setContractDeployed(false);
    }
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const deployProxy = () => {
      if (contractDeployed || contractExists) {
        setContractRegisteredAddress(true);
      } else {
        write?.();
      }
  }

  const isDeployDisabled = () => {
    return  (contractDeployed || contractExists)
      ? (contractRegistered || !validateDataFeedId(dataFeedId) || !validateAddress(beneficiaryAddress))
      : !dataFeedId || !validateAddress(beneficiaryAddress) || isLoading || (contractExists && validateDataFeedId(dataFeedId))
  }

  const removeDataFeed = () => {
    setContractRegistered(false);
    setContractRegisteredAddress(true);
    setContextDataFeed([]);
    setContextProxyAddress(null);
    setDataFeed(null);
    setDataFeedId('');
    setProxyAddress('');
  }
 
  useEffect(() => {
    if (isConnected) {
      setBeneficiaryAddress(address);
    } else {
      setBeneficiaryAddress('');
      setDataFeed(null);
    }
  }, [address, isConnected]);

  useEffect(() => {
    setChainId(chain != null ? chain.id : 0);
  }, [chain]);

  useEffect(() => {
    if (isSuccess) {
      setContractDeployed(true);
    }

  }, [isSuccess]);

  useEffect(() => {
    if (proxyAddress === '') {
      setContractExists(false);
      return
    }

    publicClient.getBytecode({
      address: proxyAddress,
      blockTag: 'latest',
    }).then((code) => {
      if (code !== '0x' && code !== '0x0' && code !== undefined) {
        setContractExists(true);
      }
    })
  },[publicClient, proxyAddress])

  useEffect(() => {
    setContractExists(false);
    setContractDeployed(false);
    setContractRegistered(false);
    setContractRegisteredAddress(false);

    if (validateDataFeedId(dataFeedId) && validateAddress(beneficiaryAddress)) {
      setProxyAddress(computeDataFeedProxyWithOevAddress(chainId, dataFeedId, beneficiaryAddress, '0x'));
    }
    
  }, [beneficiaryAddress, dataFeedId, chainId])

  useEffect(() => {
    setIsAddressValid(validateAddress(beneficiaryAddress));
  }, [beneficiaryAddress])

  useEffect(() => {
    setDataFeed(dataFeed);
    setDataFeedId(dataFeed?.beaconId);
    setIsDataFeedListOpen(false);
  }, [dataFeed])

  useEffect(() => {
    if (proxyAddress !== '' && validateDataFeedId(dataFeedId) && validateAddress(beneficiaryAddress)) {

      fetch('https://proxy.api3dev.com/proxy/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proxyAddress: proxyAddress,
          dataFeedId: dataFeedId,
          beneficiaryAddress: beneficiaryAddress,
          chainId: chainId,
        }),
      }).then((response) => response.json())
        .then((data) => {
          setContractRegistered(data.proxyRegisted);

          if (data.proxyRegisted) {
            setContextDataFeed([dataFeed]);
            setContextProxyAddress(proxyAddress);
          } else {
            setContextDataFeed([]);
            setContextProxyAddress(null);
          }
        })
        .catch((error) => {
        });
    }
  }, [beneficiaryAddress, dataFeedId, proxyAddress, chainId, setContextDataFeed, dataFeed, setContextProxyAddress]);

  useEffect(() => {
    if (contractRegisteredAddress && proxyAddress !== '' && validateDataFeedId(dataFeedId) && validateAddress(beneficiaryAddress)) {

      fetch('https://proxy.api3dev.com/proxy/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proxyAddress: proxyAddress,
          dataFeedId: dataFeedId,
          beneficiaryAddress: beneficiaryAddress,
          chainId: chainId,
        }),
      }).then((response) => response.json())

        .then((data) => {
          setContractRegisteredAddress(false);
          setContractRegistered(data.proxyRegisted);
          setContextDataFeed([dataFeed]);
          setContextProxyAddress(proxyAddress);
        })
    }
  }, [beneficiaryAddress, contractRegistered, contractRegisteredAddress, dataFeedId, proxyAddress, chainId, setContextDataFeed, dataFeed, setContextProxyAddress]);


  useEffect(() => {
    if (contextDataFeed.length > 0) {
      setDataFeed(contextDataFeed[0]);
      setDataFeedId(contextDataFeed[0]?.beaconId);
    }
    
  }, [contextDataFeed, dataFeed]);

  return (
    chain == null ? <SignIn></SignIn> :
    isWrongNetwork(chain) ? <WrongNetwork></WrongNetwork> :
    searcher === null ? <Welcome></Welcome> : 
    
<VStack spacing={4} p={8} minWidth={"350px"} maxWidth={"700px"} alignItems={"left"} >
  <Heading isLoading={isLoading} description={""} header={"Deploy Proxy"} ></Heading>

      <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>

      <VStack spacing={3} direction="row" align="left" m="1rem">
        <PasteRow title={"Beneficiary Address"} text={beneficiaryAddress} color={isAddressValid ? "white" : "red.500"} bgColor={COLORS.app} setText={setBeneficiaryAddress}></PasteRow>
        <Text fontWeight={"bold"} fontSize={"md"}>Data Feed</Text>
        <Box p= "3" width={"100%"}  borderRadius={"10"} bgColor={COLORS.app}  alignItems={"center"}>
        <Flex alignItems={isDataFeedListOpen ? "top" : "center"} className='box'>

        <Stack direction="column" spacing={"2"} width={"80%"}>
          { isDataFeedListOpen ? <DataFeedList stateChanger={setDataFeed}/> :
            <Stack direction="row" spacing={"2"} >
              <Stack visibility={!dataFeed ? "hidden" : "visible"} direction="row" spacing={"-2"}>
                <Image src={dataFeed === null ? "" : `/coins/${dataFeed.p1}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
                <Image src={dataFeed === null ? "" : `/coins/${dataFeed.p2}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
              </Stack>
            <Text fontSize="md" fontWeight="bold">{dataFeed === null ? "" : dataFeed.p1 + '/' + dataFeed.p2}</Text>
            </Stack>
          }
          <Text width={"100%"} noOfLines={1} fontSize="xs">{dataFeed === null ? "" : dataFeed.beaconId}</Text>
        </Stack>
        <Spacer />
          {contractRegistered 
          ? <Button onClick={ removeDataFeed }>X</Button> 
          : isDataFeedListOpen ? <TriangleUpIcon width={"24px"} height={"24px"} onClick={() => {setIsDataFeedListOpen(false)}}></TriangleUpIcon> : <TriangleDownIcon width={"24px"} height={"24px"} onClick={() => {setIsDataFeedListOpen(true)}}/>
          }
        </Flex>
      </Box>

      { contractDeployed || contractExists ?

        <VStack spacing={3} alignItems={"left"} >
        <CopyInfoRow header={"Proxy Address"} text={proxyAddress}></CopyInfoRow>

        <Flex>
        <Text fontWeight={"bold"} fontSize={"sm"}>Contract Exists</Text>
          <Spacer />
          {(contractExists || contractDeployed) ? <CheckIcon/> : <CloseIcon />} 
        </Flex>

        <Flex>
        <Text fontWeight={"bold"} fontSize={"sm"}>Contract Registered</Text>
          <Spacer />
          {(contractRegistered) ? <CheckIcon/> : <CloseIcon />} 

        </Flex>
        </VStack>
        : null
      }

        </VStack>
      </Box>
    
      <ExecuteButton isDisabled={isDeployDisabled()} onClick={() => deployProxy()} text={ ((contractExists || contractDeployed ) ? (isLoading ? 'Registering...' : 'Register Proxy') : isLoading ? 'Deploying...' : 'Deploy Proxy' )}></ExecuteButton>            
  </VStack>
  );
};

function validateAddress(address) {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch (e) {
    return false;
  }
}

function validateDataFeedId(dataFeedId) {
  try {
    if (dataFeedId.length !== 66) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}


export default Commit;