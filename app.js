var app = angular.module('RedditEmblemViewer', ['ngRoute', 'ngCookies', 'ngMaterial', 'ngAnimate']);
app.config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
	$routeProvider
		.when("/", {templateUrl: "HTML/homepage.html", controller: "HomepageCtrl"})
		.when("/info", {templateUrl: "HTML/info.html", controller: "InfoCtrl"})
		.when("/map/:teamName", {templateUrl: "HTML/map.html", controller: "MapCtrl"})
		.when('/convoy/:teamName', {templateUrl: "HTML/convoy.html", controller: "ConvoyCtrl"})
		.when('/shop/:teamName', {templateUrl: "HTML/shop.html", controller: "ShopCtrl"});

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