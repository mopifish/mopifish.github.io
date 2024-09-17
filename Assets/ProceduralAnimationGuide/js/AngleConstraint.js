

var constraint_distance = 30;
var constraint_angle = 30 * (Math.PI/180);

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

var mouse_pos;
function onMouseMove(event){
	mouse_pos = event.point;
	if (!is_manual){
		constrain_chain();
	}
}

function onMouseDown(event){
	if (is_manual){
		constrain_chain();
	}
}

function constrain_point(point, anchor, distance) {
	var result = (point - anchor).normalize() * distance + anchor;

	return result;
}

function constrain_angle(point1, anchor, point2, constraint){
	// // Turn our points into two opposing vectors
	// var vec1 = (anchor - point1).normalize();
	// var vec2 = (anchor - point2).normalize();

	// // Use dot product to get angle between
	// var theta = Math.acos((vec1.x * vec2.x) + (vec1.y * vec2.y));

	// // Get angle between vec1 and x-axis
	// var axis_angle = Math.atan2(vec1.y, vec1.x);

	// // Constrain angle
	// if (theta < constraint) {
	// 	theta = constraint;
	// }

	// console.log((theta) * 180/Math.PI);
	// // Get final vector (normalized)
	// var vec_final = new Point(Math.cos(theta + axis_angle), Math.sin(theta + axis_angle));

	// // Return final vector 
	// return anchor + (vec_final * point1.getDistance(anchor));
}

function constrain_chain(){	

	// Set position of first segment to follow mouse
	segments[0].position = mouse_pos;

	// Constrain subsequent points to segment 0 (forwards)
	for (var i = 1; i < segments.length; i++){
		var point = segments[i];
		var constraint = segments[i-1];

		point.position = constrain_point(point.position, constraint.position, constraint_distance);
	}

	// Constrain angles. Simple distance constraint?? Does this really work??
	for (var i = 2; i < segments.length; i++){
		var point1 = segments[i].position;
		var point2 = segments[i-2].position;
		var distance = point1.getDistance(point2);

		console.log(distance);
		if (distance < 50) {
			segments[i].position = (point1 - point2).normalize() * Math.max(distance, 50) + point2;
		}
	}	


	// // Set position of last segment to anchor
	// segments[segments.length-1].position = view.center;

	// // Restrain every prior point to anchor (backwards)
	// for (var i = segments.length-2; i >= 0; i--){
	// 	var point = segments[i];
	// 	var constraint = segments[i+1];

	// 	point.position = constrain_point(point.position, constraint.position, constraint_distance);
	// }


	// Update position of visual aides
	for (var i = 0; i < segments.length-1; i++){
		var point = segments[i];
		var constraint = segments[i+1];

		radius_circles[i].position = point.position;

		lines[i].segments[0].point = point.position;
		lines[i].segments[1].point = constraint.position;
	}
}



// --- Web Only Code
var is_circles_visible = false;
var is_manual = false;
document.getElementById("FABRIKChainCheckBox").addEventListener("change", function(event) {

	// This is a slightly hacky work around because
	// For some reason, I can not get the correct current value of the checkbox.........
	is_circles_visible = ! is_circles_visible;
	for (var i = 0; i < radius_circles.length; i++){
		radius_circles[i].visible = is_circles_visible;
	}
})
document.getElementById("FABRIKChainManualCheckBox").addEventListener("change", function(event) {

	// This is a slightly hacky work around because
	// For some reason, I can not get the correct current value of the checkbox.........
	is_manual = ! is_manual;
})
function onMouseUp(event){}
