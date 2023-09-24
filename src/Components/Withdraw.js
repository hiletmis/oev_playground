import { useEffect, useState, useContext } from "react";
import SignIn from './SignIn';
import WrongNetwork from './WrongNetwork';
import { useNetwork, useSignMessage, useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from "wagmi";
import { COLORS } from '../data/colors';
import ExecuteButton from "./Custom/ExecuteButton";
import { PostWithdrawalsRequest, PostWithdrawalsList, PostStatus, POST } from "./Helpers/Endpoints";
import { isWrongNetwork } from "./Helpers/Utils";
import InfoRow from "./Custom/InfoRow";
import { OevContext } from '../OevContext';
import InfoBox from "./Custom/InfoBox";
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS, PREPAYMENT_DEPOSIT_ABI } from "../data/abi";

import Heading from "./Custom/Heading";

import {
  VStack, Box, Text, Flex, Spacer, Image
} from "@chakra-ui/react";

const Withdraw = () => {

  const {address} = useAccount()
  const { chain } = useNetwork()

  const [payload, setPayload] = useState(null);
  const [message, setMessage] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [withdrawals, setWithdrawalsList] = useState([]);
  const [isLoadingRequest, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(null);

  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [expirationTimestamp, setExpirationTimestamp] = useState(0);
  const [signature, setSignature] = useState("");
  const [withdrawalSigner, setWithdrawalSigner] = useState("");
  const [isWithdrawReady, setIsWithdrawReady] = useState(false);

  const [requestList] = useState([]);

  const { searcher, setSearcher } = useContext(OevContext);

  const { signMessage } = useSignMessage({
    onSuccess: (signature) => {
        payload.signature = signature;
        setPayload(null);
        setMessage(null);
        handleClick(payload)
    },
    onError: (error) => {
      setIsLoading(false);
    },
  })

  const { config } = usePrepareContractWrite({
    address: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
    abi: PREPAYMENT_DEPOSIT_ABI,
    functionName: 'withdraw',
    enabled: isWithdrawReady,
    args: [withdrawAmount, expirationTimestamp, withdrawalSigner, signature],
  })

  const { data, write } = useContractWrite(config)

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });

  const setArgs = (params) => {
    if (new Date(parseInt(params.expirationTimestamp) * 1000) < Date.now()) {
      alert("You can't withdraw funds after expiration date");
      return;
    }

    if (params.status === "FINALIZED") {
      alert("Withdrawal is already finalized");
      return;
    }

    if (requestList.includes(params.signature)) {
      alert("You already requested this withdrawal");
      return;
    }

    setWithdrawAmount(params.amount);
    setExpirationTimestamp(params.expirationTimestamp);
    setWithdrawalSigner(params.signer);
    setSignature(params.signature);
    setIsWithdrawReady(true);
  }

  const handleClick = (params) => {
    POST({ payload: params, endpoint:endpoint, setResponse, setError});
  }

  const withdrawalRequest = () => {
    setEndpoint("withdrawals/request")
    PostWithdrawalsRequest({address, setPayload, setMessage});
  }

  const getWithdrawalList = () => {
    setEndpoint("withdrawals/list")
    PostWithdrawalsList({address, setPayload, setMessage});
  }

  const refreshStatus = () => {
    setEndpoint("status")
    PostStatus({address, setPayload, setMessage});
  }

  useEffect(() => {
    if (payload == null) return;
    if (message == null) return;
    if (signMessage == null) return;

    signMessage({message: message});
  }, [payload, message, signMessage]);

  const formatFunds = (funds) => {
    return funds / 10 ** 6 + " USDC";
  }

  useEffect(() => {
    setIsLoading(false);
    if (response == null) return;

    if (endpoint === "withdrawals/list") {
      setWithdrawalsList(response.withdrawals.reverse())
    }

    if (endpoint === "withdrawals/request") {
      setEndpoint("status")
      PostStatus({address, setPayload, setMessage});
    }

    if (endpoint === "status") {
      setSearcher(response)
    }
  
    setResponse(null);
  }, [response, error, endpoint, setSearcher, address]);

  useEffect(() => {
    if (write == null || write === undefined) return
    if (isWithdrawReady) {
      requestList.push(signature)
      setIsWithdrawReady(false)
      write?.()
    }
  }, [isWithdrawReady, requestList, signature, write]);

  return (
    chain == null ? <SignIn></SignIn> :
    isWrongNetwork(chain) ? <WrongNetwork></WrongNetwork> :
    searcher == null ? null :
    <VStack alignItems={"left"} >
          <Flex alignItems={"center"}>
          <Heading isLoading={isLoadingRequest || isLoading} description={"You will need to wait 1-2 minutes before your requests confirmed"} header={"Deposited Collateral"} ></Heading>
          <Spacer />
          <Image onClick={() => {refreshStatus()}} cursor={"pointer"} src={`/refresh.svg`} fallbackSrc="/caution.svg" width={"40px"} height={"40px"} />
          </Flex>
            <Flex direction="row" align="left">
              <InfoBox header={"Available funds"} text={formatFunds(searcher.availableFunds)} ></InfoBox>
              { searcher.availableFunds === '0' ? null :
                <Box width={"200px"} borderRadius={"10"} marginLeft={"2"} bgColor={COLORS.main}>
                  <ExecuteButton minWidth="180px" height="35px" onClick={() => withdrawalRequest()} text={"Request Withdraw"} isLoading={isLoadingRequest}></ExecuteButton>
                </Box>}
            </Flex>

            <VStack direction="column" align="left">
            <Flex direction="row" align="left">
            <InfoBox header={"Withdrawable funds"} text={formatFunds(searcher.withdrawalReservedFunds)} ></InfoBox>
              { searcher.withdrawalReservedFunds === '0' ? null :
                <Box width={"200px"} borderRadius={"10"} marginLeft={"2"} bgColor={COLORS.main}>
                  <ExecuteButton minWidth="180px" height="35px" onClick={() => getWithdrawalList()} text={"Get Withdrawals"} isLoading={isLoadingRequest}></ExecuteButton>
                </Box>}
            </Flex>
              { withdrawals.length === 0 ? null :
              <VStack p={2} borderRadius={"10px"} direction="row" align="left" bgColor={COLORS.main} m="0" >
                <Flex p={2} direction="row" alignItems={"center"} justify={"space-between"} borderRadius={"10"} bgColor={COLORS.table}>
                  <Text fontSize={"md"} fontWeight={"bold"}>Amount</Text>  
                  <Text fontSize={"md"} fontWeight={"bold"}>Expiration Date</Text>  
                  <Text fontSize={"md"} fontWeight={"bold"}>Status</Text>
                </Flex>
                <VStack  align="left" maxHeight={"440px"} overflow={"scroll"}>

                {
                  withdrawals.map((item, i) => {
                    return (
                      <Flex p={2} cursor={"pointer"} onClick={() => {setArgs(item)}} direction="row" alignItems={"center"} justify={"space-between"} borderRadius={"10"} bgColor={COLORS.app}>
                      <Text fontSize={"xs"}  >{formatFunds(item.amount)}</Text>  
                        <Text fontSize={"xs"}>{new Date(parseInt(item.expirationTimestamp) * 1000 ).toLocaleString()}</Text>  
                        <Text fontSize={"xs"}>{ new Date(parseInt(item.expirationTimestamp) * 1000) > Date.now() ? item.status : "EXPIRED" }</Text>
                      </Flex>
                    )
                  })
                }
                </VStack>
              </VStack>
              }
            </VStack>

            <Flex justify={"space-between"}>
              <InfoRow header={"Bid reserved funds"} text={formatFunds(searcher.bidReservedFunds)} bgColor={COLORS.main} margin={"1"}></InfoRow>
              <InfoRow header={"API3 fee funds"} text={formatFunds(searcher.api3FeeFunds)} bgColor={COLORS.main} margin={"1"}></InfoRow>
              <InfoRow header={"Slashed funds"} text={formatFunds(searcher.slashedFunds)} bgColor={COLORS.main} margin={"1"}></InfoRow>
            </Flex>
            
            <Box width={"100%"} height="60px" borderRadius={"10"}></Box>
    </VStack>
  );
};

export default Withdraw;
