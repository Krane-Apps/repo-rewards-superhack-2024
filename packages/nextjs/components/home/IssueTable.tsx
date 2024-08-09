import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { IssueTableProps } from "~~/types/utils";

const IssueTable: React.FC<IssueTableProps> = ({ issues, onAllocateReward, repoId }) => {
  const [issueRewards, setIssueRewards] = useState<{ [key: number]: string }>({});
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const issueIds = useMemo(() => issues.map(issue => issue.id), [issues]);

  const { data: rewards, refetch } = useScaffoldContractRead({
    contractName: "RepoRewards",
    functionName: "getIssueRewards",
    args: [repoId !== null ? BigInt(repoId) : undefined, issueIds.map(id => BigInt(id))],
    watch: true,
  });

  useEffect(() => {
    if (rewards) {
      const rewardsMap: { [key: number]: string } = {};
      issueIds.forEach((id, index) => {
        rewardsMap[id] =
          rewards[index] && rewards[index] !== BigInt(0) ? `${ethers.formatEther(rewards[index])} ETH` : "No Reward";
      });
      setIssueRewards(rewardsMap);
    }
  }, [rewards, issueIds, triggerRefetch]);

  const handleAllocateReward = async (issueId: number) => {
    await onAllocateReward(issueId);
    refetch();
    setTriggerRefetch(prev => !prev);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
        <thead>
          <tr className="rounded-xl text-sm text-base-content">
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Rewards</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue.id}>
              <td className="border px-4 py-2">{issue.number}</td>
              <td className="border px-4 py-2">
                <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="link font-bold">
                  {issue.title}
                </a>
              </td>

              <td className="border px-4 py-2">
                <p className="bg-green-500 text-secondary rounded-md p-1">{issue.state.toUpperCase()}</p>
              </td>
              <td className="border px-4 py-2">
                {issueRewards[issue.id] && issueRewards[issue.id] !== "No Reward" ? (
                  issueRewards[issue.id]
                ) : (
                  <button onClick={() => handleAllocateReward(issue.id)} className="btn btn-link self-start ml-2 mt-2">
                    Allocate
                  </button>
                )}
              </td>
              <td className="border px-4 py-2">
                <p className="line-clamp-3 overflow-hidden text-ellipsis">{issue.body}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable;
