import React, {useContext, useState, useEffect } from "react";
import { VStack, Heading, Flex, Spacer, Image, Box } from '@chakra-ui/react';
import InfoRow from './Custom/InfoRow';
import { OevContext } from '../OevContext';
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS } from "../data/getContracts";
import { useAccount, useSignMessage } from "wagmi";
import { Grid } from 'react-loader-spinner'

const Hero = ({isCollapsed}) => {
    const {address, isConnected} = useAccount()
    const [payload, setPayload] = useState(null);
    const [request, setRequest] = useState(null);
    const [isLoadingSign, setIsLoadingSign] = useState(false);

    const {searcher, setSearcher, setWallet } = useContext(OevContext);

    const postMessage = async ({ payload, endpoint }) => {
        setRequest(payload);
        const response = await fetch('https://oev.api3dev.com/api/' + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const data = await response.json()
        setWallet(address)
        setIsLoadingSign(false)

        if (response.status === 200) {
            localStorage.setItem(address, JSON.stringify(payload));
            setSearcher(data)
        } 
    }

    const { signMessage } = useSignMessage({
        onSuccess: (signature) => {
            payload.signature = signature;
            postMessage({ payload: payload, endpoint: "status" });
        }
    })

    const getStatus = () => {
        setIsLoadingSign(true)

        if (request) {
            if (new Date(request.validUntil) > Date.now()) {
                postMessage({ payload: request, endpoint: "status" });
            return;
            }
        }

        const validUntil = new Date();
        validUntil.setMinutes(validUntil.getMinutes() + 60);
        let payload = {
            searcherAddress: address,
            validUntil: validUntil,
            prepaymentDepositoryChainId: 11155111,
            prepaymentDepositoryAddress: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
            requestType: 'API3 OEV Relay, status',
        }

        setPayload(payload);
        const sorted = JSON.stringify(payload, Object.keys(payload).sort());

        if (request == null) {
            signMessage({ message: sorted });
            return
        }
    
        if (request.validUntil > Date.now()) {
            postMessage({ payload: request, endpoint: "status" })
        } else {
            signMessage({ message: sorted });
        }
    }

    const formatFunds = (funds) => {
        return funds / 10 ** 6 + " USDC";
    }

    useEffect(() => {
        setRequest(JSON.parse(localStorage.getItem(address)));
    }, [address]);

  return (
    isConnected === false ? null :
    searcher === null ? null :
    isCollapsed ?
    <Flex>
    <Grid height="20" width="20" radius="9" color="green" ariaLabel="loading" visible={isLoadingSign}/>
    <Image marginLeft={"2"} cursor={"pointer"} onClick={()=> {getStatus()}} src={'/refresh.svg'} fallback={'/caution.svg'} width={"20px"} height={"20px"} />
    </Flex>
    :
    <VStack spacing={2} p={1} alignItems={"left"} >
    <Flex>
      <Heading size={"md"}>Searcher Status</Heading>
      <Spacer />
      <Grid height="20" width="20" radius="9" color="green" ariaLabel="loading" visible={isLoadingSign}/>
      <Image marginLeft={"2"} cursor={"pointer"} onClick={()=> {getStatus()}} src={'/refresh.svg'} fallback={'/caution.svg'} width={"20px"} height={"20px"} />
    </Flex>
    <Box>
        <InfoRow header={"Available Funds"} text={formatFunds(searcher.availableFunds)}></InfoRow>
        <InfoRow header={"Withdrawal Reserved Funds"} text={formatFunds(searcher.withdrawalReservedFunds)}></InfoRow>
        <InfoRow header={"Bid Reserved Funds"} text={formatFunds(searcher.bidReservedFunds)}></InfoRow>
        <InfoRow header={"API3 Fee Funds"} text={formatFunds(searcher.api3FeeFunds)}></InfoRow>
        <InfoRow header={"Slashed Funds"} text={formatFunds(searcher.slashedFunds)}></InfoRow>
    </Box>
    </VStack>


  );
};

export default Hero;