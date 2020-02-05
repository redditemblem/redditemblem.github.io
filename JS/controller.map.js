app.controller('MapCtrl', ['$scope', '$http', '$window', '$routeParams', '$mdSidenav', function ($scope, $http, $window, $routeParams, $mdSidenav) {
    
    $scope.data = {};
    $scope.loadComplete = false
    $scope.unitInfoExpanded = false;
    $scope.statsExpanded = false;
    $scope.invExpanded = true;
    $scope.skillsExpanded = true;
    
    //Call API to fetch JSON on load
    $http({
        method: "GET",
        url: "https://localhost:44380/api/team/" + $routeParams.teamName
    }).then(function successCallback(response) {
        $scope.data = response.data;
        $scope.loadComplete = true;
    },function errorCallback(response){
        if(response.data == null)
            //Set manual error context
            $scope.errorContext = { 'message': 'The API endpoint could not be reached.' };
        else{
            $scope.errorContext = response.data;
            $scope.errorContext.status = response.status;
        }     
    });

    $scope.formatStackTrace = function(stacktrace){
        return stacktrace.replace("\tat", "\nat").trim();
    };

    // SIDE NAV FUNCTIONS ---------s--------------------------------

    $scope.openSideNav = function(){
        $mdSidenav("sidenav").open();
    };

    $scope.closeSideNav = function(){
        $mdSidenav("sidenav").close();
    };

    $scope.browserWidthCheck = function(){
        return $window.innerWidth < 500;
    };

    $scope.launchChapterPostTab = function(){
        $window.open($scope.data.map.chapterPostURL);
    };

    $scope.unitSort = function(a){
        var sort = 0;
        if(a.pinned) sort -= 2;
        if(a.coordinates.isHidden) sort += 1;
        return sort;
    };

    //-------------------------------------------------------------
}]);