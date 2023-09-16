import React, {useContext, useEffect, useState} from "react";
import { VStack, Heading, Flex, Spacer, Image, Box, Text } from '@chakra-ui/react';
import InfoRow from './Custom/InfoRow';
import { OevContext } from '../OevContext';
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS } from "../data/abi";
import { useAccount, useSignMessage } from "wagmi";
import { Grid } from 'react-loader-spinner'

const Hero = () => {
    const {address} = useAccount()
    const [payload, setPayload] = useState(null);
    const [info, setInfo] = useState("Click the refresh icon to get your status");
    const [request , setRequest] = useState(null);
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
            setSearcher(data)
        } else {
            setInfo("Please deposit funds to prepayment depository contract to register as a searcher. After depositing funds, click the refresh icon to get your status. Usually it takes 1-2 minutes to register as a searcher. You can use the testUSDC faucet to get test funds.")
        }
    }

    const { signMessage } = useSignMessage({
        onSuccess: (signature) => {
            payload.signature = signature;
            postMessage({ payload: payload, endpoint: "status" });
        }
    })

    const getStatus = () => {
        const validUntil = new Date();
        validUntil.setMinutes(validUntil.getMinutes() + 5);
        setIsLoadingSign(true)
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
        setRequest(null);
        setInfo("Click the refresh icon to get your status");
    }, [address]);

  return (
    <VStack spacing={2} p={1} alignItems={"left"} >
    <Flex>
      <Heading size={"md"}>User Status</Heading>
      <Spacer />
      <Grid height="20" width="20" radius="9" color="green" ariaLabel="loading" visible={isLoadingSign}/>
      <Image marginLeft={"2"} cursor={"pointer"} onClick={()=> {getStatus()}} src={'refresh.svg'} width={"20px"} height={"20px"} />
    </Flex>
    {
        searcher === null
        ? <Text fontSize={"sm"}>{info}</Text>
        : <Box>
                <InfoRow header={"Available Funds"} text={formatFunds(searcher.availableFunds)}></InfoRow>
                <InfoRow header={"Withdrawal Reserved Funds"} text={formatFunds(searcher.withdrawalReservedFunds)}></InfoRow>
                <InfoRow header={"Bid Reserved Funds"} text={formatFunds(searcher.bidReservedFunds)}></InfoRow>
                <InfoRow header={"API3 Fee Funds"} text={formatFunds(searcher.api3FeeFunds)}></InfoRow>
                <InfoRow header={"Slashed Funds"} text={formatFunds(searcher.slashedFunds)}></InfoRow>
        </Box>
    }
    </VStack>


  );
};

export default Hero;