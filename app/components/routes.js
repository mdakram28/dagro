routes.$inject = ['$stateProvider'];
import TaskController from "./task/task.controller.js";
import CommunityController from "./community/community.controller.js";
import WalletController from "./wallet/wallet.controller.js";
import SharesController from "./shares/shares.controller.js";

export default function routes($stateProvider) {
	$stateProvider
		.state('home', {
			url: '',
			template: require('./task/task.html'),
			controller: TaskController,
			controllerAs: '_'
		})
		.state('task', {
			url: '/task',
			template: require('./task/task.html'),
			controller: TaskController,
			controllerAs: '_'
		})
		.state('community', {
			url: '/community',
			template: require('./community/community.html'),
			controller: CommunityController,
			controllerAs: '_'
		})
		.state('wallet', {
			url: '/wallet',
			template: require('./wallet/wallet.html'),
			controller: WalletController,
			controllerAs: '_'
		})
		.state('shares', {
			url: '/shares',
			template: require('./shares/shares.html'),
			controller: SharesController,
			controllerAs: '_'
		});
}