import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
    private contract: ethers.Contract;
    private provider: ethers.JsonRpcProvider;
  
    constructor(
    @Inject('Config')
    private readonly config: { 
      apiKey: string;
      contractAbi: any;
      contractAddress: string;
      baseSepoliaNet: string;
      optSepoliaNet: string;
      zoraSepoliaNet: string;
      baseMainNet: string;
    }) {
        const ALCHEMY_URL = `${this.config.baseMainNet}${this.config.apiKey}`;
        this.provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
        this.contract = new ethers.Contract(this.config.contractAddress, this.config.contractAbi, this.provider);
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }
    }

    async callDistribution(issueId: any, repoId: any, contributorGithubId: any, contributorAddress: string) {
        //will add call here
    }

    async callContractFunction(functionName: string, args: any[] = []) {
        const balance = await this.contract[functionName](...args);
        return ethers.formatEther(balance);
      }

}