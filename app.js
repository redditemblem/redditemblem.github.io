var app = angular.module('RedditEmblemViewer', ['ngRoute', 'ngCookies', 'ngMaterial', 'ngAnimate']);
app.config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
	$routeProvider
		.when("/", {templateUrl: "HTML/homepage.html", controller: "HomepageCtrl"})
		.when("/info", {templateUrl: "HTML/info.html", controller: "InfoCtrl"})
		.when("/:teamName/map", {templateUrl: "HTML/map.html", controller: "MapCtrl"})
		.when('/:teamName/convoy', {templateUrl: "HTML/convoy.html", controller: "ConvoyCtrl"})
		.when('/:teamName/shop', {templateUrl: "HTML/shop.html", controller: "ShopCtrl"})
		.otherwise({ redirectTo: "/" });

	//Force injection of $cookies service
	var $cookies;
	angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
		$cookies = _$cookies_;
	}]);

	//Define color themes
	$mdThemingProvider.theme('default')
					  .primaryPalette('blue')
					  .accentPalette('amber');
	$mdThemingProvider.theme('dark')
					  .primaryPalette('blue')
					  .accentPalette('amber')
					  .dark();

	var theme = $cookies.get('RedditEmblemMaps-SavedTheme')
	if(theme != undefined)
		$mdThemingProvider.setDefaultTheme(theme);
}]);