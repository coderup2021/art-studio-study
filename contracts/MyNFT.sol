pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    using Strings for uint256;
    address public withdrawer;
    uint fee = 1 gwei;
    event WithdrawFee(uint fee);
    event Mint(address to, string url, uint tokenId);

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    constructor(address _withdrawer) ERC721("MyNFT", "MNFT") {
        withdrawer = _withdrawer;
    }
    function getBalance() public view returns(uint256){
        require(msg.sender == withdrawer, "not owner");
        return address(this).balance;
    }
    function withdraw()public{
        uint balance = address(this).balance;
        emit WithdrawFee(balance);
        require(msg.sender == withdrawer, "no permission to withdraw");
        msg.sender.call{value: balance}("");
    }
    function mint(address to, string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= fee, "not equal fee");
        uint newItemId = _tokenIds.current();
        _mint(to, newItemId);
        emit Mint(to, tokenURI, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }
    fallback() external payable{}
}
