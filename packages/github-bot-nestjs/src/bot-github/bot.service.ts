import { Injectable } from '@nestjs/common';
import { AttestationService } from 'src/eas/attestation.service';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class BotService {

  constructor(
    private readonly web3Service: Web3Service,
    private attestationService: AttestationService
  ) {}

  async handleIssueClosed(id: string, name: string, body: any) {
    try {
      //parsing data from github events
      const issue = JSON.parse(JSON.stringify(body.issue));
      const user = JSON.parse(JSON.stringify(issue.user));
      const repository = JSON.parse(JSON.stringify(body.repository));
      const organisation = JSON.parse(JSON.stringify(body.organization));
      const issueId = issue.id;
      const issueTitle = issue.title;
      const repoId = repository.id;
      const repoTitle = repository.name;
      const organisationName = organisation.login;
      const contributorGithubId = user.id;
      const contributorGithubUsername = user.login;
      const contributorGithubUrl = user.html_url;
      const issueUrl = issue.html_url;
      const githubRepositoryUrl = repository.html_url;
      const githubOrganisationUrl = organisation.url;
      const attestorName = 'Repo Rewards';
      const achivement = `Successfully contributed to ${organisationName}'s open-source repo ${repoTitle} by creating and submitting a pull request, demonstrating collaborative software development skills and commitment to improving opensource codebases.`;

      // Fetching Contributor WalletAddress From Contract
      const contributorAddress = await this.web3Service.getUserWalletByUsername('optSepoliaNet', contributorGithubUsername);
      
      //logging for debug purpose
      console.log(`
        issueID: ${issueId}, 
        issueTitle: ${issueTitle}, 
        repoId: ${repoId}, 
        repoTitle: ${repoTitle}, 
        contributorId: ${contributorGithubId}, 
        contributorAddress: ${contributorAddress}, 
        contributorGithubUsername ${contributorGithubUsername}, 
        organisationName: ${organisationName}`
      );

      console.log(`
        contributorGithubUrl: ${contributorGithubUrl}, 
        issueUrl: ${issueUrl}, 
        githubRepositoryUrl: ${githubRepositoryUrl}, 
        githubOrganisationUrl: ${githubOrganisationUrl}`
      );

      // Distributing Reward on Contract
      await this.web3Service.distributeReward('optSepoliaNet', repoId, issueId, contributorAddress);
      
      //Attesting Open Source Contribution
      this.attestationService.createAttestation(contributorGithubId, contributorGithubUsername, 
        issueId, issueTitle, repoId, repoTitle, organisationName, attestorName, achivement,
        contributorGithubUrl, issueUrl, githubRepositoryUrl, githubOrganisationUrl, contributorAddress
      );
    } catch(error) {
      console.error('BotService Error:', error);
    }
  }

}