import { Box, Flex, Link, Spacer, Stack, Text } from '@chakra-ui/react';
import { COLORS } from '../../data/colors';
import { ExternalLinkIcon, CheckCircleIcon } from "@chakra-ui/icons";

const Hero = ({chain, txHash, confirmations}) => {

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
        <Spacer />
        <Box paddingLeft={2} paddingRight={2} borderRadius={"10"} bgColor={"green.700"} height={5} alignItems={"center"} >
      <Text fontSize="xs" fontWeight={"bold"}>Confirmations: {confirmations}</Text>
      </Box>
      <ExternalLinkIcon onClick={() => openLink(chain.blockExplorers.default.url + '/tx/' + txHash)} />
      </Stack>

    </Box>
</Flex> 
  );
};

export default Hero;