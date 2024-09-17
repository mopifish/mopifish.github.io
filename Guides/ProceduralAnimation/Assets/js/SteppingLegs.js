

function BodySegment (position, size) {
	this.position = position;
	this.size = size;

	this.attachments = [];

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

		distance = Math.min(point.getDistance(anchor), distance) || 0;
		var result = (point - anchor).normalize() * distance + anchor;

		this.set_position(result);

		// Update angle
		var dir = (anchor - point).normalize()
		this.angle = Math.atan2(dir.y, dir.x)

		// Update attachments
		for (var i = 0; i < this.attachments.length; i++){
			var attachment_point = this.attachments[i].point;
			var attachment_offset = this.attachments[i].offset;

			this.attachments[i].attachment.position = this.get_rotated_edge_point(attachment_point, attachment_offset);
		}

		// Update positions
		this.set_position(this.position);
	}

	this.add_attachment = function(attachment, point, offset){
		var dict = {
			attachment: attachment,
			point: point,
			offset: offset,
		};

		this.attachments.push(dict);
	}
}

function SegmentChain(num_segments, seg_size, target) {
	this.segments = [];

	this.position = view.center;

	this.target = target || null;

	for (var i = 0; i < num_segments; i++){
		this.segments.push(new BodySegment(view.center, seg_size));
	}

	this.constrain_chain = function(){
		// If target exists, constrains to target for FABRIK constraint
		var point = this.target || this.position;
		this.segments[0].constrain_to(point, this.segments[0].size);

		for (var i = 1; i < this.segments.length; i++){
			var prev_seg = this.segments[i-1];
			this.segments[i].constrain_to(prev_seg.position, prev_seg.size);
		}


		// Checks for target. If a target exists, FABRIK constraint is performed, otherwise exits early
		if (!this.target) { return; }

		// Set position of last segment to anchor
		this.segments[this.segments.length-1].constrain_to(this.position);

		// Restrain every prior point to anchor (backwards)
		for (var i = this.segments.length-2; i >= 0; i--){
			var prev_seg = this.segments[i+1];
			this.segments[i].constrain_to(prev_seg.position, prev_seg.size);
		}

	}
}

var body = new SegmentChain(3, 25);

var nose = new Path.Circle({
	center: view.center,
	radius: 10,
	fillColor: 'red',
});
var eye1 = new Path.Circle({
	center: view.center,
	radius: 7,
	fillColor: 'black',
});
var eye2 = new Path.Circle({
	center: view.center,
	radius: 7,
	fillColor: 'black',
});

var arm1 = new SegmentChain(5, 10);
var arm2 = new SegmentChain(5, 10);

var step_target1 = new Path.Circle({
	center: view.center,
	radius: 10,
	fillColor: 'red',
	visible: false,
});
var step_target2 = new Path.Circle({
	center: view.center,
	radius: 10,
	fillColor: 'red',
	visible: false,
});

body.segments[0].add_attachment(nose, 0, 0)
body.segments[0].add_attachment(eye1, Math.PI/2, 4);
body.segments[0].add_attachment(eye2, Math.PI/-2, 4)
body.segments[1].add_attachment(arm1, Math.PI/2, 0);
body.segments[1].add_attachment(arm2, Math.PI/-2, 0);
body.segments[0].add_attachment(step_target1, Math.PI/2, 40);
body.segments[0].add_attachment(step_target2, Math.PI/-2, 40);

var step_distance = 100;

arm1.target = step_target1.position;
arm2.target = step_target2.position;

function onMouseMove(event){
	var mouse_pos = event.point;

	body.position = mouse_pos;

	if (arm1.target.getDistance(step_target1.position) > step_distance) {
		arm1.target = step_target1.position;
	}
	if (arm2.target.getDistance(step_target2.position) > step_distance) {
		arm2.target = step_target2.position;
	}

	body.constrain_chain();
	arm1.constrain_chain();
	arm2.constrain_chain();

}



// Disable scrolling on mobile devices
function onMouseDown(){
	step_target1.visible = true;
	step_target2.visible = true;
}
function onMouseUp(){
	step_target1.visible = false;
	step_target2.visible = false;
}