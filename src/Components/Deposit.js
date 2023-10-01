import React, { useState, useEffect } from "react";
import { useNetwork, useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useSignTypedData, useWaitForTransaction } from 'wagmi';
import SignIn from './SignIn';
import Heading from './Custom/Heading';
import WrongNetwork from './WrongNetwork';
import { isWrongNetwork } from "./Helpers/Utils";
import ExecuteButton from "./Custom/ExecuteButton";
import Withdraw from "./Withdraw";
import TransactionHash from "./Custom/TransactionHash";
import UserStatus from "./Custom/UserStatus";
import AddCollateral from "./Custom/AddCollateral";

import { VStack, Stack } from "@chakra-ui/react";

import { ethers } from "ethers";
import { PREPAYMENT_DEPOSIT_ABI, TOKEN_ABI, SIGNTYPEDDATA } from "../data/abi";
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../data/getContracts";
  
const Deposit = () => {
  const { chain } = useNetwork()
  const { address } = useAccount()

  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0); 
  const [signErc2612PermitArgs, setSignErc2612PermitArgs] = useState({tokenAmount: 0, v: 0, r: "0x", s: "0x"});
  const [isSigned, setIsSigned] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const nonce = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'nonces',
    chainId: 11155111,
    args: [address],
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
        setSignErc2612PermitArgs({tokenAmount: parseFloat(tokenAmount) * 1e6, deadline: String(ethers.constants.MaxUint256), v, r, s})
        setIsSigned(true)
      }
      })

  const { config } = usePrepareContractWrite({
    address: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
    abi: PREPAYMENT_DEPOSIT_ABI,
    functionName: 'applyPermitAndDeposit',
    chainId: 11155111,
    enabled: isSigned,
    args: [address, signErc2612PermitArgs.tokenAmount, String(ethers.constants.MaxUint256), signErc2612PermitArgs.v, signErc2612PermitArgs.r, signErc2612PermitArgs.s],
  })

  const { data, write } = useContractWrite(config)

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
    onSuccess: () => {
        setTxHash(data.hash);
    }
  });

  const trigger = () => {
    setTxHash(null)
    signTypedData()
  }

  useEffect(() => {
    if (write == null || write === undefined) return
    if (isSigned) {
      setIsSigned(false)
      write?.()
    }
  }, [isSigned, write]);

  return (
    chain == null ? <SignIn></SignIn> :
    isWrongNetwork(chain) ? <WrongNetwork></WrongNetwork> :
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >

      <UserStatus />
      <Heading isLoading={isLoading } description={"Deposit TestnetUSDC as collateral to start bidding"} header={"Add Collateral"} ></Heading>
        <AddCollateral tokenAmount={tokenAmount} setTokenAmount={setTokenAmount} tokenBalance={tokenBalance} setTokenBalance={setTokenBalance}></AddCollateral>
        <TransactionHash chain={chain} txHash={txHash}></TransactionHash>

        <Stack alignItems={"center"} >
        <ExecuteButton
        isDisabled={ isLoading || isLoadingTypedData || !tokenAmount || isNaN(parseFloat(tokenAmount)) || parseFloat(tokenBalance) < parseFloat(tokenAmount) || parseFloat(tokenAmount) <= 0}
        onClick={() => {trigger()}}
        text={ isLoadingTypedData ? "Signing..." : isLoading ? 'Depositing...' : 'Deposit'}
        ></ExecuteButton>
      </Stack>  
      <Withdraw></Withdraw>
    </VStack>
  );
};


export default Deposit;
