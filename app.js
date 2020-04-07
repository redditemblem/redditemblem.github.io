var app = angular.module('RedditEmblemViewer', ['ngRoute', 'ngCookies', 'ngMaterial']);
app.config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
	$routeProvider
		.when("/", {templateUrl: "HTML/homepage.html", controller: "HomepageCtrl"})
		.when("/info", {templateUrl: "HTML/info.html", controller: "InfoCtrl"})
		.when("/map/:teamName", {templateUrl: "HTML/map.html", controller: "MapCtrl"});

	//Force injection of $cookies service
	var $cookies;
	angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
		$cookies = _$cookies_;
	}]);

	//Define color themes
	$mdThemingProvider.theme('dark').dark();
	
	var theme = $cookies.get('RedditEmblemMaps-SavedTheme')
	if(theme != undefined)
		$mdThemingProvider.setDefaultTheme(theme);
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