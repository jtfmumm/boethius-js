var parameters = {
	bpm: 120
};

function calculateNoteDuration(noteValue) {
	var measureDur = 4 / (parameters.bpm / 60);
	return noteValue * measureDur;
}


function Note(name, duration, velocity) {
	this.name = name;
	this.duration = duration; //1 for whole, 0.5 half, 0.25 quarter, etc.
	this.velocity = velocity || 100;
}
Note.prototype.display = function() {
	return this.name;
};
Note.prototype.getFreq = function(freqTable) {
	var freqTable = freqTable || equalFreqTable; 
	return freqTable[this.name];
};
Note.prototype.getVelocity = function() {
	return this.velocity;
};
Note.prototype.getDuration = function() {
	return calculateNoteDuration(this.duration);
};

function Chord() {}


function Scheduler(tempo) {
	this.tempo = tempo;
};
Scheduler.prototype.scheduleNote = function(note, channel, ticks) {};
Scheduler.prototype.scheduleChord = function(chord, channel, ticks) {};

function WebAudioScheduler(tempo) {
	Scheduler.call(this);
 	this.ctx = new webkitAudioContext();
}
WebAudioScheduler.prototype = Object.create(Scheduler.prototype);
WebAudioScheduler.prototype.scheduleNote = function(note, channelNumber, ticks) {
	webAudio.channels[channelNumber].play(note, ticks);
};


function generateEqualFreqTable(toneNames, octaves, startingFreq, halfStep) {
	var freqTable = {};
	var currentFreq = startingFreq / halfStep;
	for (var i = 0; i < octaves; i++) {
		for (var j = 0; j < toneNames.length; j++) {
			var thisNote = "" + toneNames[j] + i;
			currentFreq *= halfStep;
			freqTable[thisNote] = currentFreq;
			if (/\#$/.test(toneNames[j])) {
				thisNote = toneNames[j + 1] + "b" + i; //e.g. C# replaced by Db
				freqTable[thisNote] = currentFreq;
			}
		}
	}
	console.log(freqTable);
	return freqTable;
}

var twelveTones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

//C0 = 16.352hz
var equalFreqTable = generateEqualFreqTable(twelveTones, 7, 16.352, Math.pow(2, 1/12));
