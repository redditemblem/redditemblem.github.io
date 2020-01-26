app.controller('HomepageCtrl', ['$scope',  function ($scope) {
    $.get("", function(data, status){
        $scope.teamList = data;
    });
}]);