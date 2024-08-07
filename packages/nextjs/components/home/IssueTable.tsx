import React from "react";
import { IssueTableProps } from "~~/types/utils";

const IssueTable: React.FC<IssueTableProps> = ({ issues, onAllocateReward }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
        <thead>
          <tr className="rounded-xl text-sm text-base-content">
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Rewards</th>
            <th>Actions</th>
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
              <td className="border px-4 py-2">{issue.body}</td>
              <td className="border px-4 py-2">
                <p className="bg-green-500 text-secondary rounded-md p-1">{issue.state.toUpperCase()}</p>
              </td>
              <td className="border px-4 py-2">{issue.reward || "No Reward"}</td>
              <td className="border px-4 py-2 items-center">
                <button onClick={() => onAllocateReward(issue.id)} className="btn btn-link self-start ml-2 mt-2">
                  Allocate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable;
