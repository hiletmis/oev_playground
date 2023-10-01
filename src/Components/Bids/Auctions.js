import {useContext, useState} from "react";
import SignIn from '../SignIn';
import Welcome from '../Welcome';
import { useNetwork, useAccount, useSignMessage } from "wagmi";
import { OevContext } from '../../OevContext';
import { COLORS } from '../../data/colors';
import ScrollableFeed from 'react-scrollable-feed'
import BidInfoRow from "../Custom/BidInfoRow";
import CustomHeading from "../Custom/Heading";
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS } from "../../data/getContracts";

import {
    VStack, Text, Box, Spacer, Image, Flex
  } from "@chakra-ui/react";

const Hero = () => {
    const { chain } = useNetwork()
    const { address } = useAccount()

    const [payload, setPayload] = useState(null);
    const [request , setRequest] = useState(null);
    const [isBusy, setIsBusy] = useState(false);

    const { auction, setAuction } = useContext(OevContext);

    const { isLoading, signMessage } = useSignMessage({
        onSuccess: (signature) => {
            payload.signature = signature;
            setRequest(payload);
            postMessage({ payload: payload });
        }
    })

    const postMessage = async ({ payload }) => {
        const response = await fetch('https://oev.api3dev.com/api/bids/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const data = await response.json()

        if (data != null) {
            const bidIdList = auction.map(bid => bid.id);
            const filtered = data.bids.filter(bid => bidIdList.includes(bid.id));

            const newAuction = auction.map((item) => {
                const found = filtered.find((bid) => bid.id === item.id);
                if (item.auction != null) {
                    if (item.auction.status === "IN PROGRESS" && found.status === "WON") return item
                }
                item.auction = found;

                return item;
            });

            setAuction(newAuction)  
            setIsBusy(false); 
        }
    }

    const signPayload = () => {
        setIsBusy(true);
        const validUntil = new Date();
        validUntil.setMinutes(validUntil.getMinutes() + 5); 

        let payload = {
            cursor: "",
            sortDirection: "desc",
            searcherAddress: address,
            validUntil: validUntil,
            prepaymentDepositoryChainId: 11155111,
            prepaymentDepositoryAddress: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
            requestType: 'API3 OEV Relay, /bids/list',
        }
        setPayload(payload);
        const sorted = JSON.stringify(payload, Object.keys(payload).sort());
        if (request == null) {
            signMessage({ message: sorted });
            return
        }
        if (request.validUntil > Date.now()) {
            postMessage({ payload: request })
        } else {
            signMessage({ message: sorted });
        }
    }
     
  return (
    chain == null ? <SignIn></SignIn> :
    auction == null ? <Welcome></Welcome> : 
    <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"}  alignItems={"left"} >
    <CustomHeading header={"Check Active Auctions"} description={"Returns information about a specific auction based on the auction's id. Consistently checking will keep you informed about the fulfillment or cancellation of your bid."} isLoading={isLoading || isBusy}></CustomHeading>

        <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
            <VStack spacing={3} direction="row" align="left" m="1rem">
                <Flex>
                <Text fontWeight={"bold"} fontSize={"md"}>Auctions</Text>
                <Spacer />
                <Image cursor={"pointer"}  onClick={signPayload} marginLeft={1} src={`/refresh.svg`} width={"24px"} height={"24px"} />
                </Flex>

                <Box p="0" width={"100%"} borderRadius={"10"} bgColor={COLORS.app}  alignItems={"left"}>
                    <ScrollableFeed forceScroll={false}>
                    {auction.map((item, i) => {
                    return (
                        <Box key={i} p={4} shadow="md" margin={"2"} borderWidth="px" flex="1" borderRadius={"10"} bgColor={COLORS.main} onClick={() => { }}>
                            <BidInfoRow item={item}></BidInfoRow>
                        </Box>
                    );
                    })}
                </ScrollableFeed>
                </Box>

            </VStack>
        </Box>
    </VStack>
    

  );
};

export default Hero;