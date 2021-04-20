import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { ethers } from 'hardhat'
import { ArtTokenFixture, getFixtureWithParams } from './shared/fixtures'
import { keccak256 } from 'ethereumjs-util'
import { defaultSender, provider, web3, contract } from '@openzeppelin/test-environment';

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
    let name = await artToken.name()
    expect(await artToken.name.call()).to.equal(name)
    console.log(name)
    //expect(await artToken.name().to.equal('Test ArtToken'))
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

  it('Assigns initial balance', async () => {
    const { artToken } = tokenFixture
    expect(await artToken.balanceOf(wallet.address)).to.equal(4)
  })

  it('Has artist wallet assigned', async () => {
    const { artToken } = tokenFixture
    expect(await artToken.artist()).to.equal(wallet.address)
  })

  it('Has correct edition total supply', async () => {
    const { artToken } = tokenFixture
    expect(await artToken.editionSupply()).to.equal(4)
  })

  it('Has correct original print id', async () => {
    const { artToken } = tokenFixture
    expect(await artToken.originalId()).to.equal(0)
  })

  it('Has domain hashes', async () => {
    const { artToken } = tokenFixture

    // All properties on a domain are optional
    const domain = {
        name: 'ArtToken',
        version: '1',
        chainId: '0x539',
        verifyingContract: artToken.address
    };

    // The named list of all type definitions
    const types = {
        Signature: [
            { name: 'artist', type: 'string' },
            { name: 'wallet', type: 'address' },
            { name: 'contents', type: 'string'}
        ],
    };

    // The data to sign
    const value = {
        message: {
            artist: 'TestArtist',
            wallet: wallet.address,
            contents: '1'
        }
    };

    console.log(domain)
    console.log(types)
    console.log(value)
    const [signer] = await ethers.getSigners();
    const signature = await signer._signTypedData(domain, types, value);
    console.log(signature)
    //let sig = signERC721Token(provider, 'test_artist', defaultSender, '1', artToken.address)
    //expect(await artToken.EIP712DOMAIN_TYPEHASH()).to.equal(domain)
  })

  it('prints have correct uri', async () => {
    const { artToken } = tokenFixture
    let uri = 'testurl.com'
    expect(await artToken.tokenURI(0)).to.equal(uri)
    expect(await artToken.tokenURI(1)).to.equal(uri)
    expect(await artToken.tokenURI(2)).to.equal(uri)
    expect(await artToken.tokenURI(3)).to.equal(uri)
  })
})




// export const getChainId = async (provider: any): Promise<any> => send(provider, 'eth_chainId');
// const randomId = () => Math.floor(Math.random() * 10000000000);

// export const send = (provider: any, method: string, params?: any[]) => new Promise<any>((resolve, reject) => {
//   const payload = {
//     id: randomId(),
//     method,
//     params,
//   };
//   const callback = (err: any, result: any) => {
//     if (err) {
//       reject(err);
//     } else if (result.error) {
//       console.error(result.error);
//       reject(result.error);
//     } else {
//       resolve(result.result);
//     }
//   };

//   let _provider = provider.provider || provider

//   if (_provider.sendAsync) {
//     _provider.sendAsync(payload, callback);
//   } else {
//     _provider.send(payload, callback);
//   }
// });

// interface Signature {
//   artist: string;
//   wallet: string;
//   contents: string;
// }

// interface Domain {
//   name: string;
//   version: string;
//   chainId: number;
//   verifyingContract: string;
// }

// interface RSV {
//   r: string;
//   s: string;
//   v: number;
// }

// const EIP712Domain = [
//   { name: "name", type: "string" },
//   { name: "version", type: "string" },
//   { name: "chainId", type: "uint256" },
//   { name: "verifyingContract", type: "address" },
// ];

// const getDomain = async (provider: any, token: string | Domain, tokenName: string): Promise<Domain> => {
//   if (typeof token !== 'string') {
//     return token as Domain;
//   }

//   const tokenAddress = token as string;

//   const [name, chainId] = await Promise.all([
//     tokenName,
//     getChainId(provider),
//     //sokolChainID,
//   ]);

//   const domain: Domain = { name, version: '1', chainId, verifyingContract: tokenAddress };
//   return domain;
// };

// const createTypedSignature = (message: Signature, domain: Domain) => {
//   const typedData = {
//     types: {
//       EIP712Domain,
//       Signature: [
//         { name: "artist", type: "string" },
//         { name: "wallet", type: "address" },
//         { name: "contents", type: "string" }
//       ],
//     },
//     primaryType: "Signature",
//     domain,
//     message
//   };

//   return typedData;
// };

// export const signData = async (provider: any, fromAddress: string, typeData: any): Promise<RSV> => {
//   const typeDataString = typeof typeData === 'string' ? typeData : JSON.stringify(typeData);
//   console.log(typeDataString)
//   const result = await send(provider, 'eth_signTypedData_v4', [fromAddress, typeDataString])
//     .catch((error: any) => {
//       if (error.message === 'Method eth_signTypedData not supported.') {
//         return send(provider, 'eth_signTypedData', [fromAddress, typeData]);
//       } else {
//         throw error;
//       }
//     });

//   return {
//     r: result.slice(0, 66),
//     s: '0x' + result.slice(66, 130),
//     v: parseInt(result.slice(130, 132), 16),
//   };
// };

// export const signERC721Token = async (
//   provider: any,
//   artist: string,
//   wallet: string,
//   contents: string,
//   token: string
// ): Promise<Signature & RSV> => {

//   const message: Signature = {
//     artist,
//     wallet,
//     contents
//   };

//   const domain = await getDomain(provider, token, 'Test ArtToken');
//   const typedData = createTypedSignature(message, domain);
//   const [signer] = await ethers.getSigners();
//   let res = await signer._signTypedData(typedData);
//   console.log(res)
  
//   //const sig = await signData(provider, wallet, typedData);

//   //return { ...sig, ...message };
// };

// {
//   "types":{
//     "EIP712Domain":[
//     {"name":"name","type":"string"},
//     {"name":"version","type":"string"},
//     {"name":"chainId","type":"uint256"},
//     {"name":"verifyingContract","type":"address"}
//     ],
//     "Signature":[
//     {"name":"artist","type":"string"},
//     {"name":"wallet","type":"address"},
//     {"name":"contents","type":"string"}
//     ]
//   },
//   "primaryType":"Signature",
//   "domain":{
//     "name":"Test ArtToken",
//     "version":"1",
//     "chainId":"0x539",
//     "verifyingContract":"0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
//   },
//   "message":{
//     "artist":"test_artist",
//     "wallet":"0x6D1Bd6Ff86B18a8b57183c5838A783E2dCe8b5EA",
//     "contents":"1"
//   }
// }

