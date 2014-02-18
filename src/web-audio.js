var webAudio = (function() {

    var ctx = new webkitAudioContext();

    var channels = {};

    function Osc(parameters) {
    	this.osc = ctx.createOscillator;
        this.node = this.osc;
    	this.osc.type = parameters.type; //e.g. 'square'
    }
    Osc.play = function(freq, ticks) {
    	this.osc.frequency.value = freq;
        this.osc.start(ticks);
    };
    Osc.connect = function(target) {
        this.osc.connect(target);
    };

    function Envelope(parameters) {
        this.attack = parameters.attack || 0;
        this.decay = parameters.decay || 0;
        this.sustain = parameters.sustain || 0;
        this.release = parameters.release || 0;
        this.node = ctx.createGain();
        this.gain = this.node.gain;
    }
    Envelope.prototype.filter = function(startTime, dur, amp) {
        this.gain.value = 0;
        this.gain.linearRampToValueAtTime(0, startTime); //Attack
        this.gain.linearRampToValueAtTime(amp, startTime + this.attack); //Attack
        this.gain.linearRampToValueAtTime(amp, startTime + dur + this.attack); //Sustain
        this.gain.linearRampToValueAtTime(0.0, startTime + dur + this.attack + this.release); //Release       
    };

    function Instrument(parameters) {
        this.osc = new Osc(parameters.osc);
        this.envelope = new Envelope(parameters.envelope);
        osc.node.connect(envelope.node);
        envelope.node.connect(ctx.destination);
    }
    Instrument.prototype.play = function(note, ticks) {
        this.osc.play(note.getFreq(), ticks);
        this.envelope.filter(ticks, note.getDuration(), note.getVelocity());
    };

    function assignChannel(channelNumber, instrument) {
        channels[channelNumber] = instrument;
    }

    var wa = {
        channels: channels,
        assignChannel: assignChannel,
        Instrument: Instrument,
        Envelope: Envelope,
        Osc: Osc
    };

    return wa;
})();

/*
Instrument Parameters: {
    osc: {
        type: 'square'
    }
    envelope: {
        attack: ,
        decay: ,
        sustain: ,
        release:
    }
}
*/


