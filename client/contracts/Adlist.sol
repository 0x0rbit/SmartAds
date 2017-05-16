pragma solidity ^0.4.9;

contract Adlist {
	
	// Public properties
	address public owner;
	mapping(uint => address) public ads;
	uint public count;
	string public IPFSData;
	uint public createTime;

	// onlyOwner should be able to modify
	modifier onlyOwner()
	{
		if (msg.sender != owner) throw;
		_;
	}

	//Define constructor
	function Adlist(string IPFSHash)
	{
		// Lock the owner
		owner = msg.sender;
		// set IPFSHash
		IPFSData = IPFSHash;
		createTime=block.timestamp;
	}

	function register( address adAddress)
	{
		ads[count] = adAddress;
		count++;
	}

	function setIPFSData(string IPFSHash)
		onlyOwner
	{
		IPFSData=IPFSHash;
	}

	function(){
		throw;
	}

}