const LAYOUT = {
	2: [0, 1],
	3: [0, 4, 5]
	4: [0, 2, 1, 3],
};

const POSITIONS = [
	{x: 0.5, y: 0.9}, // center bottom
	{x: 0.5, y: 0.1}, // center top
	{x: 0.1, y: 0.5}, // left center
	{x: 0.9, y: 0.5}, // right center
	{x: 0.25, y: 0.1}, // left-offset top
	{x: 0.75, y: 0.1}, // right-offset top
]

function getSeatPosition(seats, seat, local) {
	return POSITIONS[LAYOUT[seats][(local + seat) % seats]];
}

getSeatPosition(4, 0, 3); // return local
