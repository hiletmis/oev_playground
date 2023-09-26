import React, {useContext, useEffect, useState} from "react";
import { VStack } from '@chakra-ui/react';
import { OevContext } from '../../OevContext';
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS } from "../../data/abi";
import { useAccount, useSignMessage } from "wagmi";
import { COLORS } from '../../data/colors';
import Heading from "./Heading";
import ExecuteButton from "./ExecuteButton";

const Hero = ({isCollapsed}) => {
    const {address, isConnected} = useAccount()
    const [payload, setPayload] = useState(null);
    const [info, setInfo] = useState("");
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
            setInfo("Appearently you are not registered as a searcher. Please deposit funds to prepayment depository contract to register as a searcher. After depositing funds, check your status again. After 5 confirmations your deposit will be confirmed. Usually it takes 1-2 minutes to fulfill the confirmations. You can use the testUSDC faucet to get test funds.")
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
        validUntil.setMinutes(validUntil.getMinutes() + 30);
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

    useEffect(() => {
        setRequest(null);
        setInfo("You need to be registered as a searcher to use OEV Relay playground. Please check if your wallet is a searcher account.");
    }, [address]);

  return (
    isConnected === false ? null :
    searcher !== null ? null : 
    <VStack width={"100%"} bgColor={COLORS.caution} borderRadius={"10"} spacing={4} p={8} alignItems={"left"} >
        <Heading size={"lg"} header={"Searcher status"} description={info} isLoading={isLoadingSign}/>
        <ExecuteButton onClick={() => getStatus()} isLoading={isLoadingSign} text={"Check Status"} />
    </VStack>
  );
};

export default Hero;