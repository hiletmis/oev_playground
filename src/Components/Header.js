import { Flex, Heading, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { COLORS } from '../data/colors';
import { OevContext } from '../OevContext';
import { useContext } from 'react';
import PopupNavigator from './PopupNavigator';

const Header = () => {

  const { collapsed } = useContext(OevContext);

  return (
    <Flex width={"100%"} bg={COLORS.app} boxShadow="lg" flexDirection={'column'}>
      <Flex as="header" align="center" justify="space-between" p={4}>
          <Flex align="flex-start" cursor="pointer" gap={'12px'}>
            { collapsed ? <PopupNavigator></PopupNavigator> : <Image src={`/logo.svg`} width={"25px"} height={"25px"} /> }
            { collapsed ? null : <Heading size="md">Nodary OEV Relay Testnet Playground</Heading>}
          </Flex>
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
    </Flex>
  );
};

export default Header;
