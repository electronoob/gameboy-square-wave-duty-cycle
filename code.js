// I had this on a jsfiddle and decided to move to github for safe keeping

// gameboy duty cycle

/*
Duty   Waveform    Ratio
-------------------------
0      00000001    12.5%
1      10000001    25%
2      10000111    50%
3      01111110    75%
*/
var duty = [
	0b00000001,
  0b10000001,
  0b10000111,
  0b01111110
];
var notes = { /*https://gist.github.com/i-Robi/8684800#gistcomment-3024411*/
    "C": 	 [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01],
   "Db":   [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
    "D":   [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
   "Eb":   [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
    "E":   [20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
    "F":   [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
   "Gb":   [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96],
    "G":   [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96],
   "Ab":   [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44],
    "A":   [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00],
   "Bb":   [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
    "B":   [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07]
 };
var frequency = notes["A"][2];
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var sr = audioCtx.sampleRate;
var myArrayBuffer = audioCtx.createBuffer(1/*channels*/,
																					sr * duty.length   /*frames*/,
                                          sr);
var nowBuffering = myArrayBuffer.getChannelData(0);
var delay = sr / 8 / frequency;
for (var d = 0; d < duty.length; d++) {
  for (var i = 0; i < audioCtx.sampleRate; i++) {
    let t = i/delay;
    let pwm = (duty[d] >> t % 8) & 1;
    nowBuffering[d * sr + i] = pwm*0.1;
  }
}
var source = audioCtx.createBufferSource();
source.buffer = myArrayBuffer;
source.connect(audioCtx.destination);
source.start()
