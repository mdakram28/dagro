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
			// this.refresh();
			this.scope.$apply();
		});
	}

	showForm() {
		$("#TaskModal").modal("show");
	}

	postNewTask() {
		$("#TaskModal").modal("hide");
		this.community.createTask(this.newTask.name, this.newTask.description, this.newTask.value);


	}

	verifyNewTask(taskchild)
	{
		taskchild.verify().then(this.task.refreshTaskInfo).then(this.scope.$apply);
	}

	acceptNewTask()
	{
		
	}
}