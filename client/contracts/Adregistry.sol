pragma solidity ^0.4.9;

contract Adregistry {
	
	struct adregistry{
		address adlist;
		address ad;
		string title;
		uint score;
	}


	uint public count;
	mapping(uint => adregistry) public adregister; 

	function Adregistry()
	{
		count = 0;
	}

	function register( address adlist, address ad, string title, uint score)
	{
		adregister[count].adlist = adlist;
		adregister[count].ad = ad;
		adregister[count].title = title;
		adregister[count].score = score;
		count++;
	}

	function() {
		throw;
	}

}