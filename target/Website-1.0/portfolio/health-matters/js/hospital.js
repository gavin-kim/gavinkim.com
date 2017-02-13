/*
    Group Project - Health Matters!
    Student Names: Yoonkwan Kim, Jody Kirton, Nicole Serrao
*/

"use strict";

//globals
var lngHosp;
var latHosp;
var lngSH;
var latSH;
var mapCampus;
var myPath;
var pathCoordinates;

var mapDesc;
var mapHosp;
var mapOptions;
var map;
var myLoc;
var myLoc2;
var info;
var info2;

var depart;

// data object : data.hospital

function initHospital(json) {

    // store json file in the global object
    data.hospital = json.hospital;
    HOSPITAL.clickEvent = initHospitalDetails;
    HOSPITAL.item = data.hospital;
}


/**
 * Initialize hospital-details page When an item is clicked
 *
 * @param hospital used for hospital-details page
 */
function initHospitalDetails(hospital) {

    //header
    $("#hospName").html(
        "<a href='" + hospital.url + "' class='ui-btn ui-icon-heart ui-nodisc-icon ui-btn-corner-all ui-btn-icon-left'>" +
        hospital.name +
        "</a>"
    );

    //hospital information
    $("#hospInfo").html(
        "Location: " + hospital.city + "<br>"  +
        "Phone Number: " + hospital.mainPhoneNumber + "<br>"
    );


    //departments  summHosp
    depart = hospital.departments;

    // reset html elements
    $("#summHosp").html("");

    for(var x=0; x < depart.length; x++){
        $("#summHosp").append(
            "<section id='summDepart" + x +"' data-role='collapsible'>" +
            "<h3>" + depart[x].departmentName + "</h3>" +
            "<p> Description: " + depart[x].description + "</p>" +
            "<div>" +
            depart[x].fact2 +
            "</div><br>" +
            "<div>" +
            depart[x].fact1 +
            "</div>" +
            "</section>"
        );

        $("#summDepart" + x).collapsible();
    }

    //registerMemberClickEvent();
}

// Google map must be loaded after the page is shown
function initMap() {

    // Check if google map already loaded
    if (map) return;

    /* Initialize the map */

    //map description
    $('#mapSection').show();

    //coordinates for hospital
    lngHosp = parseFloat(data.hospital.longitude);
    latHosp = parseFloat(data.hospital.latitude);

    //first step is to set center point
    mapHosp = new google.maps.LatLng(latHosp, lngHosp);

    //set map - points to hospital
    mapOptions = {
        center: mapHosp,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
        //other options are roadmap, salellite, terain
    };

    //draw map
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    //marker for hospital
    myLoc = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: mapHosp
    }); 

    //info window content
    info = new google.maps.InfoWindow({
        content: data.hospital.name
    });

    //add listener 
    google.maps.event.addListener(myLoc, "click", function() {
        info.open(map, myLoc);
    });
       
    //Sheridan Campus Coordinates (trafalgar)
    latSH = 43.469280;
    lngSH = -79.698683;
    
    //info for second marker
    var locNameSH = 'Sheridan Trafalgar Campus';
    var grpNames = 'Yoonkwan Kim, Jody Kirton, Nicole Serrao';
   
    // coordinates on map for Sheridan
    mapCampus = new google.maps.LatLng(latSH, lngSH);
    
    //marker for sheridan campus
    myLoc2 = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,		// or BOUNCE (optional)
        position: mapCampus
    });
    
    //info window content - sheridan campus
    info2 = new google.maps.InfoWindow({
        content: locNameSH + "<br>" + grpNames
    });

    //add listener for information for marker 
    google.maps.event.addListener(myLoc2, "click", function() {
        info2.open(map, myLoc2);
    });
        	

    // draw path from Sheridan to Destination
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        preserveViewport: true
    });

    directionsService.route({
        origin: new google.maps.LatLng(latSH, lngSH),
        destination: new google.maps.LatLng(latHosp, lngHosp),
        travelMode: google.maps.TravelMode.DRIVING

    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            // directionsDisplay.setDirections(response);

            //polyline
            var polyline = new google.maps.Polyline({
                path: [],
                strokeColor: '#b700b3',
                strokeWeight: 2
            });
            var bounds = new google.maps.LatLngBounds();

            var legs = response.routes[0].legs;

            for (var i = 0; i < legs.length; i++) {
                var steps = legs[i].steps;
                for (var j = 0; j < steps.length; j++) {
                    var nextSegment = steps[j].path;
                    for (var k = 0; k < nextSegment.length; k++) {
                        polyline.getPath().push(nextSegment[k]);
                        bounds.extend(nextSegment[k]);
                    }
                }
            }
            polyline.setMap(map); //set polyline on the map

        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
