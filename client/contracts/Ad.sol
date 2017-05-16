pragma solidity ^0.4.9;

contract Ad {
	address public owner;
	string public IPFSData;
	uint public count;
	mapping(uint => address) public orders;
	uint public createTime;
	
	function Ad (string IPFSHash)
	{
		owner = msg.sender;
		IPFSData = IPFSHash;
		count=0;
		createTime=block.timestamp;
	} 


	modifier onlyOwner()
	{
		if (msg.sender != owner) throw;
		_;
	}

	modifier require(bool _condition)
	{
		if (!_condition) throw;
		_;
	}


	function setIPFSData(string IPFSHash)
		onlyOwner
	{
		IPFSData=IPFSHash;
	}

	function registerOrder(address escrow)
	{
		orders[count]=escrow;
		count++;
	}

	function () { 
		throw;
	 }
}