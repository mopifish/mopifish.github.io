// Custom Vector2 class made for easier vector math in JS
// mopifish.github.io

class Vector2{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	length(){
	// Returns length, or magnitude, of this vector
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}

	normalized(){
	// Returns this vector normalized (On a scale of 1)
		var length = this.length();
		return Vector2(this.x/length, this.y/length);
	}

	distance_to(other){
	// Returns integer distance between this vector and other
		return this.subtract(other).length();
	}

	direction_to(other){
		return this.subtract(other).normalized();
	}

	add(other){
	// Returns the sum of this vector and other
		return Vector2(this.x + other.x, this.y + other.y);
	}

	subtract(other){
	// Returns the difference between this vector and other
		return Vector2(this.x - other.x, this.y - other.y);
	}

	multiply(int){
	// Returns the product of this vector and a given integer
		return Vector2(this.x * int, this.y * int);
	}

	divide(int){
	// Returns the dividend of this vector and a given integer
		return Vector2(this.x/int, this.y/int);
	}
}