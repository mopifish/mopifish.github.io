var constraint_distance = 50

var constraint = new Path.Circle(view.center, constraint_distance);
constraint.strokeColor = '#636363';
constraint.dashArray = [10, 4];

var point = new Path.Circle(view.center, 10);
point.fillColor = 'black';


function onMouseMove(event){
	var mouse_pos = event.point;

	constraint.position = mouse_pos;

	point.position = constrain_point(point.position, constraint.position, constraint_distance);
}

function constrain_point(point, anchor, distance) {
	if (allow_point_inside){
		distance = Math.min(distance, get_vector_length(anchor, point));
	}
	var result = (point - anchor).normalize() * distance + anchor;

	return result;
}

function get_vector_length(a, b){
	var vector = b - a;
	var length = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
	return length;
}

// --- Web Only Code
var allow_point_inside = false
document.getElementById("ConstrainedPointCheckBox").addEventListener("change", function(event) {
	allow_point_inside = ! allow_point_inside
})

// Disable scrolling on mobile devices
function onMouseDown(){}
function onMouseUp(){}