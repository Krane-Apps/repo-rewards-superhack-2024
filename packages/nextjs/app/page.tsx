"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AllocateRewardModal from "~~/components/home/AllocateRewardModal";
import IssueTable from "~~/components/home/IssueTable";
import RegisterLogin from "~~/components/home/RegisterLogin";
import RepositoryTable from "~~/components/home/RepositoryTable";
import StatsSection from "~~/components/home/StatsSection";
import { Balance, EtherInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { Repository } from "~~/types/utils";

const contractName = "RepoRewards";
const organisations = [
  "base-org",
  "ethereum-optimism",
  "krane-apps",
  "celo-org",
  "blockscout",
  "worldcoin",
  "ethereum-attestation-service",
  "mode-network",
];
const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [repoId, setRepoId] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [rewardAmount, setRewardAmount] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const { data: deployedContractData } = useDeployedContractInfo(contractName);

  const { writeAsync: sendAddFundsTx, isMining: isAddingFunds } = useScaffoldContractWrite({
    contractName,
    functionName: "addFundToRepository",
    args: [repoId ? BigInt(repoId) : undefined],
  });

  const { writeAsync: sendAllocateRewardTx } = useScaffoldContractWrite({
    contractName,
    functionName: "allocateIssueReward",
    args: [
      repoId ? BigInt(repoId) : undefined,
      selectedIssueId ? BigInt(selectedIssueId) : undefined,
      rewardAmount ? BigInt(ethers.parseEther(rewardAmount)) : undefined,
    ],
  });

  const { data: userTypeData } = useScaffoldContractRead({
    contractName,
    functionName: "checkUserType",
    args: [connectedAddress],
  });

  const { data: repoData, refetch } = useScaffoldContractRead({
    contractName,
    functionName: "getRepository",
    args: [repoId ? BigInt(repoId) : undefined],
  });

  const stats = [
    {
      figureIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="#7e7e02"
            d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1-8-8a8 8 0 0 1-8 8a8 8 0 0 1-8 8"
          />
        </svg>
      ),
      title: selectedRepo ? "Unallocated Rewards" : "Available Funds",
      value:
        selectedRepo && repoData ? (
          `${ethers.formatEther(repoData[2])} ETH`
        ) : (
          <Balance address={deployedContractData?.address} className="p-0 text-2xl font-bold" />
        ),
      description: "Total rewards of all repositories",
      figureClassName: "text-primary ",
      valueClassName: "p-0 text-2xl font-bold",
      descriptionClassName: "",
    },
    {
      figureIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-8 w-8 stroke-current"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      title: selectedRepo ? "Open Issues" : "Repositories",
      value: selectedRepo ? issues.length.toString() : repos.length.toString(),
      description: selectedRepo ? "Total issues in the repository" : "Total repositories in the organisation",
      figureClassName: "text-primary",
      valueClassName: "",
      descriptionClassName: "",
    },
  ];

  const fetchRepos = async () => {
    const allRepos: Repository[] = [];
    for (const org of organisations) {
      const res = await axios.get(`https://api.github.com/users/${org}/repos`);
      const orgRepos = res.data.map((repo: any) => ({ ...repo, organisation: org }));
      allRepos.push(...orgRepos);
    }
    setRepos(allRepos);
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleFetchIssues = async (repo: Repository) => {
    try {
      setSelectedRepo(repo.name);
      setRepoId(repo.id);
      const res = await axios.get(`https://api.github.com/repos/${repo.organisation}/${repo.name}/issues`);
      const issuesData = res.data;
      setIssues(issuesData);
    } catch (err) {
      setIssues([]);
    }
  };

  const handleAddFunds = async () => {
    if (repoId && amount) {
      try {
        const tx = await sendAddFundsTx({
          args: [BigInt(repoId)],
          value: ethers.parseEther(amount),
        });
        refetch();
        console.log("Transaction successful:", tx);
      } catch (error) {
        console.error("Error adding funds:", error);
      }
    }
  };

  const handleAllocateIssueReward = async () => {
    if (repoId && selectedIssueId && rewardAmount) {
      try {
        const tx = await sendAllocateRewardTx();
        console.log("Reward allocation successful:", tx);
        setModalOpen(false);
      } catch (error) {
        console.error("Error allocating reward:", error);
      }
    }
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    window.location.reload();
  };

  if (showRegister) {
    return <RegisterLogin onRegisterSuccess={handleRegisterSuccess} setShowRegister={setShowRegister} />;
  }

  return (
    <>
      <div className="flex flex-col flex-grow pt-10 px-5 ">
        <div className="flex justify-between w-full mb-5">
          <StatsSection stats={stats} />
          {selectedRepo ? (
            <div className="flex flex-col">
              <button onClick={() => setSelectedRepo("")} className="btn btn-secondary mb-4 rounded-md">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Repositories
              </button>
              <div className="flex">
                <EtherInput value={amount} onChange={amount => setAmount(amount)} />
                <button onClick={handleAddFunds} className="btn rounded-two btn-primary ml-2 rounded-md">
                  {isAddingFunds ? "Adding Funds..." : `Add Funds`}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {userTypeData && userTypeData[0] == "User does not exist" ? (
                <button onClick={() => setShowRegister(!showRegister)} className="btn btn-accent rounded-md">
                  Login
                </button>
              ) : null}
            </div>
          )}
        </div>

        {selectedRepo ? (
          <IssueTable
            issues={issues}
            onAllocateReward={(issueId: number) => {
              setSelectedIssueId(issueId);
              setModalOpen(true);
            }}
            repoId={repoId}
          />
        ) : (
          <RepositoryTable onRepoSelect={repo => handleFetchIssues(repo)} />
        )}
      </div>

      <AllocateRewardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAllocate={handleAllocateIssueReward}
        rewardAmount={rewardAmount}
        setRewardAmount={setRewardAmount}
      />
    </>
  );
};

export default Home;
