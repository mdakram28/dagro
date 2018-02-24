pragma solidity ^0.4.17;
import "./Community.sol";

contract Task {
    
    enum Status {
        CREATED,
        ASSIGNED,
        COMPLETED,
        VERIFIED,
        CANCELED
    }
    
    address public owner;
    uint256 public createdAt;
    string public name;
    string public description;
    
    Status public status;
    
    address[] public volunteers;
    mapping(address => bool) isVolunteer;
    uint public volunteersCount;
    address public assignedVolunteer;
    
    Community c;
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    modifier onlyMember {
        require(c.isMember(msg.sender));
        _;
    }
    
    function Task(Community _c, string _name, string _description, address _owner) public {
        c = _c;
        owner = _owner;
        createdAt = now;
        name = _name;
        description = _description;
        
        status = Status.CREATED;
        
        volunteersCount = 0;
    }
    
    function() public payable {}
    
    function addVolunteer() public onlyMember{
        require(status == Status.CREATED);
		require(!isVolunteer[msg.sender]);
        volunteers.push(msg.sender);
        volunteersCount++;
		isVolunteer[msg.sender] = true;
    }

	function taskInfo() public constant returns (address, uint256, string, string, Status, address) {
		return (owner, createdAt, name, description, status, assignedVolunteer);
	}
    
    function cancelTask() public onlyOwner {
        require(status != Status.VERIFIED && status != Status.CANCELED);
        status = Status.CANCELED;
        c.transfer(this.balance);
    }
    
    function assignTask(address volunteer) public onlyOwner {
        require(status == Status.CREATED);
        require(isVolunteer[volunteer] == true);
        status = Status.ASSIGNED;
        assignedVolunteer = volunteer;
    }
    
    function completedTask(address volunteer) public onlyOwner {
        require(status == Status.ASSIGNED);
        require(assignedVolunteer == msg.sender);
        status = Status.COMPLETED;
        suicide(assignedVolunteer);
    }
    
    function verifyTask(bool verified) public onlyOwner {
        require(status == Status.COMPLETED);
        if(verified) {
            status = Status.VERIFIED;
            assignedVolunteer.transfer(this.balance);
        }else {
            status = Status.CREATED;
            delete assignedVolunteer;
        }
    }
    
}