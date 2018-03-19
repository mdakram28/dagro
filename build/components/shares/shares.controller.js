export default class {
	constructor($scope) {
		verifyLoaded();

		this.refresh = this.refresh.bind(this);

		this.buySharesCount = 0;
		this.sellSharesCount = 0;

		Community.afterLoad(community => {
			this.community = community;
			this.refresh();
			console.log(this);
		});
		this.scope = $scope;
	}

	refresh() {
		this.percentShares = ((this.community.info.totalShares - this.community.info.unownedShares) * 100) / this.community.info.totalShares;
		this.percentSharesOwned = (this.community.myInfo.sharesOwned * 100) / this.community.info.totalShares;
		this.shareValue = this.community.valuation() / this.community.info.totalShares;
		this.pendingBuys = this.community.getShareRequests();
		this.myBalance = web3.eth.getBalance(account);
		try{this.scope.$apply();}catch(err){}
	}

	buyShares() {
		showLoader("Buying shares");
		this.community.buyShares(this.buySharesCount).then(this.refresh)
		.catch(catchError("Failed to buy shares.")).then(hideLoader);
	}

	clearPendingBuys() {
		showLoader("Clearing pending buy requests.");
		this.community.clearPendingBuys().then(this.refresh)
		.catch(catchError("Failed to clear pending buy requests.")).then(hideLoader);
	}

	sellShares(member) {
		showLoade("Trying to sell shares");
		member.sellShare(member.pendingBuy).then(this.refresh)
		.catch(catchError("Failed to sell shares.")).then(hideLoader);
	}
}