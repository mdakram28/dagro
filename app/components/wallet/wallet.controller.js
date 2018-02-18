export default class {
	constructor($scope) {
		verifyLoaded();
		this.balance = web3.eth.getBalance(account).toFixed();
		this.depositAmount = 0;
		Community.afterLoad(community => {
			this.community = community;
			this.withdrawAmount = this.community.myInfo.deposit;
		});
		this.scope = $scope;
	}

	deposit() {
		this.community.deposit(this.depositAmount).then(this.scope.$apply);
	}

	withdraw() {
		this.community.withdraw(this.withdrawAmount).then(this.scope.$apply);
	}
}