describe("Notes", function() {
	var note = new Note('A4', 1/4);

	it("can be displayed", function() {
		expect(note.display()).toBe("A4"); 
	});

	it("have a default velocity of 100", function() {
		expect(note.velocity).toBe(100); 
	});
});
