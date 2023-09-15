
import { useSignMessage, useNetwork, useAccount} from "wagmi";
import React, {useState, useContext, useEffect } from "react";
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS } from "../../data/abi";

export const Post = ({endpoint, payload, setResponse}) => {

    const postMessage = async () => {
        const response = await fetch('https://oev.api3dev.com/api' + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const data = await response.json()

        if (data != null) {
            setResponse(data)
        }
    }

    postMessage();

}

const SignPayload1 = ({endpoint, bid}) => {

    const { address } = useAccount()
    const [payload, setPayload] = useState(null);

    const { isLoading, signMessage } = useSignMessage({
        message: "1",
        onSuccess: (signature) => {
            payload.signature = signature;
            postMessage({ payload: payload });
        }
    })

    const postMessage = async ({ payload }) => {
        const response = await fetch('https://oev.api3dev.com/api/bids/place', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const data = await response.json()

        if (data != null) {

            
        }
    }

    const validUntil = new Date();
    validUntil.setMinutes(validUntil.getMinutes() + 5); 

    let params = {
        bids: [bid],
        searcherAddress: address,
        validUntil: validUntil,
        prepaymentDepositoryChainId: 11155111,
        prepaymentDepositoryAddress: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
        requestType: "API3 OEV Relay, " + (endpoint),
    }

    setPayload(params);

    const sortedBids = JSON.stringify(bid, Object.keys(bid).sort());
    const sorted = JSON.stringify(params, Object.keys(params).sort());
    const merged = sorted.replace('{}', sortedBids);

    signMessage({ message: merged });
}

export default SignPayload1;

