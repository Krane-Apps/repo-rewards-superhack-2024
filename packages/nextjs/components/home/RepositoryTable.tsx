import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { Repository, RepositoryTableProps } from "~~/types/utils";

const organisations = [
  { name: "base-org", shortName: "Base", chipStyle: "bg-blue-500 text-white" },
  { name: "ethereum-optimism", shortName: "Optimism", chipStyle: "bg-red-500 text-white" },
  { name: "krane-apps", shortName: "Krane", chipStyle: "bg-yellow-500 text-black" },
  { name: "celo-org", shortName: "Celo", chipStyle: "bg-yellow-300 text-black" },
  { name: "blockscout", shortName: "Blockscout", chipStyle: "bg-gray-500 text-white" },
  { name: "worldcoin", shortName: "Worldcoin", chipStyle: "bg-black text-white" },
  { name: "ethereum-attestation-service", shortName: "EAS", chipStyle: "bg-blue-700 text-white" },
  { name: "mode-network", shortName: "Mode", chipStyle: "bg-yellow-700 text-white" },
];

const RepositoryTable: React.FC<RepositoryTableProps> = ({ onRepoSelect }) => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [repoIds, setRepoIds] = useState<bigint[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchRepos = async () => {
      const allRepos: Repository[] = [];
      for (const org of organisations) {
        const res = await axios.get(`https://api.github.com/users/${org.name}/repos`);
        const orgRepos = res.data.map((repo: Repository) => ({ ...repo, organisation: org.name }));
        allRepos.push(...orgRepos);
      }
      setRepos(allRepos);
      setRepoIds(allRepos.map(repo => BigInt(repo.id)));
    };
    fetchRepos();
  }, []);

  const { data: rewards } = useScaffoldContractRead({
    contractName: "RepoRewards",
    functionName: "getRepositoryRewards",
    args: [repoIds],
  });

  const sortedRepos = repos
    .map((repo, index) => ({
      ...repo,
      reward: rewards && rewards[index] !== undefined ? ethers.formatEther(rewards[index]) : "0",
    }))
    .sort((a, b) => parseFloat(b.reward) - parseFloat(a.reward));

  const filteredRepos = sortedRepos.filter(
    repo =>
      repo.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border border-gray-300 rounded-md justify-start max-w-md"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="flex flex-col items-center px-4 md:px-0 mr-3">
        <div className="overflow-x-auto w-full shadow-2xl rounded-xl bg-white">
          <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
            <thead>
              <tr className="rounded-xl text-sm text-base-content">
                <th className="bg-primary">Sr. No.</th>
                <th className="bg-primary">Organisation</th>
                <th className="bg-primary">Repo Name</th>
                <th className="bg-primary">Total Rewards</th>
                <th className="bg-primary">Actions</th>
                <th className="bg-primary">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepos.map((repo, index) => {
                const org = organisations.find(o => o.name === repo.organisation);
                return (
                  <tr key={repo.id} className="hover text-sm cursor-pointer">
                    <td className="border px-4 py-1">{index + 1}</td>
                    <td className="border px-4 py-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${org?.chipStyle}`}>
                        {org?.shortName}
                      </span>
                    </td>
                    <td className="border px-4 py-1">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="link font-bold">
                        {repo.name}
                      </a>
                    </td>
                    <td className="border px-4 py-1">{repo.reward !== "0" ? `${repo.reward} ETH` : "Loading..."}</td>
                    <td className="border px-4 py-1">
                      <button onClick={() => onRepoSelect(repo)} className="btn-link text-red-700">
                        View Issues
                      </button>
                    </td>
                    <td className="border px-4 py-1">{repo.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RepositoryTable;
