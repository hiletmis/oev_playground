import {useContext, useEffect, useState} from "react";
import { VStack, Box, Flex, Spacer, Text, Link } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import { OevContext } from '../../OevContext';
import LevelRadioButton from './LevelRadioButton';

const Hero = () => {

    const [condition, setCondition] = useState(null);

    const {setLevel, level} = useContext(OevContext);

    const bgColor = () => {
        switch (condition) {
            case '0':
                return "green.500";
            case '1':
                return "green.700";
            case '2':
                return "orange.500";
            case '3':
                return "red.700";
            default:
                return "red.500";
        }
    }

    useEffect(() => {
        if (condition === null) return;
        setLevel(parseInt(condition));
    }, [condition, level, setLevel]);

    useEffect(() => {
        if (condition === null) {
            setCondition(String(level));
        }
    }, [condition, level]);

  return (
    <VStack width="700px" alignItems={"left"} >
        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
            <VStack spacing={3} direction="row" align="left" m="1rem">
                <Flex>
                    <Text fontWeight={"bold"} fontSize={"md"}>App Mode Selector</Text>
                <Spacer />
                </Flex>
                <Text fontSize={"sm"}>Select the level of the tutorial you want to experience</Text>
                        
                <Flex align="center" justify={"space-evenly"} p={"2"} bgColor={COLORS.main} flexDirection={'row'}>
                    <LevelRadioButton onClick={() => setCondition('0')} bgColor={condition === '0' ? bgColor() : "gray.700"} description={"Searcher"}></LevelRadioButton>
                    <LevelRadioButton onClick={() => setCondition('1')} bgColor={condition === '1' ? bgColor() : "gray.700"} description={"DeFi App"}></LevelRadioButton>
                    <LevelRadioButton onClick={() => setCondition('2')} bgColor={condition === '2' ? bgColor() : "gray.700"} description={"Combined"}></LevelRadioButton>
                    <LevelRadioButton onClick={() => setCondition('3')} bgColor={condition === '3' ? bgColor() : "gray.700"} description={"Advanced"}></LevelRadioButton>
                </Flex>

                <Text fontWeight={"bold"} fontSize={"md"}>Description</Text>
                <Box p={"3"} borderRadius={"10"} alignItems={"center"} bgColor={COLORS.app} width={"100%"} >
                    <Flex justify={"center"} width={"100%"} height={"100%"} borderRadius={"10"} alignItems={"center"}>
                        {condition === '0' ?
                        <Text fontSize={"md"}>Searchers are the first level of the API3 DAO. They are responsible for placing bids on data feeds. And updating data feeds that they won in an auction.</Text>
                        : condition === '1' ?
                        <Text fontSize={"md"}>DeFi Apps are the second level of the API3 DAO. They are responsible for deploying data feed proxies.</Text>
                        : condition === '2' ?
                        <Text fontSize={"md"}>Combined mode is consist of both searcher and defi app functions. The whole flow can be experienced using this mode.</Text>
                        : condition === '3' ?
                        <Text fontSize={"md"}>Advanced mode requires low level interactions with OEV Relay API endpoints. This mode gives overall the concept of OEV Relay.</Text>
                        : null}
                    </Flex>
                </Box>

                <Text fontWeight={"bold"} fontSize={"md"}>Instructions</Text>
                <Box p={"3"} borderRadius={"10"} alignItems={"left"} bgColor={COLORS.app} width={"100%"} >
                    <Flex width={"100%"} height={"100%"} borderRadius={"10"} alignItems={"left"}>
                        {condition === '0' ?
                        <VStack alignItems={"left"} spacing={"3"}>
                            <Text fontSize={"md"}>Start by clicking the "Deposit Collateral" button. You will be asked to sign a message to deposit collateral to the OEV Relay. After the transaction is confirmed, you will be able to place bids on data feeds. Usually it takes 2-3 minutes before deposit is confirmed.</Text>
                            <Text fontSize={"md"}>Deposit contract is deployed on Sepolia Ethereum testnet. You will need testUSDC token to deposit collateral. You can get testUSDC from the testUSDC faucet in deposit section.</Text>
                            <Text fontSize={"md"}>Making deposit will allow you to place bids on all available chains and available data feeds.</Text>
                            <Text fontSize={"md"}>After depositing collateral, you can place bids on data feeds. Select from available data feeds, enter your bid conditions and click the "Bid" button to place a bid. You will be asked to sign a message to place a bid. After the transaction is confirmed, you will be able to check your bid status.</Text>
                            <Text fontSize={"md"}><b>Bid statuses can be as follows:</b></Text>
                            <Text fontSize={"md"}><b>1. PENDING:</b> Your bid is waiting to be included in an auction.</Text>
                            <Text fontSize={"md"}><b>2. WON:</b> Your bid is fulfilled and you are now the owner of the data feed.</Text>
                            <Text fontSize={"md"}><b>3. CANCELED:</b> Your bid is canceled and your bid reserved funds are freed.</Text>
                            <Text fontSize={"md"}><b>4. FRONTRUN:</b> Your bid is frontuned and your bid reserved funds are freed.</Text>
                            <Text fontSize={"md"}><b>5. SLASHED:</b> You did not update the data feed in time and your bid reserved funds are slashed.</Text>
                            <Text fontSize={"md"}>In case of a won bid, you will be able to update the data feed. You can update the data feed by clicking the "Update Data Feed" button. You will be asked to sign a message to update the data feed. After the transaction is confirmed, you will be able to check your bid status.</Text>
                            <Text fontSize={"md"}>Not updating the data feed in time will result in slashing your bid reserved funds.</Text>
                        </VStack>
                       : condition === '1' ?
                        <Text fontSize={"md"}>DeFi Apps are the second level of the API3 DAO. They are responsible for deploying data feed proxies.</Text>
                        : condition === '2' ?
                        <Text fontSize={"md"}>Combined mode is consist of both searcher and defi app functions. The whole flow can be experienced using this mode.</Text>
                        : condition === '3' ?
                        <VStack alignItems={"left"} spacing={"3"}>
                            <Text fontSize={"md"}>Accessing API endpoints properly also requires a user to be registered as a searcher. Thus, start by clicking the "Deposit Collateral" button. You will be asked to sign a message to deposit collateral to the OEV Relay. After the transaction is confirmed, you will be able to utilize endpoints. Usually it takes 2-3 minutes before deposit is confirmed.</Text>
                            <Text fontSize={"md"}>There are 10 API endpoints that can be accessed. You can access them by clicking the buttons. You will be asked to sign a message to access an endpoint. After the transaction is confirmed, you will be able to see the response of the endpoint.</Text>
                            <Text fontSize={"md"}><b>GET /configuration</b> endpoint returns the configuration of the OEV Relay.</Text>
                            <Text fontSize={"md"}><b>POST /withdrawals/request</b> endpoint requests a withdrawal from the OEV Relay.</Text>
                            <Text fontSize={"md"}><b>POST /withdrawals/list</b> endpoint lists the withdrawals of a searcher.</Text>
                            <Text fontSize={"md"}><b>POST /status</b> endpoint returns the status of a searcher.</Text>
                            <Text fontSize={"md"}><b>POST /bids/info</b> endpoint returns the information of a bid.</Text>
                            <Text fontSize={"md"}><b>POST /bids/list</b> endpoint lists the bids of a searcher.</Text>
                            <Text fontSize={"md"}><b>POST /bids/place</b> endpoint places a bid on a data feed.</Text>
                            <Text fontSize={"md"}><b>POST /bids/cancel</b> endpoint cancels a bid.</Text>
                            <Text fontSize={"md"}><b>POST /auctions/info</b> endpoint returns the information of an auction.</Text>
                            <Text fontSize={"md"}><b>POST /auctions/list</b> endpoint lists the auctions of a searcher.</Text>
                            <Text fontSize={"md"}>You can find additional information about the endpoints in corresponding pages.</Text>
                            <Text fontSize={"md"}>For detailed information, please visit <Link href={"https://docs.api3dev.com"} isExternal>the documentation</Link></Text>
                        </VStack>
                        : null}
                    </Flex>
                </Box>
            </VStack>
        </Box>
    </VStack>


  );
};

export default Hero;