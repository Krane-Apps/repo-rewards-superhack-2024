import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployRepoRewards: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("RepoRewards", {
    from: deployer,
    log: true,
    autoMine: true,
  });
};

export default deployRepoRewards;

deployRepoRewards.tags = ["RepoRewards"];
