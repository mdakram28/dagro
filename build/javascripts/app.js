import $ from 'jquery';
window.jQuery = $;
window.$ = $;

//Stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/shop-item.css";
import "dapp-styles/dist/dapp-styles.css";

//Javascripts
import "bootstrap";
import angular from "angular";
import uirouter from 'angular-ui-router';
import routing from '../components/routes.js';

const app = angular.module("app", [uirouter]);
app
	.config(routing)


import { default as Web3 } from 'web3';
import Community from './community.js';
import Task from './task.js';

window.showLoader = function (message) {
	$("#loader").show();
	$("#loadingMessage").html(message);
}

window.hideLoader = function () {
	$("#loader").hide();
	$("#loadingMessage").html("LOADING");
}

window.showError = function (message, permanent) {
	var $target = $('<div class="error-message alert alert-danger"><strong>Error!</strong> ' + message + '</div>');
	$("#main").prepend($target);
	$target.hide();
	$target.show('slow');
	if(!permanent) {
		setTimeout(function () {
			$target.hide('slow', function () { $target.remove(); })
		}, 5000)
	}
}


window.web3 = new Web3(new Web3.providers.HttpProvider(process.env.TESTRPC_URL));
$(function () {
	console.log("Default account : " + localStorage.getItem("account"));
	web3.eth.defaultAccount = localStorage.getItem("account") || web3.eth.accounts[0];
	window.account = web3.eth.defaultAccount;

	Community.injectProvider(web3);
	Task.injectProvider(web3);

	window.commAddr = localStorage.getItem("communityAddress");
	if (!window.commAddr) {
		console.log("Redirecting to community page");
		window.location.href = "#!community";
	} else {
		console.log("Community address found : " + window.commAddr);
		new Community(window.commAddr);
	}

	hideLoader();
});

window.verifyLoaded = function () {
	if (!localStorage.getItem("communityAddress")) window.location.href = "#!community";
}

Community.afterLoad(community => {
	setInterval(function() {
		if(window.location.hash == "#!/community" || window.location.hash == "#!/wallet")return;
		var member = community.getMemberByAddress(account);
		if(!member) window.location.href = "#!/community";
		if(!member.verified) {
			window.location.href = "#!/community";
			showError("PLEASE GET YOUR ACCOUNT VERIFIED FROM THE ADMIN.", true);
		}
	}, 1000);
});