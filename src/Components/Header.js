import { Flex, Heading, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import { COLORS } from '../data/colors';

const Header = () => {
  return (
    <Flex bg={COLORS.app} boxShadow="lg" flexDirection={'column'}>
      <Flex as="header" align="center" justify="space-between" p={4}>
        <Link href="/" _hover={{ textDecoration: 'none' }}>
          <Flex align="flex-start" cursor="pointer" gap={'12px'}>
            <Image src={`/logo.svg`} width={"25px"} height={"25px"} />
            <Heading size="md">Nodary OEV Relay Testnet Playground</Heading>
          </Flex>
        </Link>
        <Flex align="flex-end" gap={'12px'}>
          <ConnectButton 
            chainStatus={{
              largeScreen: "full",
              smallScreen: "icon",
            }}
            accountStatus="address"
            label="Sign in"
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />
        </Flex>
      </Flex>
      {/* <Divider /> */}
    </Flex>
  );
};

export default Header;
