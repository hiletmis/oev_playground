import React from "react";
import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import { ExternalLinkIcon, CheckCircleIcon } from "@chakra-ui/icons";

const Hero = ({chain, txHash}) => {

  const truncateLink = (link) => {
    if (link.length > 20) {
      return link.substring(0, 10) + '...' + link.substring(link.length - 10, link.length);
    } else {
      return link;
    }
  }

  const openLink = (link) => {
    window.open(link);
  }

  return (
    chain == null ? null :
    txHash == null ? null :
    <Flex direction="column" align="left">
    <Box borderRadius={"10"} p={3} cursor={"pointer"} bgColor={COLORS.table}>
      <Stack direction="row" align="center">

      <CheckCircleIcon/>
      <Link visibility={!txHash ? 'hidden': 'visible'} href={chain.blockExplorers.default.url + '/tx/' + txHash} isExternal>
        Show in explorer {truncateLink(txHash)}</Link>
      <ExternalLinkIcon onClick={() => openLink(chain.blockExplorers.default.url + '/tx/' + txHash)} />
      </Stack>

    </Box>
</Flex> 
  );
};

export default Hero;