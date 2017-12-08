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
                var myMap = data.data;
                console.log("My Map is ",myMap);
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
   myX1 = [];
   myY1 = [];
   myZ1 = [];
   myX2 = [];
   myY2 = [];
   myZ2 = [];
   YP = [];
   SC = [];
  $http.get('/users').success(function(data){ //, {params:{lastName : "Cartwright"}}
    $scope.users = data;
    console.log(data);

    var i = 0;
    for (i; i < data.length; i++){
      if (data[i].assignedGroup === "5a1f81b750b406141b81956c"){
        myX1.push(data[i].location[0]); //lat
        myX1.push(data[i].location[0]);
        myY1.push(data[i].location[1]); //lon
        myY1.push(data[i].location[1]);
        var parsedDate = (new Date(data[i].date).getFullYear());
        myZ1.push(parsedDate);
        if (i === data.length - 1){
          var dummyDate = (new Date(data[i].date).getFullYear());
          myZ1.push(dummyDate);
        }
        else{
          var dummyDate = (new Date(data[i+1].date).getFullYear());
          myZ1.push(dummyDate);
        }
      }
      else if (data[i].assignedGroup === "5a1faa9b4309642c7a1f12f6"){
        myX.push(data[i].location[0]); //lat
        myX.push(data[i].location[0]);
        myY.push(data[i].location[1]); //lon
        myY.push(data[i].location[1]);
        var parsedDate = (new Date(data[i].date).getFullYear());
        myZ.push(parsedDate);
        if (i === data.length - 1){
          var dummyDate = (new Date(data[i].date).getFullYear());
          myZ.push(dummyDate);
        }
        else{
          var dummyDate = (new Date(data[i+1].date).getFullYear());
          myZ.push(dummyDate);
        }
      }
      else {
        myX2.push(data[i].location[0]); //lat
        myX2.push(data[i].location[0]);
        myY2.push(data[i].location[1]); //lon
        myY2.push(data[i].location[1]);
        var parsedDate = (new Date(data[i].date).getFullYear());
        myZ2.push(parsedDate);
        if (i === data.length - 1){
          var dummyDate = (new Date(data[i].date).getFullYear());
          myZ2.push(dummyDate);
        }
        else{
          var dummyDate = (new Date(data[i+1].date).getFullYear());
          myZ2.push(dummyDate);
        }
      }

    }

  });
  setTimeout(visualizeMe, 1000); //need time to retreive data
  function visualizeMe(){
    console.log("x",myX);
    console.log("y",myY);
    console.log("z",myZ);
    console.log("x1",myX1);
    console.log("y1",myY1);
    console.log("z1",myZ1);
    trace1 = {
      x: myX,
      y: myY,
      z: myZ,
      line: {
        color: '#FDB813',
        width: 5
      },
      mode: 'lines',
      name: 'SC',
      type: 'scatter3d'
    };
    console.log(trace1);
    trace2 = {
      x: myX1,
      y: myY1,
      z: myZ1,
      line: {
        color: '#00AEEF',
        width: 5
      },
      mode: 'lines',
      name: 'YP',
      type: 'scatter3d'
    };
    trace3 = {
      x: myX2,
      y: myY2,
      z: myZ2,
      line: {
        color: '#CCAB29', //TODO : Change this color : Randomly Generate Hex code color
        width: 5
      },
      mode: 'lines',
      name: 'MISC',
      type: 'scatter3d'
    };

    /*TODO: SCALING : 180/180 FIXED Square, keep the scaling
            Year sorting is off
            Have Schema -> Group -> (MAP3D) Select your group -> Shows group members' data in separate lines*/

    data = [trace1, trace2, trace3];
    layout = {
      autosize: true,
      height: 800,
      scene: {cameraposition: [
          [0.179009801309, -0.484305194501, 0.848821039475, -0.113608153579], [0, 0, 0], 2.565063509]},
      showlegend: true,
      width: 800,
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

geotimeControllers.controller('tempCtrl', ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
  $http.get('/users').success(function(data){
    $scope.users = data;
    console.log(data);
    var i = 0;
    result = [];
    for (i; i < data.length; i++){
      result.push(data[i].location);
    }
    console.log(result);
  });
  $http.get('/logins').success(function(data){
    $scope.logins = data;
  });

}]);
