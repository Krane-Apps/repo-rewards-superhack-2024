export const contractAbi = [
	{
	  inputs: [],
	  stateMutability: "nonpayable",
	  type: "constructor",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "repoId",
		  type: "uint256",
		},
	  ],
	  name: "addFundToRepository",
	  outputs: [],
	  stateMutability: "payable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "repoId",
		  type: "uint256",
		},
		{
		  internalType: "address",
		  name: "poolManager",
		  type: "address",
		},
		{
		  internalType: "string",
		  name: "username",
		  type: "string",
		},
		{
		  internalType: "uint256",
		  name: "githubId",
		  type: "uint256",
		},
	  ],
	  name: "addPoolManager",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "admin",
	  outputs: [
		{
		  internalType: "address",
		  name: "",
		  type: "address",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "repoId",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "issueId",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "reward",
		  type: "uint256",
		},
	  ],
	  name: "allocateIssueReward",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_user",
		  type: "address",
		},
	  ],
	  name: "checkUserType",
	  outputs: [
		{
		  internalType: "string",
		  name: "",
		  type: "string",
		},
		{
		  internalType: "address",
		  name: "",
		  type: "address",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  name: "contributorAddresses",
	  outputs: [
		{
		  internalType: "address",
		  name: "",
		  type: "address",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "",
		  type: "address",
		},
	  ],
	  name: "contributors",
	  outputs: [
		{
		  internalType: "string",
		  name: "username",
		  type: "string",
		},
		{
		  internalType: "uint256",
		  name: "githubId",
		  type: "uint256",
		},
		{
		  internalType: "string",
		  name: "worldId",
		  type: "string",
		},
		{
		  internalType: "address",
		  name: "wallet",
		  type: "address",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "repoId",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "issueId",
		  type: "uint256",
		},
		{
		  internalType: "address payable",
		  name: "contributorAddress",
		  type: "address",
		},
	  ],
	  name: "distributeReward",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_wallet",
		  type: "address",
		},
	  ],
	  name: "getContributor",
	  outputs: [
		{
		  components: [
			{
			  internalType: "string",
			  name: "username",
			  type: "string",
			},
			{
			  internalType: "uint256",
			  name: "githubId",
			  type: "uint256",
			},
			{
			  internalType: "string",
			  name: "worldId",
			  type: "string",
			},
			{
			  internalType: "address",
			  name: "wallet",
			  type: "address",
			},
		  ],
		  internalType: "struct RepoRewards.Contributor",
		  name: "",
		  type: "tuple",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "repoId",
		  type: "uint256",
		},
		{
		  internalType: "uint256[]",
		  name: "issueIds",
		  type: "uint256[]",
		},
	  ],
	  name: "getIssueRewards",
	  outputs: [
		{
		  internalType: "uint256[]",
		  name: "",
		  type: "uint256[]",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_wallet",
		  type: "address",
		},
	  ],
	  name: "getPoolManager",
	  outputs: [
		{
		  components: [
			{
			  internalType: "string",
			  name: "username",
			  type: "string",
			},
			{
			  internalType: "uint256",
			  name: "githubId",
			  type: "uint256",
			},
			{
			  internalType: "string",
			  name: "worldId",
			  type: "string",
			},
			{
			  internalType: "address",
			  name: "wallet",
			  type: "address",
			},
		  ],
		  internalType: "struct RepoRewards.PoolManager",
		  name: "",
		  type: "tuple",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "_repoId",
		  type: "uint256",
		},
	  ],
	  name: "getRepository",
	  outputs: [
		{
		  internalType: "address[]",
		  name: "",
		  type: "address[]",
		},
		{
		  internalType: "address[]",
		  name: "",
		  type: "address[]",
		},
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
		{
		  components: [
			{
			  internalType: "uint256",
			  name: "issueId",
			  type: "uint256",
			},
			{
			  internalType: "uint256",
			  name: "rewardAmount",
			  type: "uint256",
			},
			{
			  internalType: "string",
			  name: "status",
			  type: "string",
			},
		  ],
		  internalType: "struct RepoRewards.Issue[]",
		  name: "",
		  type: "tuple[]",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256[]",
		  name: "repoIds",
		  type: "uint256[]",
		},
	  ],
	  name: "getRepositoryRewards",
	  outputs: [
		{
		  internalType: "uint256[]",
		  name: "",
		  type: "uint256[]",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "string",
		  name: "username",
		  type: "string",
		},
	  ],
	  name: "getUserWalletByUsername",
	  outputs: [
		{
		  internalType: "address",
		  name: "",
		  type: "address",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  name: "poolManagerAddresses",
	  outputs: [
		{
		  internalType: "address",
		  name: "",
		  type: "address",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "",
		  type: "address",
		},
	  ],
	  name: "poolManagers",
	  outputs: [
		{
		  internalType: "string",
		  name: "username",
		  type: "string",
		},
		{
		  internalType: "uint256",
		  name: "githubId",
		  type: "uint256",
		},
		{
		  internalType: "string",
		  name: "worldId",
		  type: "string",
		},
		{
		  internalType: "address",
		  name: "wallet",
		  type: "address",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "string",
		  name: "username",
		  type: "string",
		},
		{
		  internalType: "uint256",
		  name: "githubId",
		  type: "uint256",
		},
		{
		  internalType: "string",
		  name: "worldId",
		  type: "string",
		},
		{
		  internalType: "string",
		  name: "typeOfUser",
		  type: "string",
		},
	  ],
	  name: "registerUser",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  name: "repositories",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "poolRewards",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "issueCount",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  stateMutability: "payable",
	  type: "receive",
	},
  ]