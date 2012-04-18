$(document).ready(function() {
  $("#map").css({
		height: 500,
		width: 600
	});
	var myLatLng = new google.maps.LatLng(40.714623, -74.006605);
  MYMAP.init('#map', myLatLng, 11);
  
  $("#showmarkers").click(function(e){
		MYMAP.placeMarkers('markers.xml');
  });
});

var MYMAP = {
  map: null,
	bounds: null
}

MYMAP.init = function(selector, latLng, zoom) {
  var myOptions = {
    zoom:zoom,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  this.map = new google.maps.Map($(selector)[0], myOptions);
	this.bounds = new google.maps.LatLngBounds();
}

MYMAP.placeMarkers = function(filename) {
	$.ajax(
		{
		     	url: 'http://api.groupon.com/v2/deals.json',
	        dataType: 'jsonp',
          data:
          {
           client_id: '7dd6695c43abb73bd81f14bf26d427e4e4990cf5', 
           lat: '40.714623', 
           lng: '-74.006605', 
           radius: '20', 
           show: 'division,title,smallImageUrl'
          },
		     success: function(json){
						$.each(json.deals, function(i, item){
			var name = item.id;//$(this).find('name').text();
			var address = item.division.name;//$(this).find('address').text();
			
			// create a new LatLng point for the marker
			var lat = item.division.lat;//$(this).find('lat').text();
			var lng = item.division.lng;//$(this).find('lng').text();
			var point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
			
			// console.log("index : " + i);
			// 			console.log("address : " + address);
			// 			console.log("lat : " + lat);
			// 			console.log("lng : " + lng);
			// 			console.log("name : " + name);
			
			// extend the bounds to include the new point
			MYMAP.bounds.extend(point);
			
			var marker = new google.maps.Marker({
				position: point,
				map: MYMAP.map
			});
			
			var infoWindow = new google.maps.InfoWindow();
			var html='<strong>'+name+'</strong.><br />'+address;
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.setContent(html);
				infoWindow.open(MYMAP.map, marker);
			});
			MYMAP.map.fitBounds(MYMAP.bounds);
		});
				 }
	});
}