import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import { contractAbi } from './repo-rewards.abi';

@Injectable()
export class Web3Service {
    private contracts: Map<string, ethers.Contract> = new Map();
  
    constructor(
    @Inject('Config')
    private readonly config: { 
      apiKey: string;
      contractAbi: any;
      contractAddressBase: string;
      contractAddressOpt: string;
      baseSepoliaNet: string;
      optSepoliaNet: string;
      privateKey: string;
    }) {
      try { 
        this.initializeContracts('optSepoliaNet', this.config.optSepoliaNet, this.config.contractAddressOpt);
        this.initializeContracts('baseSepoliaNet', this.config.baseSepoliaNet, this.config.contractAddressBase);
      } catch(error) {
        console.error('Contracts not initialized: ', error);
      }
    }

    private initializeContracts(chain: string, chainUrl: string, contractAddress: string) {
      const ALCHEMY_URL = `${chainUrl}${this.config.apiKey}`;
      const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
      const signer = new ethers.Wallet(this.config.privateKey, provider);
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        if (!contract) {
            throw new Error('Contract not initialized');
        }
      this.contracts.set(chain, contract);
    }

    async distributeReward(chain: string, repoId: number, issueId: number, contributorAddress: string): Promise<void> {
        const contract = this.contracts.get(chain);
        console.log(`Function called: distributeReward(), chain: ${chain}`);
        try {
          const tx = await contract.distributeReward(repoId, issueId, contributorAddress);
          const receipt = await tx.wait();
          console.log(`Reward distributed successfully: ${receipt}`);
        } catch (error) {
          console.error('Error distributing reward:', error);
          throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'An error occurred',
            message: error.message,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserWalletByUsername(chain: string, contributorAddress: string): Promise<string> {
      try {
          const params: any[] = [contributorAddress];
          const response = await this.callContractFunction(chain,'getUserWalletByUsername', params);
          console.log(`Wallet address of contributor fetched: ${response}`);
          return response;
      } catch (error) {
          console.error('Function called: getUserWalletByUsername(), chain: ${chain}, Web3Service Error: ', error);
          throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'An error occurred',
            message: error.message,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

    async callContractFunction(chain: string, functionName: string, args: any[]) {
        const contract = this.contracts.get(chain);
        console.log(`Function called: getUserWalletByUsername(), chain: ${chain}`);
        const balance = await contract[functionName](...args);
        return balance;
      }

}