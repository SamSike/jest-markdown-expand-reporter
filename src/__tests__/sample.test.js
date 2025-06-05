describe("Sample", () => {
	it("should pass", () => {
		expect(1 + 1).toBe(2);
	});

	it("should fail", () => {
		expect(1 + 1).toBe(3);
	});

	it.skip("should skip", () => {
		expect(1 + 1).toBe(2);
	});
});
