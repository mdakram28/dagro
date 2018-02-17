import angular from "angular";
// import angularUi from "angular-ui";

var app = angular.module("app", []);
app.controller("TaskCtrl", ['$scope', '$log',

	function ($scope, $modal, $log) {

		$scope.showForm = function () {
			$scope.message = "Show Form Button Clicked";
			console.log($scope.message);
			$("#TaskModal").modal("show");
		};

		
	}]
);