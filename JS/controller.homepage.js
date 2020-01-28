app.controller('HomepageCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    //Initalize variables
    $scope.teamList = [];

    $http({
        method: "GET",
        url: "https://localhost:44380/api/teamList"
    }).then(function successCallback(response) {
        $scope.teamList = response.data;
    });

    $scope.LaunchAbout = function(){
        $location.path("/about");
    };

    $scope.LaunchMap = function(teamName){
        $location.path('/map/' + teamName.replace(' ', ''));
    };
}]);