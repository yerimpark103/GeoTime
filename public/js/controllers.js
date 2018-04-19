// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' and 'gservice' modules and controllers.
var geotimeControllers = angular.module('geotimeControllers',[]);

geotimeControllers.controller('addCtrl', ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
  var config = {
    apiKey: "AIzaSyANcyqHCEjd__Gb6KDZ-poI2JL0y4qnvuI",
    authDomain: "fir-web-proj.firebaseapp.com",
    databaseURL: "https://fir-web-proj.firebaseio.com",
    projectId: "fir-web-proj",
    storageBucket: "fir-web-proj.appspot.com",
    messagingSenderId: "907033796384"
  };
  firebase.initializeApp(config);

  function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


    var button = document.getElementById("button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(button);



    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  (function(){
	window.onload = function(){
		var x = document.getElementById("demo");

		function getLocation() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition);
		    } else {
		        x.innerHTML = "Geolocation is not supported by this browser.";
		    }
		}

		function showPosition(position) {
			window.alert("mayank");
			window.alert(position);
		    x.innerHTML = "Latitude: " + position.coords.latitude +
		    "<br>Longitude: " + position.coords.longitude;
				var listvalues = localStorage.getItem('lists');
		}
		getLocation();
		var listvalues = localStorage.getItem('lists');
	    var obj = JSON.parse(listvalues);
	    var starCountRef = firebase.database().ref(obj.username);
	    var username = starCountRef.key;
    	/*starCountRef.once('value', function(snapshot) {
    		window.alert(snapshot.val().password);

		});*/
		var locations = [];
		var eventname = []
		var eventdesc = [];
		var eventsRef = firebase.database().ref(obj.username + "/events/");
		eventsRef.once('value', function(snapshot) {
			snapshot.forEach(function(item) {
				eventname.push(item.val().eventname);
				eventdesc.push(item.val().eventdesc);
				var latlng = [item.val().latitude, item.val().longitude];
				locations.push(new google.maps.LatLng(latlng[0], latlng[1]));
		    });
		    var map = new google.maps.Map(document.getElementById('map'), {
		      zoom: 10,
		      center: new google.maps.LatLng(-33.92, 151.25),
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    });

		    var infowindow = new google.maps.InfoWindow();

			var marker, i;
			var markers = new Array();
			//window.alert(locations.length);
		    for (i = 0; i < locations.length; i++) {
		      marker = new google.maps.Marker({
		        position: locations[i],
		        map: map,
		        label: eventname[i]
		      });

		      markers.push(marker);

		      google.maps.event.addListener(marker, 'click', (function(marker, i) {
		        return function() {
		          infowindow.setContent(eventdesc[i]);
		          infowindow.open(map, marker);
		        }
		      })(marker, i));
	    	}

	    	function AutoCenter() {
		      //  Create a new viewpoint bound
		      var bounds = new google.maps.LatLngBounds();
		      //  Go through each...
		      $.each(markers, function (index, marker) {
		      bounds.extend(marker.position);
		      });
		      //  Fit these bounds to the map
		      map.fitBounds(bounds);
		    }
		    AutoCenter();

		    var path = new google.maps.Polyline({
			    path: locations,
			    geodesic: true,
	          	strokeColor: '#FF0000',
	          	strokeOpacity: 1.0,
	          	strokeWeight: 2
  			});
  			path.setMap(map);
		});
		var button = document.getElementById("addevent");
		button.onclick = addEvent;
		var buttonfilter = document.getElementById("addFilter");
		buttonfilter.onclick = addFilter;
		var b = document.getElementById("nearby");
		b.onclick = getDist;


	};

	function addEvent(){
		window.location="initial.html";
	}

	function addFilter () {
		var listvalues = localStorage.getItem('lists');
		var obj = JSON.parse(listvalues);
		var locations = [];
		var eventname = []
		var eventdesc = [];
		window.alert(obj.identifier);
		var ref = firebase.database().ref(obj.identifier);
		ref.once('value', function(snapshot) {
			snapshot.forEach(function(item) {
					window.alert(item.val().username);
					var eventsRef = firebase.database().ref(item.val().username + "/events/");
					eventsRef.once('value', function(snapshot1) {
						snapshot1.forEach(function(item1) {
							eventname.push(item1.val().eventname);
							eventdesc.push(item1.val().eventdesc);
							var latlng = [item1.val().latitude, item1.val().longitude];
							locations.push(new google.maps.LatLng(latlng[0], latlng[1]));
				    });
				    var map = new google.maps.Map(document.getElementById('map'), {
				      zoom: 10,
				      center: new google.maps.LatLng(-33.92, 151.25),
				      mapTypeId: google.maps.MapTypeId.ROADMAP
				    });

				    var infowindow = new google.maps.InfoWindow();

					var marker, i;
					var markers = new Array();
					//window.alert(locations.length);
				    for (i = 0; i < locations.length; i++) {
				      marker = new google.maps.Marker({
				        position: locations[i],
				        map: map,
				        label: eventname[i]
				      });

				      markers.push(marker);

				      google.maps.event.addListener(marker, 'click', (function(marker, i) {
				        return function() {
				          infowindow.setContent(eventdesc[i]);
				          infowindow.open(map, marker);
				        }
				      })(marker, i));
			    	}

			    	function AutoCenter() {
				      //  Create a new viewpoint bound
				      var bounds = new google.maps.LatLngBounds();
				      //  Go through each...
				      $.each(markers, function (index, marker) {
				      bounds.extend(marker.position);
				      });
				      //  Fit these bounds to the map
				      map.fitBounds(bounds);
				    }
				    AutoCenter();

				    var path = new google.maps.Polyline({
					    path: locations,
					    geodesic: true,
			          	strokeColor: '#FF0000',
			          	strokeOpacity: 1.0,
			          	strokeWeight: 2
		  			});
		  			path.setMap(map);
				});

		    });
		});
	}

	function getDist(){
		var x = document.getElementById("demo");

		function getLocation() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition);
		    } else {
		        x.innerHTML = "Geolocation is not supported by this browser.";
		    }
		}

		function showPosition(position) {
			window.alert("mayank");
			window.alert(position);
		    x.innerHTML = "Latitude: " + position.coords.latitude +
		    "<br>Longitude: " + position.coords.longitude;
				var listvalues = localStorage.getItem('lists');
		}
		getLocation();

	    var geoSuccess = function(position) {
	    var startPos = position;
	    window.alert(startPos.coords.latitude + " " + startPos.coords.longitude);
	  };
	  var geoError = function(error) {
	    switch(error.code) {
	      case error.TIMEOUT:
	        // The user didn't accept the callout
	        showNudgeBanner();
	        break;
	    }
	  };
	   navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
      	lat1 = 40.1036264;
        lon1 = -88.22835429999998;
        lat2 = 40.104705;
        lon2 = -88.22717799999998;
		var R = 6371; // km (change this constant to get miles)
		var dLat = (lat2-lat1) * Math.PI / 180;
		var dLon = (lon2-lon1) * Math.PI / 180;
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		if (d>1) window.alert(Math.round(d)+"km");
		else if (d<=1) window.alert(Math.round(d*1000)+"m");
		return d;
	}

	function deg2rad(deg) {
	  return deg * (Math.PI/180)
	}

})();
    // $http.get('/users').success(function(data){
    //   console.log(data);
    //   console.log("get users");
    //   $scope.users = data;
    // });
    //
    // $("createUserSuccess").show();
    // // Initializes Variables for mapping
    // $scope.formData = {};
    // var coords = {};
    // var lat = 0;
    // var long = 0;
    //
    // // Initial coords
    // $scope.formData.latitude = 39.500;
    // $scope.formData.longitude = -98.350;
    //
    // geolocation.getLocation().then(function(data){
    //
    //     // Set the latitude and longitude
    //     coords = {lat:data.coords.latitude, long:data.coords.longitude};
    //
    //     $scope.formData.longitude = parseFloat(coords.long).toFixed(3); // rounding to 3 decimals
    //     $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    //
    //     gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    //
    // });
    //
    // $scope.refreshUsers = function(){
    //   $http.get('/users').success(function(data){
    //       $scope.users = data;
    //     });
    //   };
    // // Get coordinates based on mouse click. Tutorial online <
    // $rootScope.$on("clicked", function(){
    //
    //     $scope.$apply(function(){
    //         $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
    //         $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
    //     });
    // });
    //
    // // Create new user
    // $scope.createUser = function() {
    //
    //     var userData = {
    //         firstName: $scope.formData.firstName,
    //         lastName: $scope.formData.lastName,
    //         date: $scope.formData.date,
    //         address: $scope.formData.address,
    //         location: [$scope.formData.longitude, $scope.formData.latitude],
    //         assignedGroup : $scope.formData.assignedGroup,
    //         htmlverified: $scope.formData.htmlverified
    //     };
    //
    //     // Saves the user data to the db
    //     $http.post('/users', userData)
    //         .success(function (data) {
    //             //clear form
    //             $scope.formData.date = "";
    //             $scope.formData.address = "";
    //             $scope.formData.latitude = 39.500;
    //             $scope.formData.longitude = -98.350;
    //
    //             // Refresh the map with new data
    //             gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    //             $scope.refreshUsers();
    //
    //             $("createUserSuccess").show();
    //             var myMap = data.data;
    //             console.log("My Map is ",myMap);
    //             $scope.displayText = "User "+ $scope.formData._id + " " + " has been added for group " + $scope.formData.assignedGroup;
    //             var myGroup = $scope.formData.assignedGroup;
    //             myGroup.maps.push($scope.formData._id);
    //             console.log("Added map id is "+ $scope.formData._id);
    //             $http.put('/logins'+  $scope.formData.assignedGroup._id);
    //         })
    //         .error(function (data) {
    //             console.log('Error: ' + data);
    //         });
    // };
    //
    // // $http.get('/users/'+_id).success(function(data){
    // //   console.log(data);
    // //   console.log("get userid");
    // // });
    //
    // //Removes one dataset
    // $scope.removeOne = function(_id){
    //   $http({
    //       url: '/users/' + _id,
    //       method: 'GET',
    //       params: {_id : _id}
    //     });
    //   var index = -1;
    //   var userArr = eval($scope.users);
    //   for (var i = 0; i < userArr.length; i++){
    //     if (userArr[i]._id === _id){
    //       index = i;
    //       break;
    //     }
    //   }
    //   if (index === -1){
    //     alert("something is wrong");
    //   }
    //   $scope.users.splice(index,1);
    //   $http.delete('/users/' + _id);
    // };
    //
    // $scope.createMap = function() {
    //   console.log("CREATING MAP ID");
    //   var User = mongoose.model('scotch-user', UserSchema);
    //   User.find({"lastName" : $scope.formData.lastName}, 'location', function(err, users){
    //     console.log(location);
    //     if (err) return handleError(err);
    //   });
    // };
    // $http.get('/logins').success(function(data){
    //     $scope.logins = data;
    //   });
}]);

geotimeControllers.controller('loginCtrl', ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
  $http.get('/logins').success(function(data){
    console.log(data);
    console.log("get logins");
    $scope.logins = data;
  });

  $("createLoginSuccess").show();
  // Initializes Variables
  $scope.formData = {};

  $scope.refreshLogins = function(){
    $http.get('/logins').success(function(data){
        $scope.logins = data;
      });
    };
  // Creates a new login based on the form fields
  $scope.createLogin = function() {
      var loginData = {
          group: $scope.formData.group
      };

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

//Controller for Graphing. TODO : A BETTER CODE
geotimeControllers.controller('visualsCtrl', ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
/* RETRIEVE DATA FROM FIREBASE */
var config = {
  apiKey: "AIzaSyANcyqHCEjd__Gb6KDZ-poI2JL0y4qnvuI",
  authDomain: "fir-web-proj.firebaseapp.com",
  databaseURL: "https://fir-web-proj.firebaseio.com",
  projectId: "fir-web-proj",
  storageBucket: "fir-web-proj.appspot.com",
  messagingSenderId: "907033796384"
};
firebase.initializeApp(config);

var eventsRef = firebase.database().ref(obj.username + "/events/" + eventdate);

myX = [];
myY = [];
myZ = [];


  //  myX = [];
  //  myY = [];
  //  myZ = [];
  //  myX1 = [];
  //  myY1 = [];
  //  myZ1 = [];
  //  myX2 = [];
  //  myY2 = [];
  //  myZ2 = [];
  //  YP = [];
  //  SC = [];
  // $http.get('/users').success(function(data){ // hardcode : {params:{lastName : "Cartwright"}}
  //   $scope.users = data;
  //   console.log(data);
  //
  //   var i = 0;
  //   for (i; i < data.length; i++){
  //     // CURRENTLY HARDCODING DATA
  //     if (data[i].assignedGroup === "5a1f81b750b406141b81956c"){
  //       myX1.push(data[i].location[0]); //lat
  //       myX1.push(data[i].location[0]);
  //       myY1.push(data[i].location[1]); //lon
  //       myY1.push(data[i].location[1]);
  //       var parsedDate = (new Date(data[i].date).getFullYear());
  //       myZ1.push(parsedDate - 1950);
  //       if (i === data.length - 1){
  //         var dummyDate = (new Date(data[i].date).getFullYear());
  //         myZ1.push(dummyDate - 1950);
  //       }
  //       else{
  //         var dummyDate = (new Date(data[i+1].date).getFullYear());
  //         myZ1.push(dummyDate - 1950);
  //       }
  //       allData = new Array();
  //       allData.push(myX1,myY1,myZ1);
  //       console.log("myData1 = ", allData);
  //     }
  //     else if (data[i].assignedGroup === "5a1faa9b4309642c7a1f12f6"){
  //       myX.push(data[i].location[0]); //lat
  //       myX.push(data[i].location[0]);
  //       myY.push(data[i].location[1]); //lon
  //       myY.push(data[i].location[1]);
  //       var parsedDate = (new Date(data[i].date).getFullYear());
  //       myZ.push(parsedDate - 1950);
  //       if (i === data.length - 1){
  //         var dummyDate = (new Date(data[i].date).getFullYear());
  //         myZ.push(dummyDate - 1950);
  //       }
  //       else{
  //         var dummyDate = (new Date(data[i+1].date).getFullYear());
  //         myZ.push(dummyDate - 1950);
  //       }
  //     }
  //     else if (data[i].assignedGroup === "5a7f7b8898eb16cc4b1a49d2") {
  //       myX2.push(data[i].location[0]); //lat
  //       myX2.push(data[i].location[0]);
  //       myY2.push(data[i].location[1]); //lon
  //       myY2.push(data[i].location[1]);
  //       var parsedDate = (new Date(data[i].date).getFullYear());
  //       myZ2.push(parsedDate - 1950);
  //       if (i === data.length - 1){
  //         var dummyDate = (new Date(data[i].date).getFullYear());
  //         myZ2.push(dummyDate - 1950);
  //       }
  //       else{
  //         var dummyDate = (new Date(data[i+1].date).getFullYear());
  //         myZ2.push(dummyDate - 1950);
  //       }
  //     }
  //
  //   }
  //
  // });
  // setTimeout(visualizeMe, 1000); //need time to retreive data
  // function visualizeMe(){
  //   console.log("x",myX);
  //   console.log("y",myY);
  //   console.log("z",myZ);
  //   console.log("x1",myX1);
  //   console.log("y1",myY1);
  //   console.log("z1",myZ1);

    /*
    trace1 = {
      x: myX,
      y: myY,
      z: myZ,
      line: {
        //color: '#FDB813',
        //Randomly Generates Hex code color
        color: '#' + Math.random().toString(16).slice(2, 8).toUpperCase(),
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
        //color: '#00AEEF',
        color: '#' + Math.random().toString(16).slice(2, 8).toUpperCase(),
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
        color: '#' + Math.random().toString(16).slice(2, 8).toUpperCase(),
        //color: '#CCAB29',
        width: 5
      },
      mode: 'lines',
      name: 'MISC',
      type: 'scatter3d'
    };
    var data = [trace1, trace2, trace3, map];
    var layout = {
    //  autosize: true,
      height: 1000,
      scene: {cameraposition: [
          [0.179009801309, -0.484305194501, 0.848821039475, -0.113608153579], [0, 0, 0], 2.565063509]},
      showlegend: true,
      width: 800,
      xaxis: {
        range: [-180,180],
        title: 'Lat',
        type: 'linear'
      },
      yaxis: {
        showticklabels: false,
        range: [-180,180],
        ticks: '',
        title: 'Lon',
        type: 'linear'
      },
      images: [
        {
          "source": "../images/worldmap.png",
          "xref": "x",
          "yref": "y",
          "zref": "z",
          "x": 1,
          "y": 3,
          "z": 0,
          "sizex": 200,
          "sizey": 200,
          "sizing": "stretch",
          "opacity": 0.4,
          "layer": "below",
          "xanchor": "right",
          "yanchor": "middle",
          "zanchor": "middle"
        }
      ]
    };


    Plotly.plot('plotly-div', {
      data: data,
      layout: layout
    });
    */


trace5 = {
  x: myX,
  y: myY,
  z: myZ,
  line: {
    //color: '#FDB813',
    //Randomly Generates Hex code color
    color: '#' + Math.random().toString(16).slice(2, 8).toUpperCase(),
    width: 6
  },
  mode: 'lines',
  name: 'SC',
  showlegend: true,
  type: 'scatter3d',
  uid: '211813',
  visible: true
};
trace6 = {
  x: myX1,
  y: myY1,
  z: myZ1,
  line: {
    //color: '#FDB813',
    //Randomly Generates Hex code color
    color: '#' + Math.random().toString(16).slice(2, 8).toUpperCase(),
    width: 6
  },
  mode: 'lines',
  name: 'YP',
  showlegend: true,
  type: 'scatter3d',
  uid: '020fd1',
  visible: true
};
data = [trace5, trace6];
layout = {
  annotations: [
    {
      x: 0.367774,
      y: 0.935,
      align: 'center',
      showarrow: false,
      text: '<b><b></b></b>',
      xanchor: 'center',
      xref: 'paper',
      yanchor: 'bottom',
      yref: 'paper'
    }
  ],
  height: 630,
  legend: {
    x: 0.73570324575,
    y: 0.658947368421,
    bgcolor: 'rgba(255, 255, 255, 255)',
    font: {color: 'rgb(0, 0, 0)'},
    xanchor: 'left',
    yanchor: 'bottom'
  },
  margin: {
    r: 0,
    t: 0,
    b: 0,
    l: 0,
    pad: 0
  },
  images: [
    {
      "source": "../images/worldmap.png",
      "xref": "x",
      "yref": "y",
      "zref": "z",
      "x": 1,
      "y": 3,
      "z": 0,
      "sizex": 200,
      "sizey": 200,
      "sizing": "stretch",
      "opacity": 0.4,
      "layer": "below",
      "xanchor": "right",
      "yanchor": "middle",
      "zanchor": "middle"
    }
  ],
  scene: {
    aspectratio: {
      x: 1,
      y: 1,
      z: 1
    },
    bgcolor: 'rgb(255, 255, 255)',
    cameraposition: [
        [0.179009801309, -0.484305194501, 0.848821039475, -0.113608153579], [0, 0, 0], 2.565063509],
    xaxis: {
      showgrid: false,
      showticklabels: false,
      titlefont: {color: 'rgb(217, 217, 217)'},
      zeroline: false
    },
    yaxis: {
      showgrid: false,
      showticklabels: false,
      titlefont: {color: 'rgb(217, 217, 217)'},
      zeroline: false
    },
    zaxis: {
      showgrid: false,
      showticklabels: false,
      titlefont: {color: 'rgb(217, 217, 217)'},
      zeroline: false
    }
  },
  showlegend: true,
  width: 840,
  xaxis: {
    anchor: 'y',
    domain: [-180, 180],
    side: 'bottom',
    type: 'linear'
  },
  yaxis: {
    anchor: 'x',
    domain: [-180, 180],
    side: 'left',
    type: 'linear'
  },
  zaxis: {
    anchor: 'z',
    domain: [0,3000]
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
