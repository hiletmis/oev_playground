import {useContext} from "react";
import DeployMulticall from './DeployMulticall'; 
import SignIn from './SignIn';
import StartOver from './StartOver';
import { useNetwork } from "wagmi";
import { OevContext } from '../OevContext';

const Hero = () => {
    const { chain } = useNetwork()
    const { contextDataFeed } = useContext(OevContext);

  return (
    chain == null ? <SignIn></SignIn> :
    contextDataFeed === null ? <StartOver></StartOver> : 
    <DeployMulticall></DeployMulticall> 
  );
};

export default Hero;