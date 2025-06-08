jest.setTimeout(15000); // 15 seconds

describe('Long Test', () => {
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  it('should take a long time', async () => {
    console.log('This test takes a long time');
    const start = Date.now();
    await sleep(3000); // Simulate a 3 second sleep
    console.log('Finished sleeping');
    expect(true).toBe(true);
  });
});
