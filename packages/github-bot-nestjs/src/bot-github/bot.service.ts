import { Injectable } from '@nestjs/common';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class BotService {

  constructor(
    private readonly web3Service: Web3Service,
  ) {}

  async handleIssueClosed(id: string, name: string, body: any) {
    const issue = JSON.parse(JSON.stringify(body.issue));
    const user = JSON.parse(JSON.stringify(issue.user));
    const repository = JSON.parse(JSON.stringify(body.repository));
    const issueId = issue.id;
    const repoId = repository.id;
    const contributorGithubId = user.id;
    const contributorAddress = '1234'; //get this from smart contract
    console.log(`issueID: ${issueId}, repoId: ${repoId}, 
      contributorId: ${contributorGithubId}, contributorAddress: ${contributorAddress}`);
    this.web3Service.callDistribution(issueId, repoId, contributorGithubId, contributorAddress);
  }

}