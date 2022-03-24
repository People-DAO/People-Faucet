pragma solidity ^0.8.4;

//import Open Zepplins ERC-20 contract
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//create a sample token that inherits Open Zepplins ERC-20 contract
contract Faucet {

    uint256 public amountAllowed = 100 * 10 ** 18;
    address public tokenAddress;

    //when deploying the token give it a name and symbol
    //specify the amount of tokens minted for the owner
    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }


    //allow users to call the requestTokens function to mint tokens
    function requestTokens (address requestor) external {
        IERC20 token = IERC(tokenAddress);

        token.transferFrom(address(this), msg.sender, amountAllowed);
        
    }
}
