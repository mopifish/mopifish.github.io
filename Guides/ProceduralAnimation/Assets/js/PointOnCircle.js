
function BodySegment (position, size) {
	this.position = position;
	this.size = size;

	this.angle = 0;

	this.circle = new Path.Circle(this.position, this.size);
	this.circle.strokeColor = '#636363';
	this.circle.dashArray= [10, 4];

	this.set_position = function(new_pos){
		this.position = new_pos;
		this.circle.position = this.position;
	}

	this.get_rotated_edge_point = function(point, offset){ 
		offset = offset || 0;

		return new Point(
			this.position.x + (offset + this.size) * Math.cos(this.angle + point), 
			this.position.y + (offset + this.size) * Math.sin(this.angle + point)
		);	
	}

	this.constrain_to = function(anchor, distance) {
		var point = this.position;

		var distance = Math.min(point.getDistance(anchor), distance);
		var result = (point - anchor).normalize() * distance + anchor;

		// Update angle
		var dir = (anchor - point).normalize()
		// dir.x is negative. The y-axis is flipped, so why do we make dir.x negative?
		this.angle = Math.atan2(dir.y, dir.x)


		this.set_position(result);
	}
}

var constraint_distance = 50;

var point_offset = 0;

var constraint = new BodySegment(view.center, constraint_distance);

var point = new Path.Circle(view.center, 10);
point.fillColor = 'black';

var dir_line = new Path.Line(view.center, view.center);
dir_line.strokeColor = 'red';

function onMouseMove(event){
	var mouse_pos = event.point;

	dir_line.segments[0].point = constraint.position;
	dir_line.segments[1].point = constraint.get_rotated_edge_point(0);

	constraint.constrain_to(mouse_pos, constraint.size);

	point.position = constraint.get_rotated_edge_point(Math.PI/2, point_offset);
}



// Disable scrolling on mobile devices
function onMouseDown(){}
function onMouseUp(){}