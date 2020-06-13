app.controller('ShopCtrl', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    
    $scope.data = {};
    $scope.loadComplete = false;
    
    //Call API to fetch JSON on load
    $http({
        method: "GET",
        url: "2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/shop/" + $routeParams.teamName
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
    
    // TOOLBAR FUNCTIONS ----------------------------------------------

    $scope.navigateToMap = function(){
        $location.path("/map/" + $routeParams.teamName);
    };
}]);