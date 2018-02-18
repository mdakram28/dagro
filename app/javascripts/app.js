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

window.showLoader = function(message) {
	$("#loader").show();
	$("#loadingMessage").html(message);
}

window.hideLoader = function() {
	$("#loader").hide();
	$("#loadingMessage").html("LOADING");
}

$(function() {
	window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
	// web3.personal.unlockAccount(web3.eth.accounts[0], "");
	// web3.personal.unlockAccount(web3.eth.accounts[1], "");
	// web3.personal.unlockAccount(web3.eth.accounts[2], "");
	// web3.personal.unlockAccount(web3.eth.accounts[3], "");
	// if localstorage does not have an address
	web3.eth.defaultAccount = web3.eth.accounts[0];
	window.account = web3.eth.defaultAccount;

	Community.injectProvider(web3);
	Task.injectProvider(web3);

	window.commAddr = localStorage.getItem("communityAddress");
	if(!window.commAddr){
		console.log("Redirecting to community page");
		window.location.href = "#!community";
	}else{
		console.log("Community address found : "+window.commAddr);
		new Community(window.commAddr);
	}

	hideLoader();
});

window.verifyLoaded = function() {
	if(!localStorage.getItem("communityAddress"))window.location.href = "#!community";
}