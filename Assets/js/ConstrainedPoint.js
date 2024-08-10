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
	var distance = Math.min(point.getDistance(anchor), distance);
	var result = (point - anchor).normalize() * distance + anchor;

	return result;
}