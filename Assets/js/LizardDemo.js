
// Reference for directions on unit circle
var CIRCLE_DIR = {
	LEFT : -Math.PI/2,
	RIGHT : Math.PI/2,
	UP : 0,
	DOWN : Math.PI,
}


function BodySegment (position, size) {
	this.position = position;
	this.size = size;

	this.attachments = [];

	this.angle = 0;

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

		this.position = result;

		// Update angle
		var dir = (anchor - point).normalize()
		this.angle = Math.atan2(dir.y, dir.x)

		// Update attachments
		for (var i = 0; i < this.attachments.length; i++){
			var attachment_point = this.attachments[i].point;
			var attachment_offset = this.attachments[i].offset;

			this.attachments[i].attachment.position = this.get_rotated_edge_point(attachment_point, attachment_offset);
		}
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

function SegmentChain(seg_sizes, target, render_shape) {
	this.segments = [];

	this.position = view.center;
	this.target = target || null;

	// Graphics variables used for rendering chain
	this.shapes = [];
	this.render_shape = render_shape || "CIRCLE"

	for (var i = 0; i < seg_sizes.length; i++){
		this.segments.push(new BodySegment(view.center, seg_sizes[i]));

		var shape;
		if (this.render_shape == "CIRCLE") {
			shape = new Path.Circle ({
				center: view.center,
				radius: seg_sizes[i],
				strokeColor: '#636363',
				dashArray: [10, 4],
			});
		} else if (this.render_shape == "LINE") {

			if (i == seg_sizes.length-1) { continue; }
			shape = new Path.Line({
				from: view.center,
				to: view.center,
				strokeColor: 'black',
				strokeWidth: 8,
				strokeCap: 'round'
			});
		}

		this.shapes.push(shape);
	}



	this.constrain_chain = function(){
		// If target exists, constrains to target for FABRIK constraint
		var point = this.target || this.position;
		this.segments[0].constrain_to(point, this.segments[0].size);

		for (var i = 1; i < this.segments.length; i++){
			var prev_seg = this.segments[i-1];
			this.segments[i].constrain_to(prev_seg.position, prev_seg.size);
		}

		this.update_shapes();

		// Checks for target. If a target exists, FABRIK constraint is performed, otherwise exits early
		if (!this.target) { return; }

		// Set position of last segment to anchor
		this.segments[this.segments.length-1].constrain_to(this.position);
		// Restrain every prior point to anchor (backwards)
		for (var i = this.segments.length-2; i >= 0; i--){
			var prev_seg = this.segments[i+1];
			this.segments[i].constrain_to(prev_seg.position, prev_seg.size);
		}

		this.update_shapes();
		
	}

	this.update_shapes = function(){
		for (var i = 0; i < this.shapes.length; i++) {
			if(this.render_shape == "CIRCLE") {
				this.shapes[i].position = this.segments[i].position;
			} else if (this.render_shape == "LINE"){
				//if (i == this.shapes.length-1) { continue; }

				this.shapes[i].segments[0].point = this.segments[i].position;
				this.shapes[i].segments[1].point = this.segments[i+1].position;
			}

		}
	}
}


function Creature(body, color){
	this.body = body;

	var chains = [body];
	var limbs = [];

	this.color = color || 'black';

	this.add_attachment = function(segment, attachment, point, offset){
		this.body.segments[segment].add_attachment(attachment, point, offset);

		if(attachment.constructor.name == 'SegmentChain'){
			chains.push(attachment);			
		}
	}

	this.add_limb = function(segment, attachment, point, offset, step_target, step_distance){
		this.add_attachment(segment, attachment, point, offset, step_target);

		attachment.target = step_target.position;

		limbs.push(
		{
			"attachment" : attachment,
			"step_target" : step_target,
			"step_distance" : step_distance,
		});
	}

	this.move_to = function(pos){
		body.position = pos;

		// Update segment chains
		for (var i = 0; i < chains.length; i++){
			chains[i].constrain_chain();
		}

		// Update limbs for stepping
		for (var i = 0; i < limbs.length; i++){
			var distance = limbs[i].step_distance;
			var target_pos = limbs[i].step_target.position

			if (limbs[i].attachment.target.getDistance(target_pos) > distance){
				limbs[i].attachment.target = target_pos;
			}
		}
	}

	this.set_color = function(color){
		for (var i = 0; i < chains.length; i++){
			for (var j = 0; j < chains[i].shapes.length; j++){
				chains[i].shapes[j].fillColor = color;
				chains[i].shapes[j].strokeColor = color;
			}
		}
	}
}




var lizard = new Creature(new SegmentChain(
	[4, 6, 8, 12, 8, 8, 10, 12, 14, 14, 12, 8, 8, 6, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
));

function add_arm(segment, side){
	var step_target = new Path.Circle({
		center: view.center,
		radius: 5,
		fillColor: 'red',
		visible: false,
	});
	lizard.add_attachment(segment - 3, step_target, side, 30);
	lizard.add_limb(
		segment, 
		new SegmentChain([15, 15, 15], null, 'LINE'),
		side,
		0,
		step_target,
		40
	);
}

add_arm(7, CIRCLE_DIR.RIGHT);
add_arm(7, CIRCLE_DIR.LEFT);
add_arm(11, CIRCLE_DIR.RIGHT);
add_arm(11, CIRCLE_DIR.LEFT);

lizard.set_color('green');

function onMouseMove(event){
	var mouse_pos = event.point;
	lizard.move_to(mouse_pos);
	
}

// Disable scrolling on mobile devices
function onMouseDown(){}
function onMouseUp(){}