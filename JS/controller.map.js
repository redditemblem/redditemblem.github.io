app.controller('MapCtrl', ['$scope', '$http', '$location', '$routeParams', '$mdSidenav', function ($scope, $http, $location, $routeParams, $mdSidenav) {
    
    $scope.data = {};
    $scope.loadComplete = false
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
    });

    $scope.openSideNav = function(){
        $mdSidenav("sidenav").open();
    };

    $scope.closeSideNav = function(){
        $mdSidenav("sidenav").close();
    };
}]);