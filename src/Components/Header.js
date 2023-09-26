import { Flex, Heading, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { COLORS } from '../data/colors';
import { OevContext } from '../OevContext';
import { useContext, useEffect, useState } from 'react';
import LeftPane from './LeftPane';

import SlidingPane from "react-sliding-pane";

const Header = () => {

  const { collapsed, setCollapsed, overrideMenu, setOverrideMenu} = useContext(OevContext);
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    if (width > 900) return
    setState({ isPaneOpenLeft: true })
  }

  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    setOverrideMenu(width < 900 ? true : false); 
    if (overrideMenu) return
    setCollapsed(width < 900 ? true : false);
  }, [overrideMenu, setCollapsed, setOverrideMenu, width]);

  return (
    <Flex width={"100%"} bg={COLORS.app} boxShadow="lg" flexDirection={'column'}>
      <SlidingPane
        isOpen={state.isPaneOpenLeft}
        from="left"
        width="270px"
        margin={"0px"}
        onRequestClose={() => setState({ isPaneOpenLeft: false })}
      >
       <LeftPane/>
      </SlidingPane>
      <Flex as="header" align="center" justify="space-between" p={4}>
          <Flex align="flex-start" cursor="pointer" gap={'12px'}>
            <Image onClick={() => handleResize()} src={collapsed || overrideMenu ? "/menu_w.svg" :  `/logo.svg`} width={"25px"} height={"25px"} />
            { collapsed || overrideMenu ? null : <Heading size="md">Nodary OEV Relay Testnet Playground</Heading>}
          </Flex>
        <Flex align="flex-end" gap={'12px'}>
          <ConnectButton 
            chainStatus={{
              largeScreen: "full",
              smallScreen: "icon",
            }}
            accountStatus="address"
            label="Connect Wallet"
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
