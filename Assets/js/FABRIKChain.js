

var constraint_distance = 30;

var num_segments = 5;

var segments = [];
var radius_circles = [];
var lines = [];


for (var i = 0; i < 5; i++) {
	// Create segments of chain
	var new_segment = new Path.Circle(view.center, 6);
	new_segment.fillColor = 'black';
	segments.push(new_segment);


	// Create visual aids (constraint visual, connecting line)
	var new_radius = new Path.Circle(view.center, constraint_distance);
	new_radius.strokeColor = '#636363';
	new_radius.dashArray = [10, 4];
	radius_circles.push(new_radius);
	new_radius.visible = false;

	var line = new Path.Line(view.center, view.center);
	line.strokeColor = 'black';
	lines.push(line);
}

function onMouseMove(event){
	var mouse_pos = event.point;

	// Set position of first segment to follow mouse
	segments[0].position = mouse_pos;

	// Constrain subsequent points to segment 0 (forwards)
	for (var i = 1; i < segments.length; i++){
		var point = segments[i];
		var constraint = segments[i-1];

		point.position = constrain_point(point.position, constraint.position, constraint_distance);
	}

	// Set position of last segment to anchor
	segments[segments.length-1].position = view.center;

	// Restrain every prior point to anchor (backwards)
	for (var i = segments.length-2; i >= 0; i--){
		var point = segments[i];
		var constraint = segments[i+1];

		point.position = constrain_point(point.position, constraint.position, constraint_distance);
	}


	// Update position of visual aides
	for (var i = 0; i < segments.length-1; i++){
		var point = segments[i];
		var constraint = segments[i+1];

		radius_circles[i].position = point.position;

		lines[i].segments[0].point = point.position;
		lines[i].segments[1].point = constraint.position;
	}
}

function constrain_point(point, anchor, distance) {
	var result = (point - anchor).normalize() * distance + anchor;

	return result;
}




// --- Web Only Code
var is_circles_visible = false;
document.getElementById("FABRIKChainCheckBox").addEventListener("change", function(event) {

	// This is a slightly hacky work around because
	// For some reason, I can not get the correct current value of the checkbox.........
	is_circles_visible = ! is_circles_visible;
	for (var i = 0; i < radius_circles.length; i++){
		radius_circles[i].visible = is_circles_visible;
	}
})
function onMouseDown(event){}
function onMouseUp(event){}
