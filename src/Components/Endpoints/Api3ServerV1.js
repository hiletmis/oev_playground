import { useEffect, useState} from "react";
import SignIn from '../SignIn';
import { useNetwork, useAccount, useContractWrite, useWaitForTransaction, useContractRead } from "wagmi";
import { COLORS } from '../../data/colors';
import InfoRow from "../Custom/InfoRow";
import ExecuteButton from "../Custom/ExecuteButton";
import PasteRow from "../Custom/PasteRow";
import { API3SERVERV1, API3SERVERV1_ABI, UpdatedOevProxyBeaconSetWithSignedData } from "../../data/abi";
import { ethers } from "ethers";
import TransactionHash from "../Custom/TransactionHash";
import ErrorRow from "../Custom/ErrorRow";
import CopyInfoRow from "../Custom/CopyInfoRow";

import CustomHeading from "../Custom/Heading";

import {
  VStack, Box, Text
} from "@chakra-ui/react";


const Hero = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [encodedUpdateTransaction, setEncodedUpdateTransaction] = useState("");
  const [oevProxy, setOevProxy] = useState("");
  const [manuelUpdateParams, setManuelUpdateParams] = useState([]);
  const [chainId, setChainId] = useState(chain != null ? chain.id : 0);
  const [nativeCurrencyAmount, setNativeCurrencyAmount] = useState("");

  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const [errorOevProxy, setErrorOevProxy] = useState(null);
  const [txHashOevProxy, setTxHashOevProxy] = useState(null);

  const [availableToWithdraw, setAvailableToWithdraw] = useState("");

  const updateParamsTitles = ["Oev Proxy", "Data Feed Id", "Update Id", "Timestamp", "Data", "Packed Oev Update Signatures"]


const { data, write } = useContractWrite({
  address: API3SERVERV1(chainId),
  abi: API3SERVERV1_ABI,
  functionName: 'updateOevProxyDataFeedWithSignedData',
  enabled: manuelUpdateParams.length === 6,
  args: manuelUpdateParams,
  value: nativeCurrencyAmount,
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

const updateDataFeed = () => {
  if (nativeCurrencyAmount <= 0) {
    alert("Please enter a valid native currency amount")
    return
  }
  if (encodedUpdateTransaction === "") {
    alert("Please enter a valid encoded update transaction")
    return
  }
  write?.()
}

useContractRead({
  address: API3SERVERV1(chainId),
  abi: API3SERVERV1_ABI,
  functionName: 'oevProxyToBalance',
  args: [oevProxy],
  enabled: oevProxy !== "",
  onSuccess: (data) => {
    const eth = ethers.utils.formatUnits(data, 18)
    setAvailableToWithdraw(eth + " " + chain.nativeCurrency.symbol);
  },
})

const { data:dataOevProxy, write: writeOev } = useContractWrite({
  address: API3SERVERV1(chainId),
  abi: API3SERVERV1_ABI,
  functionName: 'withdraw',
  enabled: oevProxy !== "",
  args: [oevProxy],
  onSuccess: (data) => {
    setErrorOevProxy(null);
  },
  onError: (error) => {
    setErrorOevProxy(error.message);
  }
})

const { isLoading: isLoadingOevProxy } = useWaitForTransaction({
  hash: dataOevProxy?.hash,
  confirmations: 1,
  enabled: writeOev != null,
  onSuccess: () => {
    setTxHashOevProxy(dataOevProxy?.hash);
    setErrorOevProxy(null);
  }
});


const withdrawOevProxy = () => {
  setErrorOevProxy(null);
  if (oevProxy === "") {
    alert("Please enter a valid oev proxy address")
    return
  }
  writeOev?.()
}

useEffect(() => {
  if (encodedUpdateTransaction === "") return;

  try {
    const values = ethers.utils.defaultAbiCoder.decode(UpdatedOevProxyBeaconSetWithSignedData,
      ethers.utils.hexDataSlice(encodedUpdateTransaction, 4)
    )
    setManuelUpdateParams([values.oevProxy, values.dataFeedId, values.updateId, values.timestamp, values.data, values.packedOevUpdateSignatures])
  } catch (error) {
    setEncodedUpdateTransaction("")
  }

}, [address, encodedUpdateTransaction]);


useEffect(() => {
  if (manuelUpdateParams.length === 0) return
}, [manuelUpdateParams]);

useEffect(() => {
  setChainId(chain != null ? chain.id : 0);
}, [chain]);

  return (
    chain == null ? <SignIn></SignIn> :
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
        <CustomHeading header={"Api3ServerV1 Contract"} description={"Searchers utilize ApiServerV1 contract to update data feed while deFi apps utilize it to withdraw bid amounts."} isLoading={ isLoading || isLoadingOevProxy }></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="red.500" header={"Payable Function"} text={"updateOevProxyDataFeedWithSignedData"}></InfoRow>
              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow setText={setNativeCurrencyAmount} text={nativeCurrencyAmount} title={"Native Currency Amount"}></PasteRow>
              </Box>

              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow setText={setEncodedUpdateTransaction} text={encodedUpdateTransaction} title={"Encoded Update Transaction"}></PasteRow>
              </Box>

              {
                manuelUpdateParams.length === 0 ? null :

                <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>

                {
                  manuelUpdateParams.map((param, index) => {
                    return (
                      <Box p={1} width={"100%"} borderRadius={"10"}>
                      <Text fontWeight={"bold"} fontSize={"sm"} >{updateParamsTitles[index]}</Text>
                      <Text fontSize={"sm"} >{param.toString()}</Text>
                      </Box>
                    )
                  })
                }              
                </Box>
              }

              <ErrorRow header={"An Error Occured"} text={error}></ErrorRow>
              <TransactionHash chain={chain} txHash={txHash}></TransactionHash>
              <ExecuteButton isDisabled={isLoading} onClick={() => updateDataFeed()} text={"EXECUTE"} ></ExecuteButton>
          </VStack>
        </Box>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
          <VStack spacing={3} direction="row" align="left" m="1rem">
              <InfoRow bgColor="orange.500" header={"Function"} text={"withdraw"}></InfoRow>
              <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <PasteRow setText={setOevProxy} text={oevProxy} title={"Oev Proxy Address"}></PasteRow>
              </Box>
              <ErrorRow header={"An Error Occured"} text={errorOevProxy}></ErrorRow>
              {
                availableToWithdraw === "" ? null :
                <CopyInfoRow header={"Proxy Balance"} text={availableToWithdraw} copyEnabled={false}></CopyInfoRow>
              }
              <TransactionHash chain={chain} txHash={txHashOevProxy}></TransactionHash>
              <ExecuteButton isDisabled={isLoadingOevProxy} onClick={() => withdrawOevProxy()} text={"EXECUTE"} ></ExecuteButton>
          </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;