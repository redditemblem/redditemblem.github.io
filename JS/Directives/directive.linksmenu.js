app.directive('linksmenu', ['$location', '$window', '$routeParams', function($location, $window, $routeParams) {
  return{
      restrict: 'E', //element
      templateUrl: 'HTML/Directives/linksmenu.html',
      scope: {
          chapterPostURL: "=chapterposturl",
          showConvoy: "=showconvoy",
          showShop: "=showshop",
          showMap: "=showmap",
          showAnalyzer: "=showanalyzer"
      },
      link: function($scope, element, attrs) {
        $scope.launchChapterPostTab = function(){ $window.open($scope.chapterPostURL); };
        
        $scope.navigateToHomepage = function(){ $location.path(''); };
        $scope.navigateToConvoy = function(){ $location.path($routeParams.teamName + "/convoy"); };
        $scope.navigateToShop = function(){ $location.path($routeParams.teamName + "/shop"); };

        $scope.navigateToMap = function(){ $location.path($routeParams.teamName + "/map"); };
        $scope.navigateToAnalyzer = function(){ $location.path($routeParams.teamName + "/map/analyze"); };

        $scope.downloadMap = function(){
          $window.open("https://localhost:44393/api/map/generateimage/" + $routeParams.teamName);
        };
      }
  };
}]);

