// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Tip{
    address ownerAddress;

    struct TipStruct {
        address sender;
        uint256 amount;
        string message;

    }

      event NewTip (
        address sender,
        uint256 amount,
        string message);

    TipStruct[] public allTips ;

    constructor(address _address){
     
           ownerAddress = _address;
    }

    function TipOwner ( string memory message) payable external{
        TipStruct  memory tip  = TipStruct(
            msg.sender,
            msg.value,
            message
        );       
        allTips.push(tip);

        emit NewTip(
            msg.sender,
            msg.value,
            message
        );
    }

    function getTips() external view returns(TipStruct[] memory) {
        return allTips;
    }
    
    function withDraw(bytes32 eventId) external {
    
       
        
        // only the event owner can withdraw
        require(msg.sender == ownerAddress, "MUST BE EVENT OWNER");



        uint256 payout =1;

        (bool sent, ) = msg.sender.call{value: payout}("");



        require(sent, "Failed to send Ether");
    }
}