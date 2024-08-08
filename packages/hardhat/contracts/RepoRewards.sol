// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RepoRewards {
	struct PoolManager {
		string username;
		uint256 githubId;
		string worldId;
		address wallet;
	}

	struct Contributor {
		string username;
		uint256 githubId;
		string worldId;
		address wallet;
	}

	struct Issue {
		uint256 issueId;
		uint256 rewardAmount;
		string status;
	}

	struct Repository {
		address[] poolManagers;
		address[] contributors;
		uint256 poolRewards;
		mapping(uint256 => Issue) issueRewards;
	}

	mapping(address => PoolManager) public poolManagers;
	mapping(address => Contributor) public contributors;
	mapping(uint256 => Repository) public repositories;

	address[] public poolManagerAddresses;
	address[] public contributorAddresses;
	address public admin;

	constructor() {
		admin = msg.sender;
	}

	modifier onlyPoolManager(uint256 repoId) {
		require(
			isPoolManager(repoId, msg.sender) || msg.sender == admin,
			"Not authorized"
		);
		_;
	}

	function isPoolManager(
		uint256 repoId,
		address manager
	) internal view returns (bool) {
		Repository storage repo = repositories[repoId];
		for (uint i = 0; i < repo.poolManagers.length; i++) {
			if (repo.poolManagers[i] == manager) {
				return true;
			}
		}
		return false;
	}

	function registerUser(
		string memory username,
		uint256 githubId,
		string memory worldId,
		string memory typeOfUser
	) external {
		if (
			keccak256(abi.encodePacked(typeOfUser)) ==
			keccak256(abi.encodePacked("PoolManager"))
		) {
			poolManagers[msg.sender] = PoolManager(
				username,
				githubId,
				worldId,
				msg.sender
			);
			poolManagerAddresses.push(msg.sender);
		} else {
			contributors[msg.sender] = Contributor(
				username,
				githubId,
				worldId,
				msg.sender
			);
			contributorAddresses.push(msg.sender);
		}
	}

	function addPoolManager(
		uint256 repoId,
		address poolManager,
		string memory username,
		uint256 githubId
	) external onlyPoolManager(repoId) {
		Repository storage repo = repositories[repoId];
		repo.poolManagers.push(poolManager);
		poolManagers[poolManager] = PoolManager(
			username,
			githubId,
			"",
			poolManager
		);
		poolManagerAddresses.push(poolManager);
	}

	function allocateIssueReward(
		uint256 repoId,
		uint256 issueId,
		uint256 reward
	) external onlyPoolManager(repoId) {
		Repository storage repo = repositories[repoId];
		require(repo.poolRewards >= reward, "Insufficient pool rewards");

		repo.issueRewards[issueId] = Issue({
			issueId: issueId,
			rewardAmount: reward,
			status: "allocated"
		});
		repo.poolRewards -= reward;
	}

	function addFundToRepository(uint256 repoId) external payable {
		Repository storage repo = repositories[repoId];
		if (repo.poolManagers.length == 0) {
			// Create a new repository if it doesn't exist
			repositories[repoId].poolManagers = new address[](0);
			repositories[repoId].contributors = new address[](0);
			// Add the sender as the pool manager
			repositories[repoId].poolManagers.push(msg.sender);
			poolManagerAddresses.push(msg.sender);
		}
		repositories[repoId].poolRewards += msg.value;
	}

	function distributeReward(
		uint256 repoId,
		uint256 issueId,
		address payable contributorAddress
	) external onlyPoolManager(repoId) {
		Repository storage repo = repositories[repoId];
		Issue storage issue = repo.issueRewards[issueId];
		uint256 reward = issue.rewardAmount;
		require(reward > 0, "No reward allocated for this issue");
		delete repo.issueRewards[issueId];
		require(
			address(this).balance >= reward,
			"Insufficient contract balance"
		);

		(bool success, ) = contributorAddress.call{ value: reward }("");
		require(success, "Reward transfer failed");
	}

	receive() external payable {}

	function getPoolManager(
		address _wallet
	) external view returns (PoolManager memory) {
		return poolManagers[_wallet];
	}

	function getContributor(
		address _wallet
	) external view returns (Contributor memory) {
		return contributors[_wallet];
	}

	function getRepository(
		uint256 _repoId
	)
		external
		view
		returns (address[] memory, address[] memory, uint256, Issue[] memory)
	{
		Repository storage repo = repositories[_repoId];
		uint256 issueCount = 0;
		for (uint i = 0; i < 1000; i++) {
			if (repo.issueRewards[i].issueId != 0) {
				issueCount++;
			}
		}
		Issue[] memory issues = new Issue[](issueCount);
		uint counter = 0;
		for (uint i = 0; i < 1000; i++) {
			if (repo.issueRewards[i].issueId != 0) {
				issues[counter] = repo.issueRewards[i];
				counter++;
			}
		}
		return (repo.poolManagers, repo.contributors, repo.poolRewards, issues);
	}

	function checkUserType(
		address _user
	) external view returns (string memory, address) {
		if (poolManagers[_user].wallet != address(0)) {
			return ("PoolManager", _user);
		} else if (contributors[_user].wallet != address(0)) {
			return ("Contributor", _user);
		} else {
			return ("User does not exist", address(0));
		}
	}

	function getUserWalletByUsername(
		string memory username
	) external view returns (address) {
		for (uint i = 0; i < poolManagerAddresses.length; i++) {
			if (
				keccak256(
					abi.encodePacked(
						poolManagers[poolManagerAddresses[i]].username
					)
				) == keccak256(abi.encodePacked(username))
			) {
				return poolManagers[poolManagerAddresses[i]].wallet;
			}
		}
		for (uint i = 0; i < contributorAddresses.length; i++) {
			if (
				keccak256(
					abi.encodePacked(
						contributors[contributorAddresses[i]].username
					)
				) == keccak256(abi.encodePacked(username))
			) {
				return contributors[contributorAddresses[i]].wallet;
			}
		}
		return address(0);
	}

	function getRepositoryRewards(
		uint256[] memory repoIds
	) external view returns (uint256[] memory) {
		uint256[] memory rewards = new uint256[](repoIds.length);
		for (uint i = 0; i < repoIds.length; i++) {
			rewards[i] = repositories[repoIds[i]].poolRewards;
		}
		return rewards;
	}
}
