import Community from "../../javascripts/community";

export default class TaskController {

	constructor() {
		verifyLoaded();
		this.newTask = {
			name: "New Task " + Math.ceil(Math.random() * 10000),
			description: "No Description",
			value: 100000
		}

		Community.afterLoad(community => {
			this.community = community;
		});
	}

	showForm() {
		$("#TaskModal").modal("show");
	}

	postNewTask() {
		$("#TaskModal").modal("hide");
		this.community.createTask(this.newTask.name, this.newTask.description, this.newTask.value);
	}
}