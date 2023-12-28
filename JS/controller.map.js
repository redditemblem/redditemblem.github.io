app.controller('MapCtrl', ['$scope', '$http', '$routeParams', '$window', function ($scope, $http, $routeParams, $window) {
    
    $scope.data = {};
    $scope.search = {};
    $scope.loadComplete = false;
    $scope.unitInfoExpanded = false;
    $scope.statsExpanded = false;
    $scope.invExpanded = true;
    $scope.emblemExpanded = true;
    $scope.skillsExpanded = true;
    $scope.adjutantsExpanded = true;
    $scope.selectedTile = null;
    $scope.numOfPinnedUnits = 0;
    $scope.displayTileCoordinates = false;
    $scope.tileCoordinatesFontSize = 0;

    $scope.dice = {
        'lowerBound': 1,
        'upperBound': 100,
        'rollCount': 1,
        'rollAverages': false
    };
    $scope.diceHistory = [];
    
    //Call API to fetch JSON on load
    $http({
        method: "GET",
        url: "https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/map/" + $routeParams.teamName
    }).then(function successCallback(response) {
        $scope.data = response.data;
        $scope.selectedTile = $scope.data.map.tiles[0][0];
        setTileCoordinateFontSize();
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

    $scope.unitsQuery = function(query) {
        var results = query ? $scope.data.units.filter(buildUnitsQuery(query)) : $scope.data.units;
        return results;
    };
  
    function buildUnitsQuery(query) {
        query = query.toLowerCase().trim();
        return function filterFn(unit) {
            return (unit.name.toLowerCase().indexOf(query) >= 0 || unit.normalizedName.toLowerCase().indexOf(query) >= 0);
        };
    };

    $scope.getPinnedUnitsList = function(){
        return $scope.data.units.filter(
            function filterFn(unit){ return unit.pinned == true; }
        );
    };

    $scope.clearPinnedUnitsList = function(clearCurrentUnit){
        var pinnedUnits = $scope.getPinnedUnitsList();
        pinnedUnits.forEach((unit) => {
            if(clearCurrentUnit || $scope.search.selected.name != unit.name)
                $scope.pinButton_OnClick(unit);
        });
    };

    $scope.unitSort = function(unit){
        var sort = 0;
        if(unit.pinned) sort -= 2;
        if(unit.location.coordinate.asText.length == 0) sort += 1;
        return sort;
    };

    $scope.toggleStatsExpanded = function(){ $scope.statsExpanded = !$scope.statsExpanded; };
    $scope.toggleInvExpanded = function(){ $scope.invExpanded = !$scope.invExpanded; };
    $scope.toggleEmblemExpanded = function(){ $scope.emblemExpanded = !$scope.emblemExpanded; };
    $scope.toggleSkillsExpanded = function(){ $scope.skillsExpanded = !$scope.skillsExpanded; };
    $scope.toggleAdjutantsExpanded = function(){ $scope.adjutantsExpanded = !$scope.adjutantsExpanded; };

    $scope.dictHasKeys = function(dictionary){
        return Object.keys(dictionary).length > 0;
    };

    $scope.launchCharacterApplication = function(characterAppURL) { $window.open(characterAppURL); };

    // TILE FUNCTIONS -------------------------------------------------
    
    $scope.mapTile_OnMouseover = function(tile){
        $scope.selectedTile = tile;
        if(tile.unitData.occupyingUnitName.length > 0)
            applyUnitSpriteFilters($scope.getUnitByName(tile.unitData.occupyingUnitName), true);
        if(tile.unitData.pairedUnitName.length > 0)
            applyUnitSpriteFilters($scope.getUnitByName(tile.unitData.pairedUnitName), true);

        var divHover = document.getElementById(`${tile.coordinate.asText}_hover`);
        divHover.style.display = "block";
    };

    $scope.mapTile_OnMouseout = function(tile){
        if(tile.unitData.occupyingUnitName.length > 0)
            applyUnitSpriteFilters($scope.getUnitByName(tile.unitData.occupyingUnitName), false);
        if(tile.unitData.pairedUnitName.length > 0)
            applyUnitSpriteFilters($scope.getUnitByName(tile.unitData.pairedUnitName), false);

        var divHover = document.getElementById(`${tile.coordinate.asText}_hover`);
        divHover.style.display = "none";
    };

    $scope.mapTile_OnClick = function(tile){
        $scope.selectedTile = tile;
        if(tile.unitData.occupyingUnitName.length > 0){
            var unit = $scope.getUnitByName(tile.unitData.occupyingUnitName);
            toggleUnitPinnedStatus(unit);
            applyUnitSpriteFilters(unit, true);
        }
        
        for(var i = 0; i < tile.tileObjectInstanceIDs.length > 0; i++){
            var tileObj = $scope.data.map.tileObjectInstances[tile.tileObjectInstanceIDs[i]];
            
            //Only allow tile objects with ranges to be pinned
            if(tileObj.attackRange.length > 0)
                toggleTileObjectPinnedStatus(tileObj);
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
    const pinnedFilter = " drop-shadow(0px 0px 4px white) drop-shadow(0px 0px 3px white)";

    function applyUnitSpriteFilters(unit, isMousedOver){
        var imgSprite = document.getElementById(`${unit.name}_sprite`);
        if(imgSprite == null) return;
        
        var brightnessValue = "100";
        var grayscaleValue = "0";

        if(!unit.location.isBackOfPair){
            //Front unit
            if(isMousedOver){
                brightnessValue = highBrightness;
                if(unit.sprite.hasMoved) grayscaleValue = grayscaleModified;
            }
            else{
                if(unit.sprite.hasMoved) grayscaleValue = grayscale;
            }
        }
        else{
            //Rear unit
            if(isMousedOver){
                if(unit.sprite.hasMoved) grayscaleValue = grayscaleModified;
            }
            else{
                brightnessValue = dimBrightness;
                if(unit.sprite.hasMoved) grayscaleValue = grayscaleModified;
            }
        }

        //Construct filter string
        var filterString = `brightness(${brightnessValue}%) grayscale(${grayscaleValue}%)`;
        if(unit.sprite.aura.length > 0)
            filterString += ` drop-shadow(0px 0px 3px ${unit.sprite.aura}) drop-shadow(0px 0px 2px ${unit.sprite.aura})`;
        if(unit.pinned) filterString += pinnedFilter;

        imgSprite.style.filter = filterString;
    }

    function toggleUnitPinnedStatus(unit){
        if(!unit.pinned){
            $scope.search.selected = unit; //set the unit in the search

            unit.pinned = true;
            updateVisibleUnitRanges(unit, 1);
            $scope.numOfPinnedUnits += 1;
        }
        else{
            unit.pinned = false;
            updateVisibleUnitRanges(unit, -1);
            $scope.numOfPinnedUnits -= 1;
        }
    };

    function updateVisibleUnitRanges(unit, updateVal){
        //Movement
        for(var i = 0; i < unit.ranges.movement.length; i++)
        {
            var coord = unit.ranges.movement[i];
            $scope.data.map.tiles[coord.y - 1][coord.x - 1].movCount += updateVal;
        } 
        
        //Attack
        for(var i = 0; i < unit.ranges.attack.length; i++)
        {
            var coord = unit.ranges.attack[i];
            $scope.data.map.tiles[coord.y - 1][coord.x - 1].atkCount += updateVal;
        } 

        //Utility
        for(var i = 0; i < unit.ranges.utility.length; i++)
        {
            var coord = unit.ranges.utility[i];
            $scope.data.map.tiles[coord.y - 1][coord.x - 1].utilCount += updateVal;
        } 
    }

    function toggleTileObjectPinnedStatus(tileObj){
        if(!tileObj.pinned){
            tileObj.pinned = true;
            updateVisibleTileObjectRanges(tileObj, 1);
        }
        else{
            tileObj.pinned = false;
            updateVisibleTileObjectRanges(tileObj, -1);
        }
    };

    function updateVisibleTileObjectRanges(tileObj, updateVal){
        for(var i = 0; i < tileObj.attackRange.length; i++){
            var coord = tileObj.attackRange[i];
            $scope.data.map.tiles[coord.y - 1][coord.x - 1].tileObjCount += updateVal;
        }
    };

    $scope.getUnitByName = function(unitName){
        return $scope.data.units.find((u) => { return u["name"] === unitName });
    };

    // DICE ROLLING FUNCTIONS -------------------------------------------------

    $scope.rollDice = function(){
        $scope.quickRollDice($scope.dice.lowerBound, 
                             $scope.dice.upperBound, 
                             $scope.dice.rollCount,
                             $scope.dice.rollAverages);
    };

    $scope.quickRollDice = function(lowerBound, upperBound, rollCount, rollAverages){
        var rolls;
        if(!rollAverages) rolls = getRegularRollArray(lowerBound, upperBound, rollCount);
        else rolls = getAveragedRollArray(lowerBound, upperBound, rollCount);

        if($scope.diceHistory.length >= 20)
            $scope.diceHistory.pop();

        $scope.diceHistory.unshift({
            'lowerBound': lowerBound,
            'upperBound': upperBound,
            'rollCount': rollCount,
            'rollStyle': (rollAverages ? 1 : 0),
            'rolls': rolls
        });
    };

    function getRegularRollArray(lowerBound, upperBound, rollCount){
        var rolls = [];
        for(var i = 0; i < rollCount; i++)
            rolls.push(getRandomInt(lowerBound, upperBound));
        return rolls;
    };

    function getAveragedRollArray(lowerBound, upperBound, rollCount){
        var rolls = [];
        for(var i = 0; i < rollCount; i++){
            var rollSet = [];
            var roll1 = getRandomInt(lowerBound, upperBound);
            var roll2 = getRandomInt(lowerBound, upperBound);

            rollSet.push(roll1);
            rollSet.push(roll2);
            rollSet.push((roll1 + roll2) / 2); //average of 2 dice
            rolls.push(rollSet);
        }
        return rolls;
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    };
    
    $scope.clearDiceHistory = function(){
        $scope.diceHistory = [];
    };
    
    $scope.validateDiceRange = function(){
        var inputDiceUpperBound = document.querySelector('input[name="upperBound"]');
        if($scope.dice.lowerBound >= $scope.dice.upperBound)
            inputDiceUpperBound.setCustomValidity("Highest Value must be greater than Lowest Value.");
        else
            inputDiceUpperBound.setCustomValidity("");
    };

    // COORDINATE DISPLAY --------------------------------------------------------------------

    document.addEventListener("keydown", (event) => {
        if( event.keyCode == 84 //"T" key
         && !(event.altKey || event.ctrlKey || event.shiftKey) //Make sure we're not firing off any keyboard shortcuts
         && document.activeElement.tagName != "INPUT") //We're not focused on an input field 
        {
            //Toggle coord display
            $scope.displayTileCoordinates = !$scope.displayTileCoordinates;
            $scope.$apply();
        }
    });

    function setTileCoordinateFontSize(){
        var lastRow = $scope.data.map.tiles[$scope.data.map.tiles.length - 1];
        var bottomRightTile = lastRow[lastRow.length - 1];
        var bottomRightCoordLength = bottomRightTile.coordinate.asText.length;

        var multiplier;
        switch(bottomRightCoordLength)
        {
            case 2:
            case 3: multiplier = 0.35; break;
            case 4: multiplier = 0.3; break;
            default: multiplier = 0.25; break;
        }

        $scope.tileCoordinatesFontSize = Math.floor(($scope.data.map.constants.tileSize + $scope.data.map.constants.tileSpacing) * multiplier);
    };
}]);