import { useContext } from "react";

import { Spacer, Stack, VStack, Text } from '@chakra-ui/react';
import CustomButton from './Custom/Button';
import { OevContext } from '../OevContext';
import SearcherStatus from './SearcherStatus';

import { COLORS } from '../data/colors';

const Hero = () => {
  const context = useContext(OevContext);
  const level = parseInt(localStorage.getItem('level'));

  return (
       context.collapsed && context.overrideMenu ? null :
      <VStack bgColor={COLORS.main} marginRight={2} overflowY={"scroll"} direction="row" borderRadius="lg" spacing={2} p={2} minWidth={"270px"} width={"270px"} height={"100%"} alignItems={"left"} >
        <CustomButton isDisabled={false} link="/" caption="Home" />
        {
         level === 0 
         ? 
         <Stack>
         <CustomButton isDisabled={context.wallet === null} link="/searcher" caption="Collateral" />
         <CustomButton isDisabled={context.searcher === null } link="/bid" caption="Place a Bid" />
         </Stack>
          : level === 1
          ?
          <Stack>
          <CustomButton isDisabled={context.searcher === null} link="/proxy" caption="Deploy Data Feed Proxy" />
          <CustomButton isDisabled={context.contextProxyAddress === null } link="/withdraw" caption="Withdraw" />
          </Stack>
          : level === 2
          ?
          <Stack>
          <CustomButton isDisabled={context.wallet === null} link="/searcher" caption="Collateral" />
          <CustomButton isDisabled={context.searcher === null} link="/proxy" caption="Deploy Data Feed Proxy" />
          <CustomButton isDisabled={context.contextDataFeed.length === 0 || context.contextProxyAddress === null || context.multicall === null} link="/bid" caption="Place a Bid" />
          <CustomButton isDisabled={context.auction === null } link="/auctions" caption="Check Auction Status" />
          <CustomButton isDisabled={context.contextProxyAddress === null } link="/withdraw" caption="Withdraw" />
          </Stack>
          : level === 3
          ?
          <Stack>
          { context.collapsed ? null : <Text fontWeight={"bold"} fontSize={"md"}>API Endpoints</Text>} 
          <CustomButton bgColor={"blue.500"}  height="30px" isDisabled={false } link="/configuration" caption="GET /configuration" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/withdrawals/request" caption="POST /withdrawals/request" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/withdrawals/list" caption="POST /withdrawals/list" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/status" caption="POST /status" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/bids/info" caption="POST /bids/info" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/bids/list" caption="POST /bids/list" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/bids/place" caption="POST /bids/place" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/bids/cancel" caption="POST /bids/cancel" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/auctions/info" caption="POST /auctions/info" />
          <CustomButton bgColor={"green.500"} height="30px" isDisabled={false } link="/auctions/list" caption="POST /auctions/list" />
          </Stack>
          : null
        }
        <Spacer />
        <SearcherStatus />
        
    </VStack>

);
};

export default Hero;



