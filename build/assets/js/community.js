import contract from 'truffle-contract';

import community_artifacts from '../../build/contracts/Community.json';

const CommunityContract = contract(community_artifacts);
window.CommunityContract = CommunityContract;

const default_address = "0xf635360c1c63607819d67eb5307e4aa611366438";

class Member {
	constructor(res) {
		this.update = this.update.bind(this);
		this.sellShare = this.sellShare.bind(this);
		this.transferShare = this.transferShare.bind(this);

		this.update(res);
	}
	
	update(res) {
		this.address = res[0];
		this.name = res[1];
		this.sharesOwned = res[2].toString();
		this.dataAdded = res[3].toString();
		this.verified = res[4];
		this.deposit = res[5].toString();
		this.pendingBuy = res[6].toString();
	}

	sellShare(count) {
		const _this = this;
		return c.contract.sellShare(_this.address, count).then(c.refreshMembersList);
	}

	transferShare(count) {
		const _this = this;
		return c.contract.transferShare(_this.address, count).then(c.refreshMembersList);
	}
}

class Community {

	static injectProvider(web3) {
		CommunityContract.setProvider(web3.currentProvider);
		CommunityContract.web3.eth.defaultAccount = CommunityContract.web3.eth.accounts[0];
		CommunityContract.defaults({
			gas: '4500000',
			from: account
		});
		window.c = new Community(default_address);
	}

	constructor(address) {
		this.address = address;
		this.toExec = [];
		this.loaded = false;
		this.members = [];
		this.info = {};
		this.tasks = [];

		this.afterLoad = this.afterLoad.bind(this);
		this.joinCommunity = this.joinCommunity.bind(this);
		this.refreshCommunityInfo = this.refreshCommunityInfo.bind(this);
		this.refreshMembersList = this.refreshMembersList.bind(this);
		this.isOwner = this.isOwner.bind(this);
		this.getMemberByAddress = this.getMemberByAddress.bind(this);
		this.refreshTasksList = this.refreshTasksList.bind(this);
		this.valuation = this.valuation.bind(this);

		let _this = this;
		let args = arguments;
		if (address !== undefined) {
			this.contract = CommunityContract.at(address);
			this.loaded = true;
		} else {
			CommunityContract.new(args).then(function (instance) {
				console.log(instance);
				_this.contract = instance;
				_this.address = _this.contract.address;
				for (let i in _this.toExec) {
					_this.toExec[i].f();
				}
				_this.toExec = [];
				_this.loaded = true;
			});
		}

		this.afterLoad(() => {
			var _this = this;
			this.joinCommunity()
				.then(_this.refreshMembersList)
				.then(_this.refreshCommunityInfo)
				.then(_this.refreshTasksList)
				.then(res => {
					console.log("Is Owner: ", _this.isOwner());
				});
		});
	}

	afterLoad(f) {
		if (this.loaded) {
			f();
		} else {
			this.toExec.push(f);
		}
	}

	joinCommunity() {
		const c = this.contract;
		return c.isMember(account)
			.then(res => {
				console.log("Is Member : ",res);
				if (!res) {
					return c.addMember(prompt("Enter alias"));
				}
			})
			.then(this.refreshMembersList);
	}

	refreshCommunityInfo(arg) {
		const _this = this;
		return _this.contract.communityInfo()
			.then(res => {
				_this.info = {
					owner: res[0],
					communityName: res[1],
					totalShares: res[2].toString(),
					unownedShares: res[3].toString(),
					totalDeposits: res[4].toString(),
					assetValue: res[5].toString()
				};
				console.log(_this.info);
				return arg;
			});
	}

	refreshMembersList(arg) {
		const _this = this;
		return _this.contract.membersCount()
			.then(res => {
				var count = res.toFixed();
				let promises = [];
				for (var i = 0; i < count; i++) {
					promises.push(_this.contract.membersList(i)
						.then(_this.contract.members)
						.then(res => {
							const member = new Member(res);
							return member;
						}))
				}
				return Promise.all(promises);
			})
			.then((res) => {
				_this.members = res;
				console.log(_this.members);
				return arg;
			});
	}

	getMemberByAddress(address) {
		for(let i in this.members){
			if(this.members[i].address == address){
				return this.members[i];
			}
		}
	}

	refreshTasksList(arg) {
		const _this = this;
		return _this.contract.tasksCount()
			.then(res => {
				const count = res.toFixed();
				let promises = [];
				for (var i = 0; i < count; i++) {
					promises.push(_this.contract.tasksList(i)
						.then((taskAddress) => {
							const task = new Task(taskAddress);
							return task;
						}));
				}
				return Promise.all(promises);
			})
			.then(tasks => {
				_this.tasks = tasks;
				return arg;
			});
	}

	isOwner() {
		return account == this.info.owner;
	}

	createTask(name, description, reward) {
		const _this = this;
		return _this.contract.newTask(name, description, reward)
			.then(_this.refreshTasksList);
	}

	valuation() {
		return (parseInt(web3.eth.getBalance(this.address).toString()) + parseInt(this.info.assetValue) - parseInt(this.info.totalDeposits)) / 1e18;
	}

	getShareRequests() {
		return this.members.filter(member => member.pendingBuy > 0);
	}

}

window.Community = Community;

export default Community;