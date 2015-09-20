/**
 * Created by Noman on 9/19/2015.
 */


angular.module('starter')
.controller("HomeController", function ($scope,$state) {

        $scope.go = function (state) {
            $state.go(state);
        }
    })

    .controller("QurbaniController", function ($scope,$state) {

        $scope.go = function (Type) {
            $state.go("buyerDetails",{type:Type});
        }
    })

    .directive('map', function() {
        return {
            restrict: 'A',
            link:function(scope, element, attrs){

                var zValue = scope.$eval(attrs.zoom);
                var lat = scope.$eval(attrs.lat);
                var lng = scope.$eval(attrs.lng);


                /*var myLatlng = new google.maps.LatLng(lat,lng),
                    mapOptions = {
                        zoom: zValue,
                        center: myLatlng
                    },
                    map = new google.maps.Map(element[0],mapOptions);

                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    draggable:true
                });

                google.maps.event.addListener(marker, 'dragend', function(evt){
                    scope.$parent.user.latitude = evt.latLng.lat();
                    scope.$parent.user.longitude = evt.latLng.lng();
                    scope.$apply();
                });*/
            }
        };
    })


    .controller("BuyerDetailController", function ($scope,$stateParams,$timeout,$firebaseArray,$ionicPlatform,$cordovaCamera,$ionicPopup,$cordovaGeolocation) {


        $scope.long = "";
        $scope.lat = "";
            $scope.buyer = {};
        $scope.image = "null";
        var image = document.getElementById('myImage');
        $scope.hideImage = true;
        var ref = new Firebase("https://saylanibakraeid.firebaseio.com/").child("qurbani");

        $scope.qurbaniBuyers = $firebaseArray(ref);
        $scope.type = $stateParams.type;

        if($scope.type == 'goat'){
            $scope.buyer.hissa = '1';
        }

        $scope.order = function () {
            $scope.qurbaniBuyers.$add({
                FirstName: $scope.buyer.fname,
                LastName : $scope.buyer.lname,
                Contact : $scope.buyer.contact,
                Email : $scope.buyer.email,
                Hissa: $scope.buyer.hissa,
                Type: $scope.type,
                Image : $scope.image,
                Longitude : $scope.lat,
                Latitude : $scope.long
            })
                .then(function () {
                $scope.buyer = {};
            });

        };

        $ionicPlatform.ready(function () {



            /*$cordovaGeolocation.clearWatch(watch)
                .then(function(result) {
                    console.log(result);
                }, function (error) {
                    console.log(error);
                });*/
           /* var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true
            };*/
            $scope.startCamera = function () {
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    image.src = "data:image/jpeg;base64," + imageData;
                    $scope.image = imageData;
                    $scope.hideImage = false;
                    $scope.$apply();
                }, function(err) {
                    $ionicPopup.alert({
                        template : "Error because: " + err
                    })
                });
            }


        });

        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                $scope.lat = position.coords.latitude;
                $scope.long = position.coords.longitude;

                draMap($scope.lat, $scope.long);
            }, function (err) {
                $ionicPopup.alert({
                    template: "No Location Access!!"
                })
            });
        $scope.map = map;
        var watchOptions = {
            frequency: 1000,
            timeout: 3000,
            enableHighAccuracy: false // may cause errors if true
        };


        function draMap(lat, long){
            var myLatlng = new google.maps.LatLng(lat ,long),
                mapOptions = {
                    zoom: 15,
                    center: myLatlng
                },
                map = new google.maps.Map(document.getElementById("map"),mapOptions);

            marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                draggable:true
            });

            google.maps.event.addListener(marker, 'dragend', function(evt){
                scope.$parent.user.latitude = evt.latLng.lat();
                scope.$parent.user.longitude = evt.latLng.lng();
                scope.$apply();
            });
        }

        var watch = $cordovaGeolocation.watchPosition(watchOptions);

        watch.then(
            null,
            function(err) {
                // error
            },
            function(position) {
                var lat  = position.coords.latitude
                var long = position.coords.longitude
                draMap(lat, long);
            });

    });