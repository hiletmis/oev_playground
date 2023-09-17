import { useState} from "react";
import { useNetwork, useSignMessage, useAccount } from "wagmi";
import { PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS } from "../../data/abi";

export const GetConfiguration = ({setResponse, setError}) => {
    fetch("https://oev.api3dev.com/api/configuration")
    .then((response) => response.json())
    .then((data) => {
        setResponse(data);
    })
    .catch((error) => {
        setError(error);
    });

}


export const POST = ({setResponse, setError, endpoint, payload}) => {
    fetch("https://oev.api3dev.com/api/" + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then((response) => response.json())
    .then((data) => {
        setResponse(data);
    })
    .catch((error) => {
        setError(error);
    });
}


export const PostStatus = ({address, setPayload, setMessage}) => {

    const validUntil = new Date();
    validUntil.setMinutes(validUntil.getMinutes() + 15);
    let payload = {
        searcherAddress: address,
        validUntil: validUntil,
        prepaymentDepositoryChainId: 11155111,
        prepaymentDepositoryAddress: PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS,
        requestType: 'API3 OEV Relay, status',
    }

    setPayload(payload);
    const sorted = JSON.stringify(payload, Object.keys(payload).sort());
    setMessage(sorted);
}