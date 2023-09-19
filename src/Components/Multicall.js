import {useContext} from "react";
import DeployMulticall from './DeployMulticall'; 
import SignIn from './SignIn';
import Welcome from './Welcome';
import { useNetwork } from "wagmi";
import { OevContext } from '../OevContext';

const Hero = () => {
    const { chain } = useNetwork()
    const { contextDataFeed, searcher } = useContext(OevContext);

  return (
    chain == null ? <SignIn></SignIn> :
    contextDataFeed.length === 0 || searcher === null ? <Welcome></Welcome> : 
    <DeployMulticall></DeployMulticall> 
  );
};

export default Hero;