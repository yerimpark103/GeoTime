// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
var geotimeServices = angular.module('geotimeServices', []);

geotimeServices.factory('gservice', function($rootScope, $http){
        // Tutorial from Google
        var googleMapService = {};
        var locations = [];
        var lastNames = [];

        // Variables we'll use to help us pan to the right spot
        var lastMarker;
        var currentSelectedMarker;

        // Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        // Handling Clicks and location selection
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Functions
        googleMapService.refresh = function(latitude, longitude){

            locations = [];
            lastNames = [];
            selectedLat = latitude;
            selectedLong = longitude;

            // Perform an AJAX call to get all of the records in the db.
            $http.get('/users').success(function(response){

                // Convert the results into Google Map Format
                locations = convertToMapPoints(response);
                //lastNames = lastNamePicker(response);
                // Then initialize the map.
                initialize(latitude, longitude);
                //console.log(lastNames);

            }).error(function(){});
        };

        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];
            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // Create popup windows for each record
                var  contentString =
                    '<p><b>firstName</b>: ' + user.firstName +
                    '<p><b>lastName</b>: ' + user.lastName +
                    '<br><b>Date</b>: ' + user.date +
                    '<br><b>address</b>: ' + user.address +
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    date: user.date,
                    address: user.address
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };
    
var initialize = function(latitude, longitude) {

    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            // When clicked, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // Set initial location as a bouncing red marker
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    // Function for moving to a selected location
    map.panTo(new google.maps.LatLng(latitude, longitude));

    // Clicking on the Map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red bouncing marker
        if(lastMarker){
            lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });
};

// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

  var getLogins = function(response){
    logins = [];
    $http.get('/logins').success(function(response){
        logins = convertToLogins(response);
    }).error(function(){});
    var convertToLogins = function(response){
        // Clear the logins holder
        var logins = [];
        // Loop through all of the JSON entries provided in the response
        for(var i= 0; i < response.length; i++) {
            var login = response[i];

            // Create popup windows for each record
            var  contentString =
                '<p><b>group</b>: ' + login.group +
                '</p>';

            // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
            logins.push({
                group: login.group
            });
        }
    };
    // location is now an array populated with records in Google Maps format
    return logins;
  };

return googleMapService;
});
