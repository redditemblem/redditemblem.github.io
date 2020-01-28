var app = angular.module('RedditEmblemViewer', ['ngRoute', 'ngCookies', 'ngMaterial']);
app.config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
	$routeProvider
		.when("/", {templateUrl: "HTML/homepage.html", controller: "HomepageCtrl"})
		.when("/about", {templateUrl: "HTML/about.html", controller: "AboutCtrl"})
		.when("/map/:teamName", {templateUrl: "HTML/map.html", controller: "MapCtrl"});

	//Define color themes
	$mdThemingProvider.theme('dark').dark();

	//Load theme cookie, if it exists
	//var savedTheme = $cookies.get('RedditEmblem-SavedTheme');
	//if(savedTheme != undefined)
	//	$mdThemingProvider.setDefaultTheme(savedTheme);
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