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
		showLoader("Posting new task");
		this.community.createTask(this.newTask.name, this.newTask.description, this.newTask.value)
		.catch(catchError("Failed to create task request. Make sure community has sufficient balance")).then(hideLoader);
	}

	verifyNewTask(taskchild) {
		showLoader("Verifying task");
		taskchild.verify().then(this.task.refreshTaskInfo).then(this.scope.$apply)
		.catch(catchError("Failed to verify task.")).then(hideLoader);
	}

	assignTask(task,member) {
		showLoader("Assigning task to "+member.name);
		task.assignTask(member.address).then(this.task.refreshTaskInfo).then(this.scope.$apply)
		.catch(catchError("Failed to assign task.")).then(hideLoader);
	}

	completeTask(task)
	{
		showLoader("Trying to set task as completed");
		task.completedTask().then(this.scope.$apply)
		.catch(catchError("Failed to complete task.")).then(hideLoader);;
	}

	addVolunteer(task) {
		showLoader("Adding volunteer");
		task.addVolunteer().then(this.scope.$apply)
		.catch(catchError("Failed to add volunteer")).then(hideLoader);
	}

	openTask(task) {
		this.task = task;
		this.scope.$apply();
	}
}