// There's something funky going on with this.

const LAYOUT = {
	1: [0],
	2: [0, 3],
	3: [0, 4, 5],
	4: [1, 4, 5, 2],
	5: [0, 7, 4, 5, 9],
	6: [0, 1, 4, 3, 5, 2],
	7: [1, 6, 4, 3, 5, 8, 2],
	8: [1, 7, 6, 4, 5, 8, 9, 2],
	9: [1, 7, 6, 4, 3, 5, 8, 9, 2],
	10: [0, 1, 7, 6, 5, 3, 5, 8, 9, 2],
};

const POSITIONS = [
	{x: 0.5, y: 0.85}, // bottom center 0
	{x: 0.25, y: 0.85}, // bottom left 1
	{x: 0.75, y: 0.85}, // bottom right 2
	{x: 0.5, y: 0.15}, // top center 3
	{x: 0.25, y: 0.15}, // top left 4
	{x: 0.75, y: 0.15}, // top right 5
	{x: 0.1, y: 0.25}, // left upper 6
	{x: 0.1, y: 0.75}, // left lower 7
	{x: 0.9, y: 0.25}, // right upper 8
	{x: 0.9, y: 0.75}, // right lower 9
];

function getSeatPosition(seat, seats) {
	return POSITIONS[LAYOUT[seats][seat]];
}
