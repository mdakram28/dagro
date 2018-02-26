import contract from 'truffle-contract';

import task_artifacts from '../../build/contracts/Task.json';
const TaskContract = contract(task_artifacts);
window.TaskContract = TaskContract;

const TaskStatus = ["CREATED","ASSIGNED","COMPLETED","VERIFIED","CANCELED"];
class Task {


	static injectProvider(web3) {
		TaskContract.setProvider(web3.currentProvider);
		TaskContract.web3.eth.defaultAccount = TaskContract.web3.eth.accounts[0];
		TaskContract.defaults({
			gas: '4500000',
			from: account
		});
	}

	constructor(address) {
		this.address = address;
		this.volunteers = [];

		this.refreshTaskInfo = this.refreshTaskInfo.bind(this);
		this.refreshVolunteers = this.refreshVolunteers.bind(this);
		this.assignTask = this.assignTask.bind(this);
		this.completedTask = this.completedTask.bind(this);
		this.cancelTask = this.cancelTask.bind(this);
		this.verifyTask = this.verifyTask.bind(this);

		this.contract = TaskContract.at(address);

		this.refreshTaskInfo();
		this.refreshVolunteers();
	}


	refreshTaskInfo() {
		const _this = this;
		_this.contract.taskInfo()
			.then(res => {
				_this.info = {
					owner: res[0],
					createdAt: res[1].toString(),
					name: res[2],
					description: res[3],
					status: TaskStatus[res[4].toFixed()],
					assignedVolunteer: res[5]
				};
			})
	}

	refreshVolunteers() {
		const _this = this;
		return _this.contract.volunteersCount()
			.then(res => {
				const count = res.toFixed();
				let promises = [];
				for (let i = 0; i < count; i++) {
					promises.push(_this.contract.volunteers(i).then(c.getMemberByAddress));
				}
				return Promise.all(promises);
			})
			.then(volunteers => {
				_this.volunteers = volunteers;
			});
	}

	addVolunteer() {
		const _this = this;
		return _this.contract.addVolunteer()
			.then(_this.refreshVolunteers);
	}

	// TODO : Implement all solidity functions

	assignTask(address) {
		return this.contract.assignTask(address);
	}

	completedTask() {
		return this.contract.completedTask(address);
	}

	cancelTask() {
		return this.contract.cancelTask(address);
	}

	verifyTask() {
		return this.contract.verifyTask(address);
	}


}

window.Task = Task;

export default Task;