import {useState} from "react";
import { VStack, Box, Text, Spacer, Flex } from '@chakra-ui/react';
import { COLORS } from "../../data/colors";
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

const Hero = ({listTitle, list, titles}) => {
    
    const [isListOpen, setIsListOpen] = useState(true);
    
  return (
        <VStack spacing={3}>
            {
            list.length === 0 ? null :
            <Box p={3} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                <Flex p={2} width={"100%"} bgColor={COLORS.main} borderRadius={"10"}>
                <Text fontWeight={"bold"} fontSize={"lg"} >{listTitle}</Text>
                <Spacer />
                {
                    isListOpen ? <TriangleUpIcon width={"24px"} height={"24px"} onClick={() => {setIsListOpen(false)}}></TriangleUpIcon> : <TriangleDownIcon width={"24px"} height={"24px"} onClick={() => {setIsListOpen(true)}}/>
                }
                </Flex>
            {
                !isListOpen ? null :
                list.map((param, index) => {
                return (
                    <Box p={1} width={"100%"} borderRadius={"10"}>
                    <Text fontWeight={"bold"} fontSize={"sm"} >{titles[index]}</Text>
                    <Text fontSize={"sm"} >{param.toString()}</Text>
                    </Box>
                )
                })
            }              
            </Box>
            }
            </VStack>
  );
};

export default Hero;