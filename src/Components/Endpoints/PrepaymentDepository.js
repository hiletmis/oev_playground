import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork, useContractWrite, useWaitForTransaction } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import PasteRow from "../Custom/PasteRow";
import { PREPAYMENT_DEPOSIT_ABI, PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS } from "../../data/abi";

import TransactionHash from "../Custom/TransactionHash";
import ErrorRow from "../Custom/ErrorRow";

import CustomHeading from "../Custom/Heading";

import {
  VStack, Box
} from "@chakra-ui/react";


const Hero = () => {
  const { chain } = useNetwork()

  const [amount, setAmount] = useState("");
  const [expirationTimestamp, setExpirationTimestamp] = useState("");
  const [withdrawalSigner, setWithdrawalSigner] = useState("");
  const [signature, setSignature] = useState("");

  const [args, setArgs] = useState([]);

  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);


  const [user, setUser] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [v, setV] = useState("");
  const [r, setR] = useState("");
  const [s, setS] = useState("");

  const [argsDeposit, setArgsDeposit] = useState([]);

  const [txHashDeposit, setTxHashDeposit] = useState(null);
  const [errorDeposit, setErrorDeposit] = useState(null);



  const { data, write } = useContractWrite({
    address: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
    abi: PREPAYMENT_DEPOSIT_ABI,
    functionName: 'withdraw',
    enabled: args.length === 4,
    args: args,
    onSuccess: (data) => {
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    }
  })
  
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
    enabled: write != null,
    onSuccess: () => {
      setTxHash(data?.hash);
      setError(null);
    }
  });

  useEffect(() => {
    setArgs([amount, expirationTimestamp, withdrawalSigner, signature]);
  }, [amount, expirationTimestamp, withdrawalSigner, signature]);


  const { data: dataDeposit, write: writeDeposit } = useContractWrite({
    address: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
    abi: PREPAYMENT_DEPOSIT_ABI,
    functionName: 'applyPermitAndDeposit',
    chainId: 11155111,
    enabled: argsDeposit.length === 6,
    args: argsDeposit,
    onSuccess: (data) => {
      setErrorDeposit(null);
    },
    onError: (error) => {
      setErrorDeposit(error.message);
    }
  })

  const { isLoading: isLoadingDeposit } = useWaitForTransaction({
    hash: dataDeposit?.hash,
    confirmations: 1,
    onSuccess: () => {
      setTxHashDeposit(dataDeposit.hash);
      setErrorDeposit(null);
    }
  });

  useEffect(() => {
    setArgsDeposit([user, tokenAmount, deadline, v, r, s]);
  }, [user, tokenAmount, deadline, v, r, s]);

 

  const deposit = () => {
    writeDeposit?.()
  }

  const withdraw = () => {
    write();
  }


  return (
    chain == null ? <SignIn></SignIn> :
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
        <CustomHeading header={"Prepayment Depository"} description={"Searchers utilize PrepaymentDepository contract to deposit and/or withdraw collateral"} isLoading={isLoading || isLoadingDeposit}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="orange.500" header={"Function"} text={"applyPermitAndDeposit"}></InfoRow>

              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={user} setText={setUser} title={"User"}></PasteRow>
              </Box>
              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={tokenAmount} setText={setTokenAmount} title={"Amount"}></PasteRow>
              </Box>
              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={deadline} setText={setDeadline} title={"Deadline"}></PasteRow>
              </Box>
              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={v} setText={setV} title={"v"}></PasteRow>
              </Box>
              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={r} setText={setR} title={"r"}></PasteRow>
              </Box>
              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={s} setText={setS} title={"s"}></PasteRow>
              </Box>

              <ErrorRow header={"An Error Occured"} text={errorDeposit}></ErrorRow>
              <TransactionHash chain={chain} txHash={txHashDeposit}></TransactionHash>
              <ExecuteButton isDisabled={isLoadingDeposit} onClick={() => deposit()} text={"EXECUTE"} ></ExecuteButton>
          </VStack>
        </Box>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="orange.500" header={"Function"} text={"withdraw"}></InfoRow>

              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={amount} setText={setAmount} title={"Amount"}></PasteRow>
              </Box>

              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={expirationTimestamp} setText={setExpirationTimestamp} title={"Expiration Timestamp"}></PasteRow>
              </Box>

              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={withdrawalSigner} setText={setWithdrawalSigner} title={"Withdrawal Signer"}></PasteRow>
              </Box>

              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow text={signature} setText={setSignature} title={"Signature"}></PasteRow>
              </Box>

              <ErrorRow header={"An Error Occured"} text={error}></ErrorRow>
              <TransactionHash chain={chain} txHash={txHash}></TransactionHash>
              <ExecuteButton isDisabled={isLoading} onClick={() => withdraw()} text={"EXECUTE"} ></ExecuteButton>
          </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;