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
	var distance = Math.min(get_vector_length(anchor, point), distance);
	var result = (point - anchor).normalize() * distance + anchor;

	return result;
}

function get_vector_length(a, b){
	var vector = b - a;
	var length = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
	return length;
}

// Disable scrolling on mobile devices
function onMouseDown(){}
function onMouseUp(){}