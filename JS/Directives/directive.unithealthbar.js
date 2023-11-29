app.directive('unithealthbar', [function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/unithealthbar.html',
        scope: {
            hpPercentage: "=hppercentage",
            fallbackWidth: "=?fallbackwidth",
            fallbackHeight: "=?fallbackheight"
        },
        link: function($scope, element, attrs) {

            //Render health bar canvas
            function renderCanvas(){
                var unithealthbar = element[0];
                var canvas = unithealthbar.firstChild;
                var context = canvas.getContext("2d");

                //Match canvas size to that of its parent
                //If element isn't actually rendered yet (clientWidth/Height), try fallbacks
                if(unithealthbar.clientWidth > 0) canvas.width = unithealthbar.clientWidth;
                else if($scope.fallbackWidth != undefined) canvas.width = $scope.fallbackWidth;
                else if(unithealthbar.style.width.length > 0) canvas.width = unithealthbar.style.width.slice(0, -2);

                if(unithealthbar.clientHeight > 0) canvas.height = unithealthbar.clientHeight;
                else if($scope.fallbackHeight != undefined) canvas.height = $scope.fallbackHeight;
                else if(unithealthbar.style.height.length > 0) canvas.height = unithealthbar.style.height.slice(0, -2);

                context.fillStyle = 'gray';
                context.fillRect(0, 0, canvas.width, canvas.height);

                var hpColor;
                if($scope.hpPercentage > 100) hpColor = "#992DE4"; //purple
                else if($scope.hpPercentage > 50) hpColor = "#3CD66F"; //green
                else if($scope.hpPercentage > 25) hpColor = "#FFC107"; //yellow
                else hpColor = "#F13535"; //red

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