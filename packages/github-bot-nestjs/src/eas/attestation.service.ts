// attestation.service.ts
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { map, Observable } from 'rxjs';
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

@Injectable()
export class AttestationService {
  private eas: EAS;
  private signer: ethers.Wallet;
  private apolloClient: ApolloClient<any>;

  constructor(
    @Inject('Config')
    private readonly config: { 
      apiKey: string;
      baseSepoliaNet: string;
      optSepoliaNet: string;
      privateKey: string
    }) {
        const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021"; // OP Sepolia address
        const ALCHEMY_URL = `${this.config.optSepoliaNet}${this.config.apiKey}`;
        const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
        this.signer = new ethers.Wallet(this.config.privateKey, provider);
        this.eas = new EAS(EAS_CONTRACT_ADDRESS);
        this.eas.connect(this.signer);

        this.apolloClient = new ApolloClient({
          link: new HttpLink({ uri: 'https://optimism-sepolia.easscan.org/graphql', fetch }),
          cache: new InMemoryCache(),
        });
    }

  async createAttestation(
    contributorGithubId: string,
    contributorGithubUsername: string,
    issueId: string,
    issueTitle: string,
    repoId: string,
    repoTitle: string,
    organisationName: string,
    attestorName: string,
    achivement: string,
    contributorGithubUrl: string,
    issueUrl: string,
    githubRepositoryUrl: string,
    githubOrganisationUrl: string,
    contributorAddress: any
  ) {
    try {
      const schemaUID = "0xb022941841c03fab69d4e4a55de2b8c9159ead78c7d6ee62b3f7e17d16e427f1";
      const schemaEncoder = new SchemaEncoder("string Contributor_Github_Username,string Achievement,string Issue_Title,string Github_Repository,string Github_Organisation,string Attestor,string Contributor_Github_Url,string Issue_Url,string Github_Repository_Url,string Github_Organisation_Url,uint40 Contributor_Github_Id,uint40 Issue_Id,uint40 Github_Repository_Id");
      const encodedData = schemaEncoder.encodeData([
        { name: "Contributor_Github_Username", value: contributorGithubUsername, type: "string" },
        { name: "Achievement", value: achivement, type: "string" },
        { name: "Issue_Title", value: issueTitle, type: "string" },
        { name: "Github_Repository", value: repoTitle, type: "string" },
        { name: "Github_Organisation", value: organisationName, type: "string" },
        { name: "Attestor", value: attestorName, type: "string" },
        { name: "Contributor_Github_Url", value: contributorGithubUrl, type: "string" },
        { name: "Issue_Url", value: issueUrl, type: "string" },
        { name: "Github_Repository_Url", value: githubRepositoryUrl, type: "string" },
        { name: "Github_Organisation_Url", value: githubOrganisationUrl, type: "string" },
        { name: "Contributor_Github_Id", value: Number(contributorGithubId), type: "uint40" },
        { name: "Issue_Id", value: Number(issueId), type: "uint40" },
        { name: "Github_Repository_Id", value: Number(repoId), type: "uint40" }
      ]);

      const tx = await this.eas.attest({
        schema: schemaUID,
        data: {
          recipient: contributorAddress,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      console.log("New attestation UID:", newAttestationUID);
    } catch(error) {
      console.error('AttestationService Error: ', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'An error occurred',
        message: error.message,
    }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAttestationsByRecipient(recipientAddress: string): Promise<any> {
      const GET_ATTESTATIONS = gql`
        query AttestationsByRecipient($recipient: String!) {
          attestations(
            where: { recipient: { equals: $recipient }}
            orderBy: { time: desc }
          ) {
            id
            attester
            recipient
            revocable
            data
            time
            decodedDataJson
            isOffchain
            schema {
              schema
            }
          }
        }
      `;

      try {
        const { data } = await this.apolloClient.query({
          query: GET_ATTESTATIONS,
          variables: {
            recipient: recipientAddress,
          },
        });
        console.log(`Attestations found for Recipient: ${recipientAddress}, Total: `, data.attestations.length);
        return data.attestations;
      } catch (error) {
        console.error('AttestationService Error, error fetching attestations:', error);
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred',
          message: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  async getAttestationsByAttester(attesterAddress: string): Promise<any> {
    const GET_ATTESTATIONS_BY_ATTESTER = gql`
      query AttestationsByAttester($attester: String!) {
        attestations(
          where: { attester: { equals: $attester }}
          orderBy: { time: desc }
          take: 15
        ) {
          id
          attester
          recipient
          revocable
          data
          time
          decodedDataJson
          isOffchain
          schema {
            schema
          }
        }
      }
    `;

    try {
      const { data } = await this.apolloClient.query({
        query: GET_ATTESTATIONS_BY_ATTESTER,
        variables: {
          attester: attesterAddress
        }
      });
      console.log(`Attestations found for Attester: ${attesterAddress}, Total: `, data.attestations.length);
        return data.attestations;
    } catch (error) {
      console.error('Error fetching attestations by attester:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'An error occurred',
        message: error.message,
    }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}