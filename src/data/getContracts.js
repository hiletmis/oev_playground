import { references } from "@nodary/contracts";
import {references as testnetUsdc} from "@nodary/testnet-usdc";
import * as airnodeProtocolV1 from '@api3/airnode-protocol-v1';

export const PROXY_FACTORY_CONTRACT_ADDRESS = (chainId) => {
	return airnodeProtocolV1.references["ProxyFactory"][chainId];
};			

export const API3SERVERV1 = (chainId) => {
	return airnodeProtocolV1.references["Api3ServerV1"][chainId];
};	

export const TOKEN_CONTRACT_ADDRESS = testnetUsdc.TestnetUsdc[11155111]

export const PREPAYMENT_DEPOSIT_CONTRACT_ADDRESS = references["PrepaymentDepository"][11155111];
