import "../stylesheets/app.css";

import { default as Web3 } from 'web3';
import Community from './community.js';
import Task from './task.js';

window.addEventListener('load', function () {
	window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
	web3.personal.unlockAccount(web3.eth.accounts[0], "");
	web3.personal.unlockAccount(web3.eth.accounts[1], "");
	web3.personal.unlockAccount(web3.eth.accounts[2], "");
	web3.personal.unlockAccount(web3.eth.accounts[3], "");
	web3.eth.defaultAccount = web3.eth.accounts[0];
	window.account = web3.eth.defaultAccount;

	Community.injectProvider(web3);
	Task.injectProvider(web3);
});