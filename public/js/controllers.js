// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' and 'gservice' modules and controllers.
var geotimeControllers = angular.module('geotimeControllers',[]);

geotimeControllers.controller('addCtrl', ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
//var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
//addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){
    $http.get('/users').success(function(data){
      console.log(data);
      console.log("get users");
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
    //Refreshes
    $scope.refreshUsers = function(){
      $http.get('/users').success(function(data){
          $scope.users = data;
        });
      };
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
            assignedGroup : $scope.formData.assignedGroup,
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
                $scope.refreshUsers();

                $("createUserSuccess").show();
                $scope.displayText = "User "+ $scope.formData._id + " " + " has been added for group " + $scope.formData.assignedGroup;
                var myGroup = $scope.formData.assignedGroup;
                myGroup.maps.push($scope.formData._id);
                console.log("Added map id is "+ $scope.formData._id);
                $http.put('/logins'+  $scope.formData.assignedGroup._id);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // $http.get('/users/'+_id).success(function(data){
    //   console.log(data);
    //   console.log("get userid");
    // });

    //Removes one data
    $scope.removeOne = function(_id){
      $http({
          url: '/users/' + _id,
          method: 'GET',
          params: {_id : _id}
        });
      var index = -1;
      var userArr = eval($scope.users);
      for (var i = 0; i < userArr.length; i++){
        if (userArr[i]._id === _id){
          index = i;
          break;
        }
      }
      if (index === -1){
        alert("something is wrong");
      }
      $scope.users.splice(index,1);
      $http.delete('/users/' + _id);
    };

    $scope.createMap = function() {
      console.log("CREATING MAP ID");
      var User = mongoose.model('scotch-user', UserSchema);
      User.find({"lastName" : $scope.formData.lastName}, 'location', function(err, users){
        console.log(location);
        if (err) return handleError(err);
      });
    };
    $http.get('/logins').success(function(data){
        $scope.logins = data;
      });
}]);

geotimeControllers.controller('loginCtrl', ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
  $http.get('/logins').success(function(data){
    console.log(data);
    console.log("get logins");
    $scope.logins = data;
  });

  $("createLoginSuccess").show();
  // Initializes Variables
  // ----------------------------------------------------------------------------
  $scope.formData = {};
  // Set initial coordinates to the center of the US

  // Functions
  // ----------------------------------------------------------------------------
  //Refreshes
  $scope.refreshLogins = function(){
    $http.get('/logins').success(function(data){
        $scope.logins = data;
      });
    };
  // Creates a new login based on the form fields
  $scope.createLogin = function() {

      // Grabs all of the text box fields
      var loginData = {
          group: $scope.formData.group
      };

      // Saves the login data to the db
      $http.post('/logins', loginData)
          .success(function (data) {
              $scope.formData.group = "";

              // // Refresh the map with new data
              gservice.getLogins();
              $scope.refreshLogins();

              $("createLoginSuccess").show();
              $scope.displayText1 = "Login "+ $scope.formData.group + " has been added";
          })
          .error(function (data) {
              console.log('Error: ' + data);
          });
  };
}]);

geotimeControllers.controller('visualsCtrl', ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
   myX = [];
   myY = [];
   myZ = [];
  $http.get('/users').success(function(data){
    $scope.users = data;
    var i = 0;
    for (i; i < data.length; i++){
      myX.push(data[i].location[0]); //lat
      myY.push(data[i].location[1]); //lon
      var parsedDate = (new Date(data[i].date).getFullYear());
      myZ.push(parsedDate);
    }
  });
  setTimeout(visualizeMe, 1000); //need time to retreive data
  function visualizeMe(){
    console.log("x",myX);
    console.log("y",myY);
    console.log("z",myZ);
    trace1 = {
      x: myX,
      y: myY,
      z: myZ,
      line: {
        color: '#00AEEF',
        width: 3
      },
      //mode: 'lines',
      name: 'My Data',
      type: 'scatter3d'
    };
    console.log(trace1);
    trace2 = {
      x: [38.82222222,
          38.15,
          38.55888889,
          51.45,
          38.15,
          52.75,
          38.15,
          53.16527778,
          53.16527778,
          51.52027778,
          53.62944444,
          53.16527778,
          53.16527778,
          53.16527778,
          53.16527778,
          53.16527778,
          53.16527778,
          52.75,
          52.75,
          52.44944444],
      y: [-77.3089,
          -76.4258,
          -76.9275,
          3.6500,
          -76.4258,
          -1.2500,
          -76.4258,
          -0.8742,
          -0.8742,
          -0.1306,
          -2.737222222,
          -0.8741666667,
          -0.8741666667,
          -0.8741666667,
          -0.8741666667,
          -0.8741666667,
          -0.8741666667,
          -1.25,
          -1.25,
          1.166666667],
      z: [1772,
          1687,
          1751,
          1634,
          1687,
          1590,
          1646,
          1560,
          1593,
          1535,
          1559,
          1505,
          1554,
          1485,
          1556,
          1465,
          1550,
          1482,
          1556],
      line: {
        color: '#FDB813',
        width: 3
      },
      //mode: 'lines',
      name: '2015-01-14 11:04:09',
      type: 'scatter3d'
    };

    trace3 = {
      x: [52.44944444,
          2.803333333,
          52.81888889,
          52.81888889,
          52.44944444,
          53.05666667,
          52.75,
          53.16527778,
          50,
          38.15,
          38.15,
          38.55888889,
          38.15,
          38.55888889,
          38.15,
          38.15,
          38.33333333,
          39.925,
          35.88722222,
          40.16611111],
      y: [1.166666667,
          -2.803333333,
          -1.055277778,
          -1.055277778,
          1.166666667,
          -0.9588888889,
          -1.25,
          -0.8741666667,
          -1,
          -76.42583333,
          -76.42583333,
          -76.9275,
          -76.42583333,
          -76.9275,
          -76.42583333,
          -76.42583333,
          -76.13333333,
          -85.36666667,
          -79.85833333,
          -84.80333333],
      z: [1467,
          1501,
          1469,
          1556,
          1491,
          1556,
          1567,
          1632,
          1655,
          1737,
          1663,
          1698,
          1673,
          1739,
          1690,
          1747,
          1774,
          1849,
          1777,
          1853],
      line: {
        color: '#FF0000',
        width: 3
      },
      //mode: 'lines',
      name: '2015-01-14 12:26:08',
      type: 'scatter3d'
    };

    trace4 = {
      x: [35.88722222,
          39.925,
          38.33333333,
          40.16611111,
          39,
          38,
          37,
          36,
          35,
          34],
      y: [-79.85833333,
          -85.36666667,
          -76.13333333,
          -84.80333333,
          -90,
          -95,
          -97,
          -105,
          -115,
          -120],
      z: [1803,
          1854,
          1751,
          1823,
          1900,
          1910,
          1930,
          1935,
          1936,
          2000],
      line: {
        color: '#473025',
        width: 3
      },
      //mode: 'lines',
      name: '2015-01-14 12:46:46',
      type: 'scatter3d'
    };

    data = [trace1, trace2];
    layout = {
      autosize: true,
      height: 1000,
      scene: {cameraposition: [
          [0.179009801309, 0.484305194501, 0.848821039475, -0.113608153579], [0, 0, 0], 2.165063509]},
      showlegend: true,
      width: 1000,
      xaxis: {
        title: 'Lat',
        type: 'linear'
      },
      yaxis: {
        showticklabels: false,
        ticks: '',
        title: 'Lon',
        type: 'linear'
      }
    };


    Plotly.plot('plotly-div', {
      data: data,
      layout: layout
    });
  }

}]);
