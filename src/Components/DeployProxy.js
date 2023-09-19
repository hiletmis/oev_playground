import React, { useState, useEffect, useContext } from 'react';
import { Heading, VStack, Button, Text, Image, Flex, Spacer, Box, Stack } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers';
import { useContractWrite, useWaitForTransaction, useAccount, useNetwork, usePublicClient } from 'wagmi';
import { ABI, CONTRACT_ADDRESS } from '../data/abi';
import DataFeedList from './DataFeedList';
import { Grid } from 'react-loader-spinner'
import { computeDataFeedProxyWithOevAddress } from '@api3/contracts'; 
import { OevContext } from '../OevContext';
import { COLORS } from '../data/colors';
import SignIn from './SignIn';
import Welcome from './Welcome';
import CopyInfoRow from './Custom/CopyInfoRow';

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
    setDataFeed(dataFeed);
    setDataFeedId(dataFeed?.beaconId);
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
    searcher === null ? <Welcome></Welcome> : 
<VStack spacing={4} p={8} width={"600px"} alignItems={"left"} >
      <Flex>
      <Heading size={"lg"}>Deploy Proxy</Heading>
        <Spacer />
        <Grid
  height="40"
  width="40"
  radius="9"
  color="green"
  ariaLabel="loading"
  visible={isLoading}
  />
      </Flex>

      <Box width={"100%"} height={contractExists || contractDeployed ? "410px" : "250px"} bgColor={COLORS.main} borderRadius={"10"}>

      <VStack spacing={3} direction="row" align="left" m="1rem">
        <Text fontWeight={"bold"} fontSize={"md"}>Beneficiary Address</Text>
        <Box p= "2" width={"100%"}  borderRadius={"10"} bgColor={COLORS.app}  alignItems={"center"}>
        <Flex className='box'>
          <Text fontSize={"md"}>{beneficiaryAddress}</Text>
          <Spacer />
          <Button 
            isDisabled={!isConnected}
            onClick={() => {
              navigator.clipboard.readText()
              .then(text => {
                setBeneficiaryAddress(validateAddress(text) ? text : beneficiaryAddress);
              })
            }}
          >Paste</Button>
        </Flex>
        </Box>
        <Text fontWeight={"bold"} fontSize={"md"}>Data Feed</Text>
        <Box p= "3" width={"100%"} height={"70px"} borderRadius={"10"} bgColor={COLORS.app}  alignItems={"center"}>
        <Flex className='box'>

        <Stack direction="column" spacing={"2"} width={"75%"}>
              <Stack direction="row" spacing={"2"} >
                <Stack visibility={!dataFeed ? "hidden" : "visible"} direction="row" spacing={"-2"}>
                  <Image zIndex={2} src={dataFeed === null ? "" : `/coins/${dataFeed.p1}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
                  <Image zIndex={1} src={dataFeed === null ? "" : `/coins/${dataFeed.p2}.webp`} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
                </Stack>
                <Text fontSize="md" fontWeight="bold">{dataFeed === null ? "" : dataFeed.p1 + '/' + dataFeed.p2}</Text>
            
                <Box visibility={"hidden"} paddingLeft={2} paddingRight={2} borderRadius={"10"} bgColor={COLORS.info} height={5} >
                <Text fontSize="xs">Deployed</Text>
                </Box>
                <Box visibility={"hidden"} paddingLeft={2} paddingRight={2} borderRadius={"10"} bgColor={COLORS.info} height={5} >
                <Text fontSize="xs">Registered</Text>
                </Box>
              </Stack>
              <Text width={"100%"} noOfLines={1} fontSize="xs">{dataFeed === null ? "" : dataFeed.beaconId}</Text>
            </Stack>

          <Spacer />
           {contractRegistered ? <Button onClick={ removeDataFeed }>X</Button> : <DataFeedList stateChanger={setDataFeed}/>} 
        </Flex>
          </Box>

        <VStack spacing={3} alignItems={"left"} visibility={(contractDeployed || contractExists) ? "visible" : "hidden"} >

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
        </VStack>
      </Box>
    
      <Stack alignItems={"center"} >
      <Button
        borderColor="gray.500"
        borderWidth="1px"
        color="white"
        size="md"
        minWidth={"200px"}
        visibility={contractRegistered ? "hidden" : "visible"}
        isDisabled= { 
          (contractDeployed || contractExists)
          ? (contractRegistered || !validateDataFeedId(dataFeedId) || !validateAddress(beneficiaryAddress))
          : !dataFeedId || !validateAddress(beneficiaryAddress) || isLoading || (contractExists && validateDataFeedId(dataFeedId))
        }
        onClick={() => {
          if (contractDeployed || contractExists) {
            setContractRegisteredAddress(true);
          } else {
            write?.();
          }

        }}
      >
      { ((contractExists || contractDeployed ) ? (isLoading ? 'Registering...' : 'Register Proxy') : isLoading ? 'Deploying...' : 'Deploy Proxy' )}
      </Button>
      </Stack>
            
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