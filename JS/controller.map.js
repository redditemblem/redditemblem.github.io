app.controller('MapCtrl', ['$scope', '$http', '$location', '$window', '$routeParams', function ($scope, $http, $location, $window, $routeParams) {
    
    $scope.data = {};
    $scope.turnData = {};

    $scope.mapLoadComplete = false;
    $scope.turnLoadComplete = false;

    $scope.search = {};
    $scope.selectedTile = null;

    $scope.unitInfoExpanded = false;
    $scope.statsExpanded = false;
    $scope.invExpanded = true;
    $scope.skillsExpanded = true;
    
    //Call API to fetch JSON on load
    $http({
        method: "GET",
        url: "https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/map/" + $routeParams.teamName
    }).then(function successCallback(response) {
        $scope.data = response.data;
        $scope.selectedTile = $scope.data.map.tiles[0][0];
        $scope.mapLoadComplete = true;
    },function errorCallback(response){
        if(response.data == null)
            //Set manual error context
            $scope.errorContext = { 'message': 'The API endpoint could not be reached.' };
        else{
            $scope.errorContext = response.data;
            $scope.errorContext.status = response.status;
        }     
    });

    //TO DO REMOVE THESE!
    //$scope.displayTurns = true;
    $scope.displayTurnSubmit = true;

    $scope.fetchTurnData = function(){
        $scope.turnLoadComplete = false;
        $http({
            method: "GET",
            url: "https://localhost:44380/api/map/" + $routeParams.teamName + "/turns"
        }).then(function successCallback(response) {
            $scope.turnData = response.data;
            $scope.turnLoadComplete = true;
        },function errorCallback(response){
            if(response.data == null)
                //Set manual error context
                $scope.errorContext = { 'message': 'The API endpoint could not be reached.' };
            else{
                $scope.errorContext = response.data;
                $scope.errorContext.status = response.status;
            }
        });
    };

    // TOOLBAR FUNCTIONS ----------------------------------------------

    //Links
    $scope.launchChapterPostTab = function(){ $window.open($scope.data.map.chapterPostURL); };
    $scope.navigateHome = function(){ $location.path(''); };
    $scope.navigateConvoy = function(){ $location.path($routeParams.teamName + "/convoy"); };
    $scope.navigateShop = function(){ $location.path($routeParams.teamName + "/shop"); };

    $scope.toggleStatsExpanded = function(){ $scope.statsExpanded = !$scope.statsExpanded; };
    $scope.toggleInvExpanded = function(){ $scope.invExpanded = !$scope.invExpanded; };
    $scope.toggleSkillsExpanded = function(){ $scope.skillsExpanded = !$scope.skillsExpanded; };

    $scope.unitSort = function(unit){
        var sort = 0;
        if(unit.pinned) sort -= 2;
        if((unit.coordinate.x < 1 || unit.coordinate.y < 1) && !unit.isBackOfPair) sort += 1;
        return sort;
    };

    $scope.dictHasKeys = function(dictionary){
        return Object.keys(dictionary).length > 0;
    };

    $scope.openTurnInfo = function(){
        $scope.displayUnits = false;
        $scope.displayTiles = false;
        $scope.displayTurns = true;

        //If we haven't loaded the turns yet and there are no errors, try to load them
        if($scope.turnData.submittedTurns == undefined && $scope.errorContext == undefined)
            $scope.fetchTurnData();
    };

    //$scope.openTurnInfo();

    // TILE FUNCTIONS -------------------------------------------------
    
    $scope.mapTile_OnMouseover = function(tile){
        $scope.selectedTile = tile;
        if(tile.occupyingUnitName.length > 0){
            var imgSprite = document.getElementById(tile.occupyingUnitName + "_sprite");
            if(imgSprite.classList.contains("grayscale")) imgSprite.classList.add("brightGrayscale");
            else imgSprite.classList.add("bright"); 
        }

        if(tile.pairedUnitName.length > 0){
            var imgSprite = document.getElementById(tile.pairedUnitName + "_sprite");
            if(imgSprite.classList.contains("dimGrayscale")) imgSprite.classList.add("grayscale");
            imgSprite.classList.remove("dim");
            imgSprite.classList.remove("dimGrayscale");
        }
    };

    $scope.mapTile_OnMouseout = function(tile){
        if(tile.occupyingUnitName.length > 0){
            var imgSprite = document.getElementById(tile.occupyingUnitName + "_sprite");
            imgSprite.classList.remove("brightGrayscale");
            imgSprite.classList.remove("bright");
        }

        if(tile.pairedUnitName.length > 0){
            var imgSprite = document.getElementById(tile.pairedUnitName + "_sprite");
            if(imgSprite.classList.contains("grayscale")) imgSprite.classList.add("dimGrayscale");
            else imgSprite.classList.add("dim");
            imgSprite.classList.remove("grayscale");
        }
    };

    $scope.mapTile_OnClick = function(tile){
        $scope.selectedTile = tile;
        if(tile.occupyingUnitName.length > 0){
            var unit = $scope.getUnitByName(tile.occupyingUnitName);
            $scope.toggleUnitPinnedStatus(unit);
        }
    };

    $scope.toggleUnitPinnedStatus = function(unit){
        if(!unit.pinned){
            $scope.search.selected = unit; //set the unit in the search

            unit.pinned = true;
            UpdateVisibleRanges(unit, 1);
        }
        else{
            unit.pinned = false;
            UpdateVisibleRanges(unit, -1);
        }
    };

    function UpdateVisibleRanges(unit, updateVal){
        //Movement
        for(var i = 0; i < unit.movementRange.length; i++)
        {
            var coord = unit.movementRange[i];
            $scope.data.map.tiles[coord.y - 1][coord.x - 1].movCount += updateVal;
        } 
        
        //Attack
        for(var i = 0; i < unit.attackRange.length; i++)
        {
            var coord = unit.attackRange[i];
            $scope.data.map.tiles[coord.y - 1][coord.x - 1].atkCount += updateVal;
        } 

        //Utility
        for(var i = 0; i < unit.utilityRange.length; i++)
        {
            var coord = unit.utilityRange[i];
            $scope.data.map.tiles[coord.y - 1][coord.x - 1].utilCount += updateVal;
        } 
    }

    $scope.getUnitByName = function(unitName){
        return $scope.data.units.find((u) => { return u["name"] === unitName });
    };
}]);