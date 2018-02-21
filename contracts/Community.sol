pragma solidity ^0.4.17;
import "./Task.sol";

contract Community {
    
    //structs
    struct Member {
        address addr;
        string name;
        uint sharesOwned;
        uint dateAdded;
        bool verified;
        
        uint256 deposit;
        uint pendingBuy;
    }
    
    //storage
    address public owner;
    string public communityName;
    uint public totalShares;
    uint public unownedShares;
    uint256 totalDeposits;
    uint256 assetValue;
    
    mapping(address => Member) public members;
	mapping(address => bool) public isMember;
    address[] public membersList;
    uint public membersCount;
    
    address[] public tasksList;
    uint public tasksCount;
    
    //modifiers
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    modifier onlyMember {
        require(members[msg.sender].verified == true);
        _;
    }
    
    function Community() public {
        community("My community", 1000, 600, 100000, "admin");
    }
    
    function() public payable {}
    
    //functions
    function community(string _communityName, uint _totalShares, uint _unownedShares, uint256 _assetValue, string name) public {
        owner = msg.sender;
        membersList.push(owner);
        communityName = _communityName;
        totalShares = _totalShares;
        unownedShares = _unownedShares;
        assetValue = _assetValue;
        members[owner] = Member(owner, name, totalShares - unownedShares, now, true, 0, 0);
		isMember[owner] = true;
        membersCount = 1;
        totalDeposits = 0;
    }
    
    function addMember(address addr, string name) public onlyOwner {
		require(isMember[addr] == false);
        membersList.push(addr);
        members[addr] = Member(addr, name, 0, now, false, 0, 0);
        membersCount++;
		isMember[addr] = true;
    }

	function addMember(string name) public {
		require(isMember[msg.sender] == false);
		membersList.push(msg.sender);
		members[msg.sender] = Member(msg.sender, name, 0, now, false, 0, 0);
        membersCount++;
		isMember[msg.sender] = true;
	}
    
    function isMember(address addr) public constant returns (bool) {
        return isMember[addr];
    }
    
    function verifyMember(address member) public onlyOwner{
        members[member].verified = true;
    }
    
    function myInfo() public constant returns (address,string,uint,uint,bool,uint256,uint) {
        return (
            members[msg.sender].addr,
            members[msg.sender].name,
            members[msg.sender].sharesOwned,
            members[msg.sender].dateAdded,
            members[msg.sender].verified,
            members[msg.sender].deposit,
            members[msg.sender].pendingBuy
        );
    }

	function communityInfo() public constant returns (address,string,uint,uint,uint256,uint256) {
		return (owner,communityName,totalShares,unownedShares,totalDeposits,assetValue);
	}
    
    function deposit() public payable onlyMember {
        // require((sharesBuyRequest[msg.sender] + numShares) <= totalShares);
        members[msg.sender].deposit += msg.value;
        totalDeposits += msg.value;
    }
    
    function withdraw(uint256 amount) public onlyMember {
        require(amount <= members[msg.sender].deposit);
        members[msg.sender].deposit -= amount;
        totalDeposits -= amount;
        msg.sender.transfer(amount);
    }
    
    function withdraw() public onlyMember {
        withdraw(members[msg.sender].deposit);
    }
    
    function valuation() public constant returns (uint256) {
        return assetValue + this.balance - totalDeposits;
    }
    
    function shareValue() public constant returns (uint256) {
        return valuation() / totalShares;
    }
    
    function sellShares(address to, uint sharesCount) public onlyMember {
        require(to != msg.sender);
        uint256 value = sharesCount*shareValue();
        require(value <= members[to].deposit);
        require(value <= this.balance);
        members[to].deposit -= value;
        totalDeposits -= value;
        transferShare(to, sharesCount);
        msg.sender.transfer(value);
    }
    
    function transferShare(address to, uint sharesCount) public onlyMember {
        require(to != msg.sender);
        require(members[msg.sender].sharesOwned >= sharesCount);
        members[to].sharesOwned += sharesCount;
        members[msg.sender].sharesOwned -= sharesCount;
    }
    
    function buyShares(uint sharesCount) public onlyMember payable{
        deposit();
        members[msg.sender].pendingBuy += sharesCount;
        getUnownedShares();
    }
    
    function clearPendingBuy() public onlyMember {
        members[msg.sender].pendingBuy = 0;
    }
    
    function getUnownedShares() public onlyMember {
        uint shares = 0;
        uint256 currentShareValue = shareValue();
        
        if(unownedShares >= members[msg.sender].pendingBuy) {
            shares = members[msg.sender].pendingBuy;
        } else {
            shares = unownedShares;
        }
        
        if(shares*currentShareValue > members[msg.sender].deposit) {
            shares = members[msg.sender].deposit / currentShareValue;
        }
        
        unownedShares -= shares;
        members[msg.sender].sharesOwned += shares;
        members[msg.sender].deposit -= shares*currentShareValue;
        members[msg.sender].pendingBuy -= shares;
        
    }
    
    function newTask(string name, string description, uint256 reward) public onlyOwner {
        // require((valuation()/10) > reward);
		address task = new Task(this, name, description, owner);
        tasksList.push(task);
		tasksCount++;
        if(!task.send(reward)){
			throw;
		}
    }
}