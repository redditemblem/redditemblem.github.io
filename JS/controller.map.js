app.controller('MapCtrl', ['$scope', '$http', '$location', '$routeParams', '$mdSidenav', function ($scope, $http, $location, $routeParams, $mdSidenav) {
    
    $scope.data = {};
    $scope.loadComplete = false
    $scope.unitInfoExpanded = false;
    $scope.statsExpanded = false;
    $scope.invExpanded = true;
    $scope.skillsExpanded = true;
    
    //Call API to fetch JSON
    $http({
        method: "GET",
        url: "https://localhost:44380/api/team/" + $routeParams.teamName
    }).then(function successCallback(response) {
        $scope.data = response.data;
        $scope.loadComplete = true;
    },function errorCallback(response){
        $scope.errorContext = response.data;
    });

    $scope.formatStackTrace = function(stacktrace){
        return stacktrace.replace("\tat", "\nat").trim();
    };

    $scope.openSideNav = function(){
        $mdSidenav("sidenav").open();
    };

    $scope.closeSideNav = function(){
        $mdSidenav("sidenav").close();
    };

    $scope.unitSort = function(a){
        var sort = 0;
        if(a.pinned) sort -= 2;
        if(a.coordinates.isHidden) sort += 1;
        return sort;
    };
}]);