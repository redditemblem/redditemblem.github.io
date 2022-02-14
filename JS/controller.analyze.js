app.controller('AnalyzeCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    
  $scope.data = {};
  $scope.filters = { 'mode' : 'movCost' };
  $scope.loadComplete = false;

  $scope.movementTypes = [];
  $scope.terrainTypes = [];
  $scope.warpGroups = [];
  
  //Call API to fetch JSON on load
  $http({
      method: "GET",
      url: "https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/map/analyze/" + $routeParams.teamName
  }).then(function successCallback(response) {
      $scope.data = response.data;
      
      //Build sorted filter lists
      var terrainTypes = $scope.data.system.terrainTypes;

      //Terrain types
      $scope.terrainTypes = Object.keys(terrainTypes).sort();

      //Movement types
      var firstKey = Object.keys(terrainTypes)[0];
      $scope.movementTypes = Object.keys(terrainTypes[firstKey].movementCosts).sort()

      //Warp groups
      for(var row in $scope.data.map.tiles){
        for(var tile in $scope.data.map.tiles[row]){
          var groupNum = $scope.data.map.tiles[row][tile].warpData.warpGroupNumber;
          if(groupNum > 0 && !$scope.warpGroups.some((g) => g.groupNum == groupNum))
            $scope.warpGroups.push({
              "groupNum": groupNum, 
              "coordinates": $scope.data.map.tiles[row][tile].warpData.warpGroupCoordinates
            });
        }
      }
      $scope.warpGroups.sort();

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

  $scope.dictHasKeys = function(dictionary){
      return Object.keys(dictionary).length > 0;
  };

  $scope.mode_OnChange = function(){
    $scope.filters.selectedMovType = "";
    $scope.filters.selectedTerrainType = "";
    $scope.filters.selectedWarpGroup = -1;
    $scope.filters.selectedSpecialty = "";
  };

}]);