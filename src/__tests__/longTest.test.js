jest.setTimeout(15000); // 15 seconds

describe("Long Test", () => {
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	it("should take a long time", async () => {
		console.log("This test takes a long time");
		const start = Date.now();
		await sleep(3000); // Simulate a 3 second sleep
		expect(true).toBe(true);
	});
});
