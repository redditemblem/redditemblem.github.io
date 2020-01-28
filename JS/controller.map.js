app.controller('MapCtrl', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    $scope.data = {};
    
    //Call API to fetch JSON
    $http({
        method: "GET",
        url: "https://localhost:44380/api/team/" + $routeParams.teamName
    }).then(function successCallback(response) {
        $scope.data = response.data;
    });
}]);