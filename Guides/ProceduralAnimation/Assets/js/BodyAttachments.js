

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

		var distance = Math.min(point.getDistance(anchor), distance);
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

function SegmentChain(num_segments, seg_size) {
	this.segments = [];

	this.position = view.center;

	for (var i = 0; i < num_segments; i++){
		this.segments.push(new BodySegment(view.center, seg_size));
	}

	this.constrain_chain = function(point){
		point = point || this.position;
		this.segments[0].constrain_to(point, this.segments[0].size);

		for (var i = 1; i < this.segments.length; i++){
			var prev_seg = this.segments[i-1];
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

var tail = new SegmentChain(10, 10);

body.segments[0].add_attachment(nose, 0, 0)
body.segments[0].add_attachment(eye1, Math.PI/2, 4);
body.segments[0].add_attachment(eye2, Math.PI/-2, 4)
body.segments[1].add_attachment(arm1, Math.PI/2, 0);
body.segments[1].add_attachment(arm2, Math.PI/-2, 0);
body.segments[2].add_attachment(tail, Math.PI, 0);

function onMouseMove(event){
	var mouse_pos = event.point;

	body.position = mouse_pos;

	body.constrain_chain();
	arm1.constrain_chain();
	arm2.constrain_chain();
	tail.constrain_chain();

}



// Disable scrolling on mobile devices
function onMouseDown(){}
function onMouseUp(){}