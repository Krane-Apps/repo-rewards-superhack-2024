# Repo Rewards

RepoRewards is a cool blockchain-based platform designed to make rewarding open-source contributions on GitHub super easy and transparent.

## Table of Contents

- [Deployed Contracts](#deployed-contracts)
- [Live Project](#live-project)
- [Project Overview](#project-overview)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)

---

## Deployed Contracts

| Network                    | Explorer Link                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Optimism Sepolia**       | [View on Explorer](https://sepolia-optimism.etherscan.io/address/0x78B3b2E85D678C4ADd2C46b47e0a1B632342Df59)                      |
| **Base Sepolia**           | [View on Explorer](https://sepolia.basescan.org/address/0xB7401564Db89c1402704FCA219f80c4174FCb652)                               |
| **Celo Alfajores Testnet** | [View on Explorer](https://explorer.celo.org/alfajores/address/0xACE638d0d36Bd6Cb3f8fEB9739F59492c4e2D13E/contracts#address-tabs) |
| **Mode Testnet**           | [View on Explorer](https://sepolia.explorer.mode.network/address/0xB7401564Db89c1402704FCA219f80c4174FCb652)                      |

## Live Project

Explore the live application [here](https://repo-rewards.vercel.app/).

## Project Overview

### Problem Statement

In the world of open-source, there's a big issue: developers often don't get paid for their hard work. This isn't just frustrating—it's a real problem. Developers spend hours, even days, contributing to projects, but without payment or recognition, it can be incredibly demotivating. Worse, they have no proof to show future employers, making it tough to showcase their skills.

For open-source organizations, this lack of incentives slows down progress. Projects that could drive innovation get delayed or even abandoned. So, not only are developers losing out, but the entire open-source community suffers, slowing down the pace of technological advancement. We need to fix this to keep open source thriving.

### Solution

Repo Rewards addresses these challenges by:

- **Automated Contribution Tracking**: Integrates with GitHub to monitor and recognize contributions in real-time.
- **Decentralized Identity Verification**: Utilizes Worldcoin's World ID for secure and private user verification without compromising anonymity.
- **Transparent Reward Distribution**: Employs smart contracts to manage and distribute rewards transparently and automatically.
- **Attestations via EAS**: Implements Ethereum Attestation Service (EAS) to attest to user actions and contributions, ensuring data integrity and trustworthiness.

## Technical Stack

- **Frontend**: React with Next.js framework.
- **Smart Contracts**: Solidity, deployed using Hardhat.
- **Blockchain Networks**: Optimism Sepolia, Base Sepolia, Celo Alfajores Testnet, Mode Testnet.
- **Identity Verification**: [Worldcoin's World ID](https://worldcoin.org/).
- **Attestations**: [Ethereum Attestation Service (EAS)](https://attest.sh/).
- **Authentication**: Firebase Auth with GitHub provider.
- **API Integration**: Axios for HTTP requests.

## Project Structure

```sh
   repo-rewards/
   ├── packages/
   │ ├── hardhat/ # Smart contracts and deployment scripts
   │ └── github-bot-nestjs/ # nest.js backend application
   │ └── nextjs/ # Frontend application
      │ ├── components/ # React components
      │ ├── hooks/ # Custom React hooks
      │ ├── pages/ # Next.js pages
      │ ├── public/ # Static assets
      │ └── utils/ # Utility functions and configurations
   ├── .gitignore
   ├── README.md
   └── package.json
```

# Smart Contracts

The core smart contract, **RepoRewards**, facilitates the registration of users (both Pool Managers and Contributors) and manages the reward distribution. Key functionalities include:

- **User Registration**: Allows users to register by providing their GitHub username, GitHub ID, World ID, and selected role.
- **Reward Distribution**: Automates the distribution of rewards based on predefined criteria and contributions.

## Quickstart

To get started with Repo Rewards (Scaffold-OP), follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/ethereum-optimism/scaffold-op.git
cd scaffold-op
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On the same terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`
