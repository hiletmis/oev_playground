import Popup from 'reactjs-popup';
import { Flex, Image } from "@chakra-ui/react";
import Navigator from './Navigator';
import '../popup.css'

const PopupNavigator = () => {
    return (
        <Popup
        trigger={
            <Image src={`/menu_w.svg`} width={"25px"} height={"25px"} />
        }
        modal
        >
        {close => (
            <Flex>
                <Navigator override={true}></Navigator>
            </Flex>
        )}
        </Popup>
    )
    }

export default PopupNavigator;