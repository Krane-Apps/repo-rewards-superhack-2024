import { useEffect, useState } from "react";
import axios from "axios";
import { Repository, RepositoryTableProps } from "~~/types/utils";

const organisations = ["base-org", "ethereum-optimism", "krane-apps"];

const RepositoryTable: React.FC<RepositoryTableProps> = ({ onRepoSelect }) => {
  const [repos, setRepos] = useState<Repository[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const allRepos: Repository[] = [];
      for (const org of organisations) {
        const res = await axios.get(`https://api.github.com/users/${org}/repos`);
        const orgRepos = res.data.map((repo: Repository) => ({ ...repo, organisation: org }));
        allRepos.push(...orgRepos);
      }
      setRepos(allRepos);
    };
    fetchRepos();
  }, []);

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl bg-white">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">Sr. No.</th>
              <th className="bg-primary">Organisation</th>
              <th className="bg-primary">Repo Name</th>
              <th className="bg-primary">Description</th>
              <th className="bg-primary">Total Rewards</th>
              <th className="bg-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo, index) => (
              <tr key={repo.id} className="hover text-sm cursor-pointer">
                <td className="border px-4 py-1">{index + 1}</td>
                <td className="border px-4 py-1">{repo.organisation}</td>
                <td className="border px-4 py-1">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="link font-bold">
                    {repo.name}
                  </a>
                </td>
                <td className="border px-4 py-1">{repo.description}</td>
                <td className="border px-4 py-1">0 ETH</td>
                <td className="border px-4 py-1">
                  <button onClick={() => onRepoSelect(repo)} className="btn-link text-red-700">
                    View Issues
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepositoryTable;
