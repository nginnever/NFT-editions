// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @dev ERC721 token with editions extension.
 */
abstract contract ERC3440 is ERC721URIStorage {

    // eip-712
    struct EIP712Domain {
        string  name;
        string  version;
        uint256 chainId;
        address verifyingContract;
    }

    struct Signature {
        string artist;
        address wallet;
        string contents;
    }

    // type hashes
    bytes32 public constant EIP712DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    bytes32 constant SIGNATURE_TYPEHASH = keccak256(
        "Signature(string artist,address wallet, string contents)"
    );

    bytes32 public DOMAIN_SEPARATOR;
    
    // Optional mapping for signatures
    mapping (uint256 => bytes) private _signatures;
    
    // A view to display the artist's address
    address public artist;

    // A view to display the total number of prints created
    uint public editionSupply = 0;
    
    // A view to display which ID is the original copy
    uint public originalId = 0;
    
    // A signed token event
    event Signed(address indexed from, uint256 indexed tokenId);

    /**
     * @dev Sets `address artist` as the original artist.
     */
    function _designateArtist(address _artist) internal virtual {
        require(artist == address(0), "ERC721Extensions: the artist has already been set");

        // If there is no special designation for the artist, set it.
        artist = _artist;
    }
    
    /**
     * @dev Sets `tokenId as the original print` as the tokenURI of `tokenId`.
     */
    function _designateOriginal(uint256 tokenId) internal virtual {
        require(msg.sender == artist, "ERC721Extensions: only the artist may designate originals");
        require(_exists(tokenId), "ERC721Extensions: Original query for nonexistent token");
        require(originalId == 0, "ERC721Extensions: Original print has already been designated as a different Id");

        // If there is no special designation for the original, set it.
        originalId = tokenId;
    }
    

    /**
     * @dev Sets `total number printed editions of the original` as the tokenURI of `tokenId`.
     */
    function _setLimitedEditions(uint256 maxEditionSupply) internal virtual {
        require(msg.sender == artist, "ERC721Extensions: only the artist may designate max supply");
        require(editionSupply == 0, "ERC721Extensions: Max number of prints has already been created");

        // If there is no max supply of prints, set it. Leaving supply at 0 indicates there are no prints of the original
        editionSupply = maxEditionSupply;
    }

    /**
     * @dev Creates `tokenIds` representing the printed editions.
     */
    function _createEditions(string memory tokenURI) internal virtual {
        require(msg.sender == artist, "ERC721Extensions: only the artist may create prints");
        require(editionSupply > 0, "ERC721Extensions: the edition supply is not set to more than 0");
        for(uint i=0; i < editionSupply; i++) {
            _mint(msg.sender, i);
            _setTokenURI(i, tokenURI);
        }
    }

    function hash(Signature memory message) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                SIGNATURE_TYPEHASH,
                message.artist,
                message.wallet,
                message.contents
            ))
        ));
    }

    /**
     * @dev Signs a `tokenId` representing a print.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Signed} event.
     */
    function _signEdition(uint256 tokenId, Signature memory message, bytes memory signature) internal virtual {
        require(msg.sender == artist, "ERC721Extensions: only the artist may sign their work");
        require(_signatures[tokenId].length == 0, "ERC721Extensions: this token is already signed");
        bytes32 digest = hash(message);
        address recovered = ECDSA.recover(digest, signature);
        require(recovered == artist, "ERC721Extensions: artist signature mismatch");
        _signatures[tokenId] = signature;
        emit Signed(artist, tokenId);
    }

    
    /**
     * @dev displays a signature from the artist.
     */
    function getSignature(uint256 tokenId) external view virtual returns (bytes memory) {
        require(_signatures[tokenId].length != 0, "ERC721Extensions: no signature exists for this Id");
        return _signatures[tokenId];
    }
    
    /**
     * @dev returns `true` if the message is signed by the artist.
     */
    function isSigned(Signature memory message, bytes memory signature, uint tokenId) external view virtual returns (bool) {
        bytes32 messageHash = hash(message);
        address _artist = ECDSA.recover(messageHash, signature);
        return (_artist == artist && equals(_signatures[tokenId], signature));
    }

    /**
    * @dev Utility function that checks if two `bytes memory` variables are equal. This is done using hashing,
    * which is much more gas efficient then comparing each byte individually.
    * Equality means that:
    *  - 'self.length == other.length'
    */  - For 'n' in '[0, self.length)', 'self[n] == other[n]'
    function equals(bytes memory self, bytes memory other) internal pure returns (bool equal) {
        if (self.length != other.length) {
            return false;
        }
        uint addr;
        uint addr2;
        uint len = self.length;
        assembly {
            addr := add(self, /*BYTES_HEADER_SIZE*/32)
            addr2 := add(other, /*BYTES_HEADER_SIZE*/32)
        }
        assembly {
            equal := eq(keccak256(addr, len), keccak256(addr2, len))
        }
    }
}