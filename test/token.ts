import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { ethers } from 'hardhat'
import { ArtTokenFixture, getFixtureWithParams } from './shared/fixtures'

const zero = ethers.BigNumber.from(0)
const MaxUint256 = ethers.constants.MaxUint256

let tokenFixture: ArtTokenFixture
let wallet: SignerWithAddress

describe('ERC-3440:', () => {
  // async function createToken(totalSupply: BigNumber) {
  //   const { artToken } = tokenFixture
  // }

  beforeEach(async function () {
    wallet = (await ethers.getSigners())[0]
    tokenFixture = await getFixtureWithParams(4, wallet, true)
  })

  it('createToken', async () => {
    const { artToken } = tokenFixture
    const baseSupply = ethers.BigNumber.from(4)

    console.log(artToken.address)
    // await tokenBase.approve(router.address, baseSupply)
    // await tokenQuote.approve(router.address, zero)
    // await expect(router.addLiquidity({
    //   sender: wallet.address,
    //   to: wallet.address,
    //   tokenBase: tokenBase.address,
    //   tokenQuote: tokenQuote.address,
    //   amountBase: baseSupply,
    //   amountQuote: zero,
    //   slopeNumerator: 1e6,
    //   n: 1,
    //   fee: 0
    // }, MaxUint256))
    //   .to.emit(pair, 'Deposit')
    //   .withArgs(router.address, baseSupply, zero, zero, wallet.address)
  })
})