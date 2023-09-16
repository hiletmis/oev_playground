import { useContext } from "react";

import { Spacer, VStack } from '@chakra-ui/react';
import CustomButton from './Custom/Button';
import { OevContext } from '../OevContext';
import SearcherStatus from './SearcherStatus';

import { COLORS } from '../data/colors';

const Hero = () => {
  const context = useContext(OevContext);

return (
      <VStack bgColor={COLORS.main} direction="row" borderRadius="lg" spacing={2} p={2} width={'100%'} height={"100%"} alignItems={"left"} >
        <CustomButton isDisabled={context.wallet === null} link="/searcher" caption="Deposit Collateral" />
        <CustomButton isDisabled={context.searcher === null} link="/proxy" caption="Deploy Data Feed Proxy" />
        <CustomButton isDisabled={context.contextProxyAddress === null } link="/multicall" caption="Deploy Update Executor" />
        <CustomButton isDisabled={context.contextProxyAddress === null || context.multicall === null} link="/bid" caption="Place a Bid" />
        <CustomButton isDisabled={context.auction === null } link="/auctions" caption="Check Auction Status" />
        <CustomButton isDisabled={context.auction === null } link="/" caption="Withdraw" />
        <Spacer />
        <SearcherStatus />
    </VStack>

);
};

export default Hero;



