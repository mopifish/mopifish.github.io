var constraint_distance = 30;
var num_segments = 5;

var segments = [];
var radius_circles = [];


for (var i = 0; i < 5; i++) {
	var new_segment = new Path.Circle(view.center, 6);
	new_segment.fillColor = 'black';
	segments.push(new_segment);

	var new_radius = new Path.Circle(view.center, constraint_distance);
	new_radius.strokeColor = '#636363';
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
	var distance = Math.min(point.getDistance(anchor), distance);
	var result = (point - anchor).normalize() * distance + anchor;

	return result;
}






// --- Web Only Code

var is_points_shown = true

document.getElementById("ConstrainedChainCheckBox").addEventListener("change", function(event) {

	// This is a slightly hacky work around because
	// For some reason, I can not get the correct current value of the checkbox.........
	is_points_shown = ! is_points_shown
	for (var i = 0; i < segments.length; i++){
		segments[i].visible = is_points_shown
	}
})
// Disable scrolling on mobile devices
function onMouseDown(event){}
function onMouseUp(event){}