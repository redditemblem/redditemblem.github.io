app.controller('ConvoyCtrl', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    
    $scope.data = {};
    $scope.filters = { "showCategory" : {}, "showStat" : {} };
    $scope.loadComplete = false;
    
    //Call API to fetch JSON on load
    $http({
        method: "GET",
        url: "https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/convoy/" + $routeParams.teamName
    }).then(function successCallback(response) {
        $scope.data = response.data;

        //Set up sorting filters
        $scope.filters.expandItemInfo = false;
        $scope.filters.selectedSort = $scope.data.parameters.sorts[0];

        $scope.filters.showCategory.all = true;
        $scope.filters.showStat.all = true;
        $scope.toggleCategoryFilters();
        $scope.toggleStatFilters();

        //Finish up
        $scope.sortItems();
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

    $scope.navigateHome = function(){ $location.path(''); };
    $scope.navigateToMap = function(){ $location.path("/map/" + $routeParams.teamName); };

    //ITEM FILTERING --------------------------------------------------

    $scope.sortItems = function(){
        $scope.data.convoyItems.sort(function(itemA, itemB){
            var valueA, valueB;
            if($scope.filters.selectedSort.isDeepSort){
                valueA = $scope.data.items[itemA.name][$scope.filters.selectedSort.sortAttribute];
                valueB = $scope.data.items[itemB.name][$scope.filters.selectedSort.sortAttribute];
            }
            else{
                valueA = itemA[$scope.filters.selectedSort.sortAttribute];
                valueB = itemB[$scope.filters.selectedSort.sortAttribute];
            }
            
            if(valueA == "") return 1;
            else if(valueB == "") return -1;
            else if(valueA == valueB) return 0;
            else return valueA < valueB ? -1 : 1;
        });
    };

    $scope.toggleCategoryFilters = function(){
        for(var key in $scope.data.parameters.itemCategories)
            $scope.filters.showCategory[$scope.data.parameters.itemCategories[key]] = $scope.filters.showCategory.all;
    };

    $scope.updateCategoryFilters = function(){
        var allSelected = true;
        for(var key in $scope.data.parameters.itemCategories)
            allSelected = (allSelected && $scope.filters.showCategory[$scope.data.parameters.itemCategories[key]]);
        $scope.filters.showCategory.all = allSelected;
    };

    $scope.toggleStatFilters = function(){
        for(var key in $scope.data.parameters.utilizedStats)
            $scope.filters.showStat[$scope.data.parameters.utilizedStats[key]] = $scope.filters.showStat.all;
    };

    $scope.updateStatFilters = function(){
        var allSelected = true;
        for(var key in $scope.data.parameters.utilizedStats)
            allSelected = (allSelected && $scope.filters.showStat[$scope.data.parameters.utilizedStats[key]]);
        $scope.filters.showStat.all = allSelected;
    };
}]);