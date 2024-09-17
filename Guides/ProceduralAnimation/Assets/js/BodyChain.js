

var constraint_distance = 10;
var segment_sizes = [15, 16, 20, 24, 22, 15, 15, 15, 15, 15, 15, 15, 16, 17, 17, 18, 18, 18, 19, 19, 19, 19, 19, 18, 18, 18, 18, 17, 17, 16, 16, 15, 15, 15, 14, 14, 14, 13, 13, 13, 12, 12, 12, 11, 11, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
var num_segments = segment_sizes.length;

var segments = [];
var radius_circles = [];


for (var i = 0; i < num_segments; i++) {
	// Create points
	var new_segment = new Path.Circle(view.center, 3);
	segments.push(new_segment);

	// Create body segments (overlap points)
	var new_radius = new Path.Circle(view.center, segment_sizes[i]);
	new_radius.fillColor = '#636363';
	new_radius.dashArray = [10, 4];
	radius_circles.push(new_radius);
}

function onMouseMove(event){
	var mouse_pos = event.point;

	segments[0].position = mouse_pos;
	radius_circles[0].position = mouse_pos;

	for (var i = 1; i < segments.length; i++){
		var point = segments[i];
		var constraint = segments[i-1];

		point.position = constrain_point(point.position, constraint.position, constraint_distance);

		radius_circles[i].position = point.position;
	}
	
}

function constrain_point(point, anchor, distance) {
	var result = (point - anchor).normalize() * distance + anchor;

	return result;
}






// --- Web Only Code

var is_circles_transparent = false
var is_points_shown = false
document.getElementById("BodyChainTransparency").addEventListener("change", function(event) {

	// This is a slightly hacky work around because
	// For some reason, I can not get the correct current value of the checkbox.........
	is_circles_transparent = ! is_circles_transparent;
	for (var i = 0; i < radius_circles.length; i++){
		if (is_circles_transparent){
			radius_circles[i].fillColor = 'transparent';
			radius_circles[i].strokeColor = '#636363';
		} else {
			radius_circles[i].fillColor = '#636363';
			radius_circles[i].strokeColor = 'transparent';
		}
	}
})
document.getElementById("BodyChainPoints").addEventListener("change", function(event) {

	// This is a slightly hacky work around because
	// For some reason, I can not get the correct current value of the checkbox.........
	is_points_shown = ! is_points_shown;
	for (var i = 0; i < segments.length; i++){
		if (is_points_shown){
			segments[i].fillColor = 'black';
		} else {
			segments[i].fillColor = 'transparent';
		}
	}
})
// Disable scrolling on mobile devices
function onMouseDown(){}
function onMouseUp(){}