import Identicon from 'identicon.js';

class Account {
	constructor(address) {
		this.address = address;
		this.identicon = new Identicon(this.address, 50).toString();
		this.balance = web3.eth.getBalance(this.address).toFixed();
		this.selected = window.account == this.address;
		this.member = undefined;
	}
}

export default class {
	constructor($scope) {
		verifyLoaded();
		this.depositAmount = 0;
		this.balance = 0;
		this.accounts = [];
		this.scope = $scope;
		
		Community.afterLoad(community => {
			this.community = community;
			this.withdrawAmount = this.community.myInfo.deposit;
			this.accounts = web3.eth.accounts.map(address => new Account(address));
			this.balance = web3.eth.getBalance(account).toFixed();
			this.members = {};
			for(let i in this.accounts) {
				this.accounts[i].member = this.community.getMemberByAddress(this.accounts[i].address);
			}
			try{this.scope.$apply();}catch(err){}
			console.log(this.accounts);
		});
	}

	setActiveAccount(account) {
		showLoader("Changing account ... ");
		localStorage.setItem("account", account.address);
		window.location.reload();
	}

	deposit() {
		showLoader("Adding amount to wallet");
		this.community.deposit(this.depositAmount).then(this.scope.$apply)
		.catch(catchError("Failed to deposit. Please make sure you have enough balance.")).then(hideLoader);
	}

	withdraw() {
		showLoader("Withdrawing balance to wallet");
		this.community.withdraw(this.withdrawAmount).then(this.scope.$apply)
		.catch(catchError("Failed to withdraw.")).then(hideLoader);
	}
	
}