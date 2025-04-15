export interface Point {
	x: bigint; // Corresponds to u256 in Rust
	y: bigint; // Corresponds to u256 in Rust
};

export type BalCipherText = {
	c1: Point;
	c2: Point;
};