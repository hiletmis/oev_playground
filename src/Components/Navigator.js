import { useContext } from "react";

import { OevContext } from '../OevContext';
import LeftPane from './LeftPane';


const Hero = () => {
  const context = useContext(OevContext);

  return (
       context.collapsed ? null :<><LeftPane/></>
);
};

export default Hero;



