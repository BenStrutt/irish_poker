function transformPoint(x, y, domMatrix) {
	return {
		x: x * domMatrix.a + y * domMatrix.c + domMatrix.e,
		y: x * domMatrix.b + y * domMatrix.d + domMatrix.f,
	};
}
