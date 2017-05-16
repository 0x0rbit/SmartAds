pragma solidity ^0.4.9;

contract Purchase
{
	address public seller;
	address public buyer;
	uint public value;
	bytes32 public pHash;
    enum State { Locked, Inactive }
    State public state;
    uint public releaseTime;
    uint public createTime;
    uint public trials;



	function Purchase(address sel, uint spin, uint xtime) payable
	{
		seller = sel;
		buyer = msg.sender;
		pHash = keccak256(spin);
		value = msg.value;
        state = State.Locked;
        createTime = block.timestamp;
        releaseTime= block.timestamp + xtime;
        trials=3;
	}

	modifier onlyBuyer()
    {
        if (msg.sender != buyer) throw;
        _;
    }
    modifier onlySeller()
    {
        if (msg.sender != seller) throw;
        _;
    }

    modifier inState(State _state)
    {
        if (state != _state) throw;
        _;
    }

    modifier unBlock()
    {
        if (block.timestamp<releaseTime) throw;
        _;
    }

    modifier noTrial()
    {
        if (trials==0) throw;
        _;
    }
  
    event Aborted();
    event PaymentRedeemed();
    event RedeemTry();

    function redeemPayment(uint spin) 
    	onlySeller
        noTrial
        inState(State.Locked)
        returns (uint)
    {
        if (pHash != keccak256(spin)) 
        {
            trials--;
            if (trials==0) releaseTime=0;
            RedeemTry();
            return 0;
        }
        bool res;
        res = seller.send(this.balance);
        if (res){
        state=State.Inactive;
        value=0;
        releaseTime=0;
        PaymentRedeemed();
        return 1;    
        }
    }
    

    function cancelPurchase()
        onlyBuyer
        unBlock
        inState(State.Locked)
    {
        state=State.Inactive;
        Aborted();
        selfdestruct(buyer);
    }

}