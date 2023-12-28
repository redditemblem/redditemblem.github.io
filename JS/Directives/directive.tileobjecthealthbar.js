app.directive('tileobjecthealthbar', [function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/tileobjecthealthbar.html',
        scope: {
            hpPercentage: "=hppercentage",
            fallbackWidth: "=?fallbackwidth",
            fallbackHeight: "=?fallbackheight"
        },
        link: function($scope, element, attrs) {

            //Render health bar canvas
            function renderCanvas(){
                var tileobjecthealthbar = element[0];
                var canvas = tileobjecthealthbar.firstChild;
                var context = canvas.getContext("2d");

                //Match canvas size to that of its parent
                //If element isn't actually rendered yet (clientWidth/Height), try fallbacks
                if(tileobjecthealthbar.clientWidth > 0) canvas.width = tileobjecthealthbar.clientWidth;
                else if($scope.fallbackWidth != undefined) canvas.width = $scope.fallbackWidth;
                else if(tileobjecthealthbar.style.width.length > 0) canvas.width = tileobjecthealthbar.style.width.slice(0, -2);

                if(tileobjecthealthbar.clientHeight > 0) canvas.height = tileobjecthealthbar.clientHeight;
                else if($scope.fallbackHeight != undefined) canvas.height = $scope.fallbackHeight;
                else if(tileobjecthealthbar.style.height.length > 0) canvas.height = tileobjecthealthbar.style.height.slice(0, -2);

                context.fillStyle = 'white';
                context.fillRect(0, 0, canvas.width, canvas.height);
                
                var hpColor;
                if($scope.hpPercentage > 100) hpColor = "#992DE4"; //purple
                else hpColor = "#00A9D4"; //blue

                context.fillStyle = hpColor;
                context.fillRect(0, 0, Math.floor(canvas.width*(Math.min(100, $scope.hpPercentage)/100)), canvas.height);
                
                context.lineWidth = 2;
                context.strokeRect(0, 0, canvas.width, canvas.height);
            };

            $scope.$watch('hpPercentage', function(newVal, oldVal){
                if(newVal != oldVal)
                    renderCanvas();
            });

            renderCanvas();
        }
    };
 }]);