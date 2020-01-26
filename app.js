var app = angular.module('RedditEmblemViewer', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when("/", {templateUrl: "homepage.html", controller: "HomepageCtrl"});
		//.when("/map", {templateUrl: "home.html", controller: "HomeCtrl"});
}]);

//Custom directives
/*app.directive('convoy', function(){
	return {
		restrict: 'E', 
		scope: {
			title: '@' //@ reads the attribute value, = provides two-way binding, & works with functions
		},
		templateUrl: 'convoy.html',
		controller: 'ConvoyCtrl', //Embed a custom controller in the directive
		//link: function ($scope, element, attrs) { } //DOM manipulation
	}
});
app.directive('shop', function(){
	return {
		restrict: 'E', 
		scope: {
			title: '@'
		},
		templateUrl: 'shop.html',
		controller: 'ShopCtrl', //Embed a custom controller in the directive
	}
});*/