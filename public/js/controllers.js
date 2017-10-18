// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' and 'gservice' modules and controllers.
var geotimeControllers = angular.module('geotimeControllers',[]);

geotimeControllers.controller('addCtrl', ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
//var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
//addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){
    $http.get('/users').success(function(data){
      console.log(data);
      $scope.users = data;
    });

    $("createUserSuccess").show();
    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        // Display message confirming that the coordinates verified.
      //  $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // Functions
    // ----------------------------------------------------------------------------
    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            //$scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });

    // Creates a new user based on the form fields
    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            firstName: $scope.formData.firstName,
            lastName: $scope.formData.lastName,
            date: $scope.formData.date,
            address: $scope.formData.address,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.date = "";
                $scope.formData.address = "";
                $scope.formData.latitude = 39.500;
                $scope.formData.longitude = -98.350;

                // Refresh the map with new data
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

                $("createUserSuccess").show();
                $scope.displayText = "User "+ $scope.formData.firstName + " " + $scope.formData.lastName + " has been added";
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.createMap = function() {
      console.log("CREATING MAP ID");
      var User = mongoose.model('scotch-user', UserSchema);
      User.find({"lastName" : $scope.formData.lastName}, 'location', function(err, users){
        console.log(location);
        if (err) return handleError(err);
      });
    };
}]);
