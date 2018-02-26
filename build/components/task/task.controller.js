import Community from "../../javascripts/community";
import Task from "../../javascripts/task"

export default class TaskController {

	constructor($scope) {
		verifyLoaded();
		this.newTask = {
			name: "New Task " + Math.ceil(Math.random() * 10000),
			description: "No Description",
			value: 100000
		}
		this.scope = $scope;

		Community.afterLoad(community => {
			this.community = community;
			this.task = this.community.tasks[0];
			try{this.scope.$apply();}catch(err){}
			console.log("Community updated");
		});
	}

	showForm() {
		$("#TaskModal").modal("show");
	}

	postNewTask() {
		$("#TaskModal").modal("hide");
		console.log(this.newTask);
		this.community.createTask(this.newTask.name, this.newTask.description, this.newTask.value);
	}

	verifyNewTask(taskchild) {
		taskchild.verify().then(this.task.refreshTaskInfo).then(this.scope.$apply);
	}

	assignTask(task,member) {
		task.assignTask(member.address).then(this.task.refreshTaskInfo).then(this.scope.$apply);
	}

	completeTask(task)
	{
		task.completedTask().then(this.scope.$apply);
	
	
	}

	addVolunteer(task) {
		showLoader("Adding volunteer");
		task.addVolunteer().then(this.scope.$apply).catch(err => {
			showError("Unable to add volunteer");
		}).then(hideLoader);
	}

	openTask(task) {
		
		this.task = task;
		this.scope.$apply();
	}

	
}