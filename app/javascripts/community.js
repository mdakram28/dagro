import contract from 'truffle-contract';
// import identicon from './vendor/node-identicon/dist/identicon.min.js';
import Identicon from 'identicon.js';

import community_artifacts from '../../build/contracts/Community.json';

const CommunityContract = contract(community_artifacts);
window.CommunityContract = CommunityContract;

const default_address = "0xdb6ab748020e22af9417e8d913357d7018ddf84d";

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
		this.deposit = parseInt(res[5].toString());
		this.pendingBuy = res[6].toString();

		this.identicon = new Identicon(this.address, 50).toString();

		// identicon.generate({
		// 	id: this.address,
		// 	size:150
		// }, (err, buffer) => {
		// 	this.identicon = buffer;
		// })
	}

	sellShare(count) {
		const _this = this;
		return Community.community.contract.sellShares(_this.address, count).then(Community.community.refreshMembersList);
	}

	transferShare(count) {
		const _this = this;
		return Community.community.contract.transferShare(_this.address, count).then(Community.community.refreshMembersList);
	}

	verify() {
		return Community.community.contract.verifyMember(this.address);
	}
}

class Community {

	static injectProvider(web3) {
		CommunityContract.setProvider(web3.currentProvider);
		CommunityContract.web3.eth.defaultAccount = CommunityContract.web3.eth.accounts[0];
		CommunityContract.defaults({
			gas: '4700000',
			from: account
		});
	}

	constructor(address) {
		this.address = address;
		this.members = [];
		this.info = {};
		this.tasks = [];
		this.myInfo = {};

		this.joinCommunity = this.joinCommunity.bind(this);
		this.refreshAll = this.refreshAll.bind(this);
		this.refreshCommunityInfo = this.refreshCommunityInfo.bind(this);
		this.refreshMyInfo = this.refreshMyInfo.bind(this);
		this.refreshMembersList = this.refreshMembersList.bind(this);
		this.isOwner = this.isOwner.bind(this);
		this.getMemberByAddress = this.getMemberByAddress.bind(this);
		this.refreshTasksList = this.refreshTasksList.bind(this);
		this.valuation = this.valuation.bind(this);
		this.deposit = this.deposit.bind(this);
		this.buyShares = this.buyShares.bind(this);
		this.sellShares = this.sellShares.bind(this);
		this.clearPendingBuys = this.clearPendingBuys.bind(this);

		let _this = this;
		let args = arguments;
		if (arguments.length == 1) {
			this.contract = CommunityContract.at(address);
			Community.loaded = true;
			Community.community = _this;
			_this.refreshAll()
				.then(res => {
					for (let f in Community.toExec) {
						Community.toExec[f](_this);
					}
					Community.loaded = true;
					localStorage.setItem("communityAddress", address);
					hideLoader();
				});

		} else if (arguments.length == 5) {
			showLoader("Creating contract");
			CommunityContract.new(args).then(function (instance) {
				_this.contract = instance;
				_this.address = _this.contract.address;
				Community.loaded = true;
				Community.community = _this;

				_this.refreshAll()
					.then(res => {
						console.log("Is Owner: ", _this.isOwner());
						for (let f in Community.toExec) {
							Community.toExec[f](_this);
						}
						localStorage.setItem("communityAddress", _this.address);
						hideLoader();
					});
			});
		} else {
			throw new Error("Invalid arguments passed.");
		}
	}

	static afterLoad(f) {
		if (Community.loaded) {
			f(Community.community);
		} else {
			Community.toExec.push(f);
		}
	}

	refreshAll() {
		const _this = this;
		return _this.refreshMembersList()
			.then(_this.refreshCommunityInfo)
			.then(_this.refreshTasksList)
			.then(_this.refreshMyInfo);
	}

	joinCommunity() {
		const c = this.contract;
		return c.isMember(account)
			.then(res => {
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

	refreshMyInfo(arg) {
		const _this = this;
		return _this.contract.myInfo()
			.then(res => {
				_this.myInfo = new Member(res);
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
				return arg;
			});
	}

	getMemberByAddress(address) {
		for (let i in this.members) {
			if (this.members[i].address == address) {
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
							console.log(taskAddress);
							const task = new Task(taskAddress);
							return task.refreshAll();
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
		return window.account == this.info.owner;
	}

	createTask(name, description, reward) {
		const _this = this;
		showLoader("Posting new task ... ");
		return _this.contract.newTask(name, description, reward)
			.then(_this.refreshTasksList)
			.then(hideLoader);
	}

	deposit(amount) {
		showLoader("Sending transaction ...")
		return this.contract.deposit({
			value: amount
		})
			.then(this.refreshMyInfo)
			.then(() => {
				hideLoader();
			});
	}

	withdraw(amount) {
		showLoader("Sending transaction ...")
		return this.contract.withdraw(amount)
			.then(this.refreshMyInfo)
			.then(() => {
				hideLoader();
			});
	}

	valuation() {
		return (parseInt(web3.eth.getBalance(this.address).toString()) + parseInt(this.info.assetValue) - parseInt(this.info.totalDeposits));
	}

	getShareRequests() {
		return this.members.filter(member => member.pendingBuy > 0);
	}

	clearPendingBuys() {
		showLoader("Sending pending transaction ...")
		return this.contract.clearPendingBuy()
			.then(this.refreshMyInfo)
			.then(() => {
				hideLoader();
			});
	}

	buyShares(sharesCount) {
		showLoader("Buying Shares ...")
		return this.contract.buyShares(sharesCount, {
			value: (this.valuation() * sharesCount) / this.info.totalShares
		})
			.then(this.refreshAll)
			.then(() => {
				hideLoader();
			});
	}
	sellShares(to, sharesCount) {
		showLoader("Selling Shares ...")
		return this.contract.sellShares(to, sharesCount)
			.then(this.refreshAll)
			.then(() => {
				hideLoader();
			});
	}

	formatAmount(amount) {
		let ret = Math.floor(amount / 1000000000000000000) + " Eth";
		amount %= 1000000000000000000;
		if (amount == 0 && ret != "0 Eth") return ret;

		if (ret == "0 Eth") ret = "";
		else ret += ", ";
		ret += Math.floor(amount / 1000000) + " Micro";
		amount %= 1000000;
		if (amount == 0 && ret != "0 Micro") return ret;

		if (ret == "0 Micro") ret = "";
		else ret += ", ";
		ret += amount + " Wei";

		return ret;
	}

}

Community.loaded = false;
Community.toExec = [];

// Community.afterLoad((community) => {
// });

window.Community = Community;

export default Community;