	
export const DATA_FEED_PROXY_ABI = [{"inputs":[{"internalType":"address","name":"_api3ServerV1","type":"address"},{"internalType":"bytes32","name":"_dataFeedId","type":"bytes32"},{"internalType":"address","name":"_oevBeneficiary","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"api3ServerV1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dataFeedId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oevBeneficiary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"read","outputs":[{"internalType":"int224","name":"value","type":"int224"},{"internalType":"uint32","name":"timestamp","type":"uint32"}],"stateMutability":"view","type":"function"}]

export const API3SERVERV1_ABI = [
	{
		"inputs": [
			{
				"internalType": "bytes[]",
				"name": "data",
				"type": "bytes[]"
			}
		],
		"name": "multicall",
		"outputs": [
			{
				"internalType": "bytes[]",
				"name": "returndata",
				"type": "bytes[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dapiName",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "dataFeedId",
				"type": "bytes32"
			}
		],
		"name": "setDapiName",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_accessControlRegistry",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_adminRoleDescription",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_manager",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "dataFeedId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "dapiName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "SetDapiName",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes[]",
				"name": "data",
				"type": "bytes[]"
			}
		],
		"name": "tryMulticall",
		"outputs": [
			{
				"internalType": "bool[]",
				"name": "successes",
				"type": "bool[]"
			},
			{
				"internalType": "bytes[]",
				"name": "returndata",
				"type": "bytes[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "beaconIds",
				"type": "bytes32[]"
			}
		],
		"name": "updateBeaconSetWithBeacons",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "beaconSetId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "airnode",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "templateId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "updateBeaconWithSignedData",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "beaconId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "beaconSetId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"name": "UpdatedBeaconSetWithBeacons",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "beaconId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"name": "UpdatedBeaconWithSignedData",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "beaconSetId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "proxy",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "updateId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"name": "UpdatedOevProxyBeaconSetWithSignedData",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "beaconId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "proxy",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "updateId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"name": "UpdatedOevProxyBeaconWithSignedData",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "oevProxy",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "dataFeedId",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "updateId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			},
			{
				"internalType": "bytes[]",
				"name": "packedOevUpdateSignatures",
				"type": "bytes[]"
			}
		],
		"name": "updateOevProxyDataFeedWithSignedData",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "oevProxy",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "oevProxy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "oevBeneficiary",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrew",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "accessControlRegistry",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminRole",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminRoleDescription",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "containsBytecode",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DAPI_NAME_SETTER_ROLE_DESCRIPTION",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "dapiNameHashToDataFeedId",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dapiNameSetterRole",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dapiName",
				"type": "bytes32"
			}
		],
		"name": "dapiNameToDataFeedId",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dataFeedId",
				"type": "bytes32"
			}
		],
		"name": "dataFeeds",
		"outputs": [
			{
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBlockBasefee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBlockNumber",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBlockTimestamp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getChainId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "oevProxyToBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "proxy",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "dataFeedId",
				"type": "bytes32"
			}
		],
		"name": "oevProxyToIdToDataFeed",
		"outputs": [
			{
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dapiNameHash",
				"type": "bytes32"
			}
		],
		"name": "readDataFeedWithDapiNameHash",
		"outputs": [
			{
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dapiNameHash",
				"type": "bytes32"
			}
		],
		"name": "readDataFeedWithDapiNameHashAsOevProxy",
		"outputs": [
			{
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dataFeedId",
				"type": "bytes32"
			}
		],
		"name": "readDataFeedWithId",
		"outputs": [
			{
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dataFeedId",
				"type": "bytes32"
			}
		],
		"name": "readDataFeedWithIdAsOevProxy",
		"outputs": [
			{
				"internalType": "int224",
				"name": "value",
				"type": "int224"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export const UpdatedOevProxyBeaconSetWithSignedData = [
	{
	  "internalType": "address",
	  "name": "oevProxy",
	  "type": "address"
	},
	{
	  "internalType": "bytes32",
	  "name": "dataFeedId",
	  "type": "bytes32"
	},
	{
	  "internalType": "bytes32",
	  "name": "updateId",
	  "type": "bytes32"
	},
	{
	  "internalType": "uint256",
	  "name": "timestamp",
	  "type": "uint256"
	},
	{
	  "internalType": "bytes",
	  "name": "data",
	  "type": "bytes"
	},
	{
	  "internalType": "bytes[]",
	  "name": "packedOevUpdateSignatures",
	  "type": "bytes[]"
	}
  ]

export const ABI = [
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "dapiName",
				type: "bytes32"
			},
			{
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "deployDapiProxy",
		outputs: [
			{
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "dapiName",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "oevBeneficiary",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "deployDapiProxyWithOev",
		outputs: [
			{
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "dataFeedId",
				type: "bytes32"
			},
			{
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "deployDataFeedProxy",
		outputs: [
			{
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "dataFeedId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "oevBeneficiary",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "deployDataFeedProxyWithOev",
		outputs: [
			{
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_api3ServerV1",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "dapiName",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "DeployedDapiProxy",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "dapiName",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "address",
				name: "oevBeneficiary",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "DeployedDapiProxyWithOev",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "dataFeedId",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "DeployedDataFeedProxy",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "dataFeedId",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "address",
				name: "oevBeneficiary",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "DeployedDataFeedProxyWithOev",
		type: "event"
	},
	{
		inputs: [],
		name: "api3ServerV1",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "dapiName",
				type: "bytes32"
			},
			{
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "computeDapiProxyAddress",
		outputs: [
			{
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "dapiName",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "oevBeneficiary",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "computeDapiProxyWithOevAddress",
		outputs: [
			{
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "dataFeedId",
				type: "bytes32"
			},
			{
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "computeDataFeedProxyAddress",
		outputs: [
			{
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "dataFeedId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "oevBeneficiary",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "metadata",
				type: "bytes"
			}
		],
		name: "computeDataFeedProxyWithOevAddress",
		outputs: [
			{
				internalType: "address",
				name: "proxyAddress",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

export const TOKEN_NAME = "TestnetUSDC";
export const TOKEN_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "InvalidShortString", type: "error" },
  {
    inputs: [{ internalType: "string", name: "str", type: "string" }],
    name: "StringTooLong",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "EIP712DomainChanged", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { internalType: "bytes1", name: "fields", type: "bytes1" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "version", type: "string" },
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "verifyingContract", type: "address" },
      { internalType: "bytes32", name: "salt", type: "bytes32" },
      { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

export const PREPAYMENT_DEPOSIT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "applyPermitAndDeposit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_accessControlRegistry",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_adminRoleDescription",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_manager",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "Claimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "DecreasedUserWithdrawalLimit",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "decreaseUserWithdrawalLimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "Deposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "IncreasedUserWithdrawalLimit",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "increaseUserWithdrawalLimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes[]",
				"name": "data",
				"type": "bytes[]"
			}
		],
		"name": "multicall",
		"outputs": [
			{
				"internalType": "bytes[]",
				"name": "returndata",
				"type": "bytes[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "withdrawalDestination",
				"type": "address"
			}
		],
		"name": "setWithdrawalDestination",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "withdrawalDestination",
				"type": "address"
			}
		],
		"name": "SetWithdrawalDestination",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes[]",
				"name": "data",
				"type": "bytes[]"
			}
		],
		"name": "tryMulticall",
		"outputs": [
			{
				"internalType": "bool[]",
				"name": "successes",
				"type": "bool[]"
			},
			{
				"internalType": "bytes[]",
				"name": "returndata",
				"type": "bytes[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "expirationTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "withdrawalSigner",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "withdraw",
		"outputs": [
			{
				"internalType": "address",
				"name": "withdrawalDestination",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "withdrawalHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expirationTimestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "withdrawalSigner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "withdrawalDestination",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "withdrawalLimit",
				"type": "uint256"
			}
		],
		"name": "Withdrew",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "accessControlRegistry",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminRole",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminRoleDescription",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CLAIMER_ROLE_DESCRIPTION",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimerRole",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "USER_WITHDRAWAL_LIMIT_DECREASER_ROLE_DESCRIPTION",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "USER_WITHDRAWAL_LIMIT_INCREASER_ROLE_DESCRIPTION",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userToWithdrawalDestination",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userToWithdrawalLimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userWithdrawalLimitDecreaserRole",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userWithdrawalLimitIncreaserRole",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WITHDRAWAL_SIGNER_ROLE_DESCRIPTION",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawalSignerRole",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "withdrawalWithHashIsExecuted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export const SIGNTYPEDDATA = {
	Permit: [
	  {
		name: 'owner',
		type: 'address',
	  },
	  {
		name: 'spender',
		type: 'address',
	  },
	  {
		name: 'value',
		type: 'uint256',
	  },
	  {
		name: 'nonce',
		type: 'uint256',
	  },
	  {
		name: 'deadline',
		type: 'uint256',
	  },
	],
  }
