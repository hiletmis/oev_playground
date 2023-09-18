import {useEffect, useState} from "react";
import { Text, Box, VStack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import PasteRow from "./PasteRow";
import BidAmount from "./BidAmount";
import BidConditions from "./BidConditions";
import InputRow from "./InputRow";
import { useNetwork } from "wagmi";
  
const Hero = ({params, setParams, ethBalance, isProxyAddressValid, isUpdateAddressValid}) => { 
    const { chain } = useNetwork()

    const [ethAmount, setEthAmount] = useState("")
    const [proxyAddress, setProxyAddress] = useState("")
    const [proxyChainId, setProxyChainId] = useState("")
    const [updateExecutorAddress, setUpdateExecutorAddress] = useState("")
    const [fulfillValue, setFulfillValue] = useState("")
    const [condition, setCondition] = useState("LTE")

    useEffect(() => {
        if (params != null) {
            setEthAmount(params.ethAmount)
            setProxyAddress(params.proxyAddress)
            setProxyChainId(params.proxyChainId)
            setUpdateExecutorAddress(params.updateExecutorAddress)
            setFulfillValue(params.fulfillValue)
            setCondition(params.condition)
        }
    }, [params])

    useEffect(() => {
        if (setParams == null) return
        setParams({
            ethAmount: ethAmount,
            proxyAddress: proxyAddress,
            proxyChainId: proxyChainId,
            updateExecutorAddress: updateExecutorAddress,
            fulfillValue: fulfillValue,
            condition: condition
        })
    }, [ethAmount, proxyAddress, proxyChainId, updateExecutorAddress, fulfillValue, condition, setParams])
        
    return (
    <VStack alignItems={"left"} >
        <Text fontWeight={"bold"} fontSize={"sm"}>Params</Text>
        <Box width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
            <VStack direction="column" align="left" m="1rem">
            <PasteRow title={"Proxy Addres"} text={proxyAddress} setText={setProxyAddress} color={isProxyAddressValid ? "white" : "red.500"} margin={0}></PasteRow>
            <InputRow title={"Proxy Chain Id"} text={proxyChainId} setText={setProxyChainId} margin={0}></InputRow>
            <PasteRow title={"Update Executor Address"} text={updateExecutorAddress} setText={setUpdateExecutorAddress} color={isUpdateAddressValid ? "white" : "red.500"} margin={0}></PasteRow>
            <BidAmount ethAmount={ethAmount} ethBalance={ethBalance} chain={chain} setEthAmount={setEthAmount} bgColor={COLORS.main}></BidAmount> 
            <BidConditions fulfillValue={fulfillValue} setFulfillValue={setFulfillValue} condition={condition} setCondition={setCondition} bgColor={COLORS.main}></BidConditions>
            </VStack>
        </Box>
    </VStack>
  );
};

export default Hero;





