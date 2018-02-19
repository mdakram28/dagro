import Community from "../../javascripts/community";

export default class {
	constructor($scope) {
		const _this = this;
		
		this.new = {
			communityName: "Akram's Community",
			name: "mdakram28",
			totalShares: 100,
			unownedShares: 60,
			assetValue: 1000000000
		}
		this.commAddr = "0xdb6ab748020e22af9417e8d913357d7018ddf84d";
		this.scope = $scope;

		Community.afterLoad( community => {
			window.community = community;
			this.community = community;
			this.communityBalance = this.community.formatAmount(web3.eth.getBalance(this.community.address));
			return community.joinCommunity().then(() => this.scope.$apply());
		});
	}

	createNewCommunity() {
		const _this = this;
		new Community(
			this.new.communityName,
			this.new.totalShares,
			this.new.unownedShares,
			this.new.assetValue,
			this.name
		);
	}

	joinCommunity() {
		new Community(this.commAddr);
	}

	logout() {
		localStorage.removeItem("communityAddress");
		window.location.reload();
	}

	verify(member) {
		member.verify().then(this.community.refreshAll).then(this.scope.$apply);
	}
}

// 0xa73b9e6cbaf370159d21551cabcd1deaf7955828