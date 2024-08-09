import { Dispatch, SetStateAction } from "react";

export type Tuple<T, MaxLength extends number = 10, Current extends T[] = []> = Current["length"] extends MaxLength
  ? Current
  : Current | Tuple<T, MaxLength, [T, ...Current]>;

export enum UserRole {
  PoolManager = "PoolManager",
  Contributor = "Contributor",
}

export interface Repository {
  id: number;
  name: string;
  html_url: string;
  description: string;
  organisation: string;
}

export interface RepositoryTableProps {
  onRepoSelect: (repo: Repository) => void;
}

export interface Issue {
  id: number;
  number: number;
  html_url: string;
  title: string;
  body: string;
  state: string;
  reward?: string;
}

export interface IssueTableProps {
  issues: Issue[];
  onAllocateReward: (issueId: number) => void;
  repoId: number | null;
}

export interface AllocateRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllocate: () => void;
  rewardAmount: string;
  setRewardAmount: Dispatch<SetStateAction<string>>;
}
