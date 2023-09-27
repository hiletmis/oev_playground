import React, { useState, useEffect } from "react";
import { COLORS } from '../data/colors';
import Faucet from './Faucet';
import Popup from 'reactjs-popup';
import { useNetwork, useBalance, useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useSignTypedData, useWaitForTransaction } from 'wagmi';
import SignIn from './SignIn';
import Heading from './Custom/Heading';
import WrongNetwork from './WrongNetwork';
import { isWrongNetwork } from "./Helpers/Utils";
import ExecuteButton from "./Custom/ExecuteButton";
import Withdraw from "./Withdraw";
import TransactionHash from "./Custom/TransactionHash";
import UserStatus from "./Custom/UserStatus";

import { Button, VStack, Box, Text } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Flex, Spacer, Image, Stack
} from '@chakra-ui/react'

import { ethers } from "ethers";
import { PREPAYMENT_DEPOSIT_ABI, PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS, TOKEN_ABI, TOKEN_CONTRACT_ADDRESS, SIGNTYPEDDATA } from "../data/abi";
  
const Deposit = () => {
  const { chain } = useNetwork()
  const { address } = useAccount()

  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0); 
  const [refreshBalance, setRefreshBalance] = useState(false);
  const [signErc2612PermitArgs, setSignErc2612PermitArgs] = useState({tokenAmount: 0, v: 0, r: "0x", s: "0x"});
  const [isSigned, setIsSigned] = useState(false);
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    setRefreshBalance(true)
  }, [chain]);

  const balance = useBalance({
    address: address,
    token: TOKEN_CONTRACT_ADDRESS,
    chainId: 11155111,
    enabled: refreshBalance,
  })

  useEffect(() => {
    if (balance.data != null) {
      setTokenBalance(balance?.data.formatted)
    }
  }, [balance]);

  const nonce = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'nonces',
    chainId: 11155111,
    args: [address],
    enabled: refreshBalance,
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

  const { isLoading, isSuccess } = useWaitForTransaction({
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
 
  useEffect(() => {
    if (isSuccess) {
      setRefreshBalance(true)
      setTokenAmount("");
    }
  }, [isSuccess]);
  
  useEffect(() => {
    if (refreshBalance) {
      setRefreshBalance(false)
    }
  }, [refreshBalance]);

  return (
    chain == null ? <SignIn></SignIn> :
    isWrongNetwork(chain) ? <WrongNetwork></WrongNetwork> :
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >

      <UserStatus />
      <Heading isLoading={isLoading } description={"Deposit TestUSDC as collateral to start bidding"} header={"Add Collateral"} ></Heading>
      <Box width={"100%"} height="120px" bgColor={COLORS.main} borderRadius={"10"}>
      <VStack spacing={3} direction="row" align="left" m="1rem">
      <Flex>
      <NumberInput  value={tokenAmount} step={1} min={0} size={"lg"} onChange={(valueString) => {
        setTokenAmount(valueString)
        }}>
              <NumberInputField borderWidth={"0px"} focusBorderColor={"red.200"} placeholder="0.0" fontSize={"4xl"} inputMode="numeric"/><NumberInputStepper></NumberInputStepper>
            </NumberInput>
      <Spacer />
      <Image src={`/coins/USD.webp`} width={"40px"} height={"40px"} />
      </Flex>

        <Flex>
        <Text 
        color={parseFloat(tokenBalance) < parseFloat(tokenAmount) ? "red.500" : "white"}
        fontWeight={"bold"} 
        visibility={tokenBalance === "0" ? "hidden" : "visible"}
        fontSize={"sm"}>
          {parseFloat(tokenBalance) < parseFloat(tokenAmount)  ? "Insufficient Balance" : "Token Balance"}
          </Text>
        <Spacer />
        <Image src={tokenBalance === "0" ? '/getToken.svg' : '/wallet.svg'} width={"40px"} height={"20px"} />
        <Text onClick={() => {
          setTokenAmount(tokenBalance)
        }} fontSize={"sm"}>{tokenBalance === "0" 
        ? 
        <Popup
        trigger={<Button height={"30px"} width={"110px"} bgColor={"transparent"}>Get testUSDC</Button> }
        modal>
        { close => (<Faucet stateChanger={close} refreshBalance={close}></Faucet>)  }
        </Popup>
        : tokenBalance}</Text>
        <Image cursor={"pointer"} src={'/refresh.svg'} width={"40px"} height={"20px"} onClick={() => {setRefreshBalance(true)}} />
        </Flex>

        </VStack>
        </Box>

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
