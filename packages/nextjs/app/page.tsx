"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { Balance } from "~~/components/scaffold-eth";
import { EtherInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const contractName = "RepoRewards";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();
  const [repos, setRepos] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [repoId, setRepoId] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  // const [error, setError] = useState<string | null>(null);
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { writeAsync: sendAddFundsTx, isMining: isAddingFunds } = useScaffoldContractWrite({
    contractName,
    functionName: "addFundToRepository",
    args: [undefined],
  });
  const { writeAsync: sendAllocateRewardTx, isMining: isAllocatingReward } = useScaffoldContractWrite({
    contractName,
    functionName: "allocateIssueReward",
    args: [undefined, undefined, undefined],
  });

  // const contractAddress = deployedContractData?.address;
  // const contractAbi = deployedContractData?.abi;

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get("https://api.github.com/users/ethereum-optimism/repos");
        console.log("res.data repo ==", res.data);
        setRepos(res.data);
      } catch (err) {
        // setError("Failed to fetch repositories. Please try again.");
        setRepos([]);
      }
    };
    fetchRepos();
  }, []);

  const handleFetchIssues = async (repoName: string, repoId: number) => {
    try {
      const res = await axios.get(`https://api.github.com/repos/ethereum-optimism/${repoName}/issues`);
      setIssues(res.data);
      setSelectedRepo(repoName);
      setRepoId(repoId);
      // fetchRepositoryDetails(repoId);
    } catch (err) {
      // setError("Failed to fetch issues. Please try again.");
      setIssues([]);
    }
  };

  // const fetchRepositoryDetails = async (repoId: number) => {
  //   try {
  //     const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  //     const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  //     const repoDetails = await contract.getRepository(repoId);
  //     const poolRewards = ethers.formatEther(repoDetails[2]);
  //     setRepos(prevRepos => prevRepos.map(repo => (repo.id === repoId ? { ...repo, poolRewards } : repo)));
  //   } catch (error) {
  //     console.error("Error fetching repository details:", error);
  //   }
  // };

  const handleAddFunds = async () => {
    if (repoId && amount) {
      try {
        const tx = await sendAddFundsTx({
          args: [BigInt(repoId)],
          value: ethers.parseEther(amount),
        });
        console.log("Transaction successful:", tx);
      } catch (error) {
        console.error("Error adding funds:", error);
      }
    }
  };

  const handleAllocateIssueReward = async (issueId: number, rewardAmount: string) => {
    if (repoId) {
      try {
        const tx = await sendAllocateRewardTx({
          args: [BigInt(repoId), BigInt(issueId), BigInt(ethers.parseEther(rewardAmount))],
        });
        console.log("Reward allocation successful:", tx);
      } catch (error) {
        console.error("Error allocating reward:", error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col flex-grow pt-10 px-5">
        <div className="flex justify-between w-full mb-5">
          <div className="flex">
            <h2 className="text-xl font-bold">Organisation Balance:</h2>
            <Balance address={deployedContractData?.address} className="px-3 min-h-[1rem] text-xl font-bold" />
          </div>
          {repoId && (
            <div className="text-right flex">
              <div className="flex">
                <EtherInput value={amount} onChange={amount => setAmount(amount)} />
              </div>
              <button onClick={handleAddFunds} className="btn rounded-two btn-primary ml-2">
                {isAddingFunds ? "Adding Funds..." : `Add Funds to ${selectedRepo}`}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-grow">
          <div className="w-1/2 p-4 bg-base-300 rounded-md mx-2">
            <h2 className="text-2xl font-bold mb-4">Repositories</h2>
            {repos.length > 0 ? (
              repos.map(repo => (
                <div key={repo.id} className="card bg-base-100 shadow-lg p-4 mb-4">
                  <div className="flex flex-col" onClick={() => handleFetchIssues(repo.name, repo.id)}>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link font-bold text-lg"
                    >
                      {repo.name} ({repo.id})
                    </a>
                    <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
                    {repo.poolRewards && <p className="text-sm font-bold mt-1">Pool Rewards: {repo.poolRewards} ETH</p>}
                  </div>
                </div>
              ))
            ) : (
              <p>No repositories found.</p>
            )}
          </div>

          <div className="w-1/2 p-4 bg-base-300 rounded-md">
            {selectedRepo ? (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {issues.length} Open Issues in {selectedRepo}
                </h2>
                {issues.length > 0 ? (
                  <div>
                    {issues.map(issue => (
                      <div key={issue.id} className="card bg-base-100 shadow-lg p-4 mb-4 flex justify-between">
                        <div className="flex-grow">
                          <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="link font-bold">
                            {issue.title}
                          </a>
                          <p>{issue.body}</p>
                        </div>
                        <div className="flex items-center">
                          <EtherInput
                            value={issue.rewardAmount}
                            onChange={reward => handleAllocateIssueReward(issue.id, reward)}
                          />
                          <button
                            onClick={() => handleAllocateIssueReward(issue.id, issue.rewardAmount)}
                            className="btn btn-primary self-start ml-2"
                          >
                            {isAllocatingReward ? "Allocating..." : "Allocate Reward"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No issues found.</p>
                )}
              </>
            ) : (
              <h2 className="text-2xl font-bold mb-4">Please select a repository to see issues</h2>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
