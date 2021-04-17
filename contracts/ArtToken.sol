// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC3440.sol";

/**
 * @dev ERC721 token with editions extension.
 */
contract ArtToken is ERC3440 {

    /**
     * @dev Sets `address artist` as the original artist to the account deploying the NFT.
     */
     constructor (
        string memory _name, 
        string memory _symbol,
        uint _numberOfEditions,
        string memory tokenURI,
        uint _originalId
    ) ERC721(_name, _symbol) {
        _designateArtist(msg.sender);
        _setLimitedEditions(_numberOfEditions);
        _createEditions(tokenURI);
        _designateOriginal(_originalId);

        DOMAIN_SEPARATOR = keccak256(abi.encode(
            EIP712DOMAIN_TYPEHASH,
            keccak256(bytes("Artist's Editions")),
            keccak256(bytes("1")),
            1,
            address(this)
        ));
    }
    
    /**
     * @dev Signs a `tokenId` representing a print.
     */
    function sign(uint256 tokenId, Signature memory message, bytes memory signature) public {
        _signEdition(tokenId, message, signature);
    }
}