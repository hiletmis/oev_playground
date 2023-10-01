import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork, useContractWrite, useWaitForTransaction, useContractRead, useAccount, useSignTypedData } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import PasteRow from "../Custom/PasteRow";
import SimpleList from "../Custom/SimpleList";

import { PREPAYMENT_DEPOSIT_ABI, TOKEN_ABI, SIGNTYPEDDATA } from "../../data/abi";
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../../data/getContracts";

import TransactionHash from "../Custom/TransactionHash";
import ErrorRow from "../Custom/ErrorRow";
import SwitchNetwork from "../SwitchNetwork";
import AddCollateral from "../Custom/AddCollateral";

import CustomHeading from "../Custom/Heading";
import { loadFromLocalStorage, saveToLocalStorage } from "../Helpers/Utils";
import { ethers } from "ethers";

import {
  VStack, Box
} from "@chakra-ui/react";


const Hero = () => {
  const { chain } = useNetwork()
  const { address } = useAccount()

  const [amount, setAmount] = useState("");
  const [expirationTimestamp, setExpirationTimestamp] = useState("");
  const [withdrawalSigner, setWithdrawalSigner] = useState("");
  const [signature, setSignature] = useState("");

  const [isSepolia, setIsSepolia] = useState(0)

  const [argsDeposit, setArgsDeposit] = useState([]);
  const [args, setArgs] = useState([]);
  const [signArgs, setSignArgs] = useState([]);

  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const [tokenBalance, setTokenBalance] = useState(0); 
  const [isSigned, setIsSigned] = useState(false);

  const [tokenAmount, setTokenAmount] = useState("");

  const depositArgsTitles = ["Owner", "Amount", "Deadline", "V", "R", "S"]
  const signArgsTitles = ["Owner", "Spender", "Nonce", "Value", "Deadline"]

  const [txHashDeposit, setTxHashDeposit] = useState(null);
  const [errorDeposit, setErrorDeposit] = useState(null);

  const nonce = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'nonces',
    chainId: 11155111,
    args: [address],
    watch: true
  })

  const tokenName = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'name',
    chainId: 11155111,
  })

  const domain = {
    name: tokenName.data,
    version: '2',
    chainId: 11155111,
    verifyingContract: TOKEN_CONTRACT_ADDRESS,
  }

  const typedDataMessage = {
    owner: address,
    spender: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
    nonce: nonce.data,
    value: tokenAmount !== "" ? parseFloat(tokenAmount) * 1e6 : 0,
    deadline: String(ethers.constants.MaxUint256),
  }

  const { isLoading: isLoadingTypedData, signTypedData } = useSignTypedData({
    domain,
    types: SIGNTYPEDDATA,
    primaryType: 'Permit',
    message: typedDataMessage,
    onSuccess: (data) => {
      const { v, r, s } = ethers.utils.splitSignature(data);
      setArgsDeposit([address, parseFloat(tokenAmount) * 1e6, String(ethers.constants.MaxUint256), v, r, s])
      setIsSigned(true)
      setTxHashDeposit(null)
    },
    onError: (error) => {
      setErrorDeposit(error.message);
    }
    })

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

  useEffect(() => {
    setArgsDeposit([])
    setIsSigned(false)
    setErrorDeposit(null)

    try {
      setSignArgs([address, PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS, nonce.data, tokenAmount !== "" ? parseFloat(tokenAmount) * 1e6 : 0, String(ethers.constants.MaxUint256)])  
    } catch (error) {
      console.log(error)
    }

  }, [address, nonce.data, tokenAmount]);

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
      setArgsDeposit([])
      setSignArgs([])
      setTokenAmount("")
    }
  });

  const signPermit = () => {
    signTypedData()
  }

  const deposit = () => {
    setErrorDeposit(null);
    isSigned ? writeDeposit?.() : signPermit()
  }

  const withdraw = () => {
    write();
  }

  useEffect(() => {
    setIsSepolia(chain == null ? 0 : chain.id === 11155111)
}, [chain]);

useEffect(() => {
  const auction = loadFromLocalStorage("withdrawInfo")

  if (auction == null) return

  if (auction.amount === "") return;
  if (auction.expirationTimestamp === "") return;
  if (auction.signer === "") return;
  if (auction.signature === "") return;

  setAmount(auction.amount)
  setExpirationTimestamp(auction.expirationTimestamp)
  setWithdrawalSigner(auction.signer)
  setSignature(auction.signature)
  saveToLocalStorage("withdrawInfo", null)

}, []);

  return (
    chain == null ? <SignIn></SignIn> :
    !isSepolia ? <SwitchNetwork></SwitchNetwork> :
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
        <CustomHeading header={"Prepayment Depository Contract"} description={"Searchers utilize PrepaymentDepository contract to deposit and/or withdraw collateral"} isLoading={isLoading || isLoadingDeposit || isLoadingTypedData}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="orange.500" header={"Function"} text={"applyPermitAndDeposit"}></InfoRow>
              <AddCollateral tokenAmount={tokenAmount} setTokenAmount={setTokenAmount} tokenBalance={tokenBalance} setTokenBalance={setTokenBalance} bgColor={COLORS.app}></AddCollateral>
              <SimpleList listTitle={"Permit Params"} list={signArgs} titles={signArgsTitles}></SimpleList>
              <SimpleList listTitle={"Deposit Params"} list={argsDeposit} titles={depositArgsTitles}></SimpleList>
              <ErrorRow header={"An Error Occured"} text={errorDeposit}></ErrorRow>
              <TransactionHash chain={chain} txHash={txHashDeposit}></TransactionHash>
              <ExecuteButton isDisabled={isLoadingDeposit || isLoadingTypedData} onClick={() => deposit()} text={isSigned ? "DEPOSIT" : "SIGN PERMIT"} ></ExecuteButton>
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
              <ExecuteButton isDisabled={isLoading} onClick={() => withdraw()} text={"WITHDRAW"} ></ExecuteButton>
          </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;