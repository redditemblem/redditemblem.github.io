app.controller('MapCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    
    $scope.data = {};
    $scope.search = {};
    $scope.loadComplete = false;
    $scope.unitInfoExpanded = false;
    $scope.statsExpanded = false;
    $scope.invExpanded = true;
    $scope.skillsExpanded = true;
    $scope.selectedTile = null;
    
    //Call API to fetch JSON on load
    $http({
        method: "GET",
        url: "https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/map/" + $routeParams.teamName
    }).then(function successCallback(response) {
        $scope.data = response.data;
        $scope.selectedTile = $scope.data.map.tiles[0][0];
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

    // TOOLBAR FUNCTIONS ----------------------------------------------

    $scope.unitSort = function(unit){
        var sort = 0;
        if(unit.pinned) sort -= 2;
        if((unit.coordinate.x < 1 || unit.coordinate.y < 1) && !unit.isBackOfPair) sort += 1;
        return sort;
    };

    $scope.toggleStatsExpanded = function(){ $scope.statsExpanded = !$scope.statsExpanded; };
    $scope.toggleInvExpanded = function(){ $scope.invExpanded = !$scope.invExpanded; };
    $scope.toggleSkillsExpanded = function(){ $scope.skillsExpanded = !$scope.skillsExpanded; };

    $scope.dictHasKeys = function(dictionary){
        return Object.keys(dictionary).length > 0;
    };

    // TILE FUNCTIONS -------------------------------------------------
    
    $scope.mapTile_OnMouseover = function(tile){
        $scope.selectedTile = tile;
        if(tile.occupyingUnitName.length > 0)
            applyUnitSpriteFilters($scope.getUnitByName(tile.occupyingUnitName), true);
        if(tile.pairedUnitName.length > 0)
            applyUnitSpriteFilters($scope.getUnitByName(tile.pairedUnitName), true);
        
        var divHover = document.getElementById(tile.coordinate.x + "," + tile.coordinate.y + "_hover");
        divHover.style.display = "block";
    };

    $scope.mapTile_OnMouseout = function(tile){
        if(tile.occupyingUnitName.length > 0)
            applyUnitSpriteFilters($scope.getUnitByName(tile.occupyingUnitName), false);
        if(tile.pairedUnitName.length > 0)
            applyUnitSpriteFilters($scope.getUnitByName(tile.pairedUnitName), false);

        var divHover = document.getElementById(tile.coordinate.x + "," + tile.coordinate.y + "_hover");
        divHover.style.display = "none";
    };

    $scope.mapTile_OnClick = function(tile){
        $scope.selectedTile = tile;
        if(tile.occupyingUnitName.length > 0){
            var unit = $scope.getUnitByName(tile.occupyingUnitName);
            toggleUnitPinnedStatus(unit);
            applyUnitSpriteFilters(unit, true);
        }
    };

    $scope.pinButton_OnClick = function(unit){
        toggleUnitPinnedStatus(unit);
        applyUnitSpriteFilters(unit, false);
    }

    const highBrightness = "170"
    const dimBrightness = "50"
    const grayscale = "95";
    const grayscaleModified = "70";
    const pinnedFilter = "drop-shadow(0px 0px 3px white) drop-shadow(0px 0px 2px white)";
    
    function applyUnitSpriteFilters(unit, isMousedOver){
        var imgSprite = document.getElementById(unit.name + "_sprite");
        var brightnessValue = "100";
        var grayscaleValue = "0";

        if(!unit.isBackOfPair){
            //Front unit
            if(isMousedOver){
                brightnessValue = highBrightness;
                if(unit.hasMoved) grayscaleValue = grayscaleModified;
            }
            else{
                if(unit.hasMoved) grayscaleValue = grayscale;
            }
        }
        else{
            //Rear unit
            if(isMousedOver){
                if(unit.hasMoved) grayscaleValue = grayscaleModified;
            }
            else{
                brightnessValue = dimBrightness;
                if(unit.hasMoved) grayscaleValue = grayscaleModified;
            }
        }

        var filterString = `brightness(${brightnessValue}%) grayscale(${grayscaleValue}%)`;
        if(unit.pinned) filterString += " " + pinnedFilter;

        imgSprite.style.filter = filterString;
    }

    function toggleUnitPinnedStatus(unit){
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