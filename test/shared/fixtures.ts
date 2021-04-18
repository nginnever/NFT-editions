import ArtToken from '../../artifacts/contracts/ArtToken.sol/ArtToken.json'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import "@nomiclabs/hardhat-ethers";
import { ethers } from 'hardhat'
import { deployContract } from 'ethereum-waffle'
import { Contract } from 'ethers'

export interface ArtTokenFixture {
  artToken: Contract
}

export async function getFixtureWithParams(
  numberOfEditions: number,
  wallet: SignerWithAddress,
  fromWallet: boolean = true
): Promise<any> {

  const Token = await ethers.getContractFactory("ArtToken")

  // deploy tokens
  const artToken = await Token.deploy(
  	'Test ArtToken',
  	'TAT',
  	ethers.BigNumber.from(numberOfEditions),
  	'testurl.com',
  	ethers.BigNumber.from(0)
  ) 
  console.log('deployed 3440: ', artToken.address)

  return {
    artToken
  }
}
