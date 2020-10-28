import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const DEFAULTS = Object.freeze({
    sound1  :  "media/TownTheme.mp3",
});

const drawParams = {
  showGradient  :  true,
  showCircle    :  true,
  showNoise     :  false,
  showInvert    : false,
  showEmboss    : false,
  showRipples   : true
};
//use scales to move leaves back and forth over ripples
const controllerObject = {

    _track       :  "media/TownTheme.mp3",
    _playing     :  "no",
    _showRipples :  true,
    _showCircle  :  true,
    _volume      :  50,
    _sensitivity :  150,
    _threshold   :  130,
    _showGradient:  true,
    _showNoise   :  false,
    _showInvert  :  false, 
    _showEmboss  :  false,

    set track(value){
        audio.loadSoundFile(value);
        this._track = value;
    },

    get track(){
        return this._track;
    },

    play(){
        this._playing = playOrPause(this._playing);
    },

    set showRipples(value){
        this._showRipples = value;
        drawParams.showRipples = value;
    },

    get showRipples(){
      return this._showRipples;
    },

    set showCircle(value){
      this._showCircle = value;
      drawParams.showCircle = value;
    },

    get showCircle(){
      return this._showCircle;
    },
    
    set volume(value){
        this._volume = value;
        audio.setVolume(this._volume/100);
    },

    get volume(){
        return this._volume;
    },

    set sensitivity(value){
      this._sensitivity = value;
    },

    get sensitivity(){
      return this._sensitivity;
    },

    set threshold(value){
      this._threshold = value;
    },

    get threshold(){
      return this._threshold;
    },

    set showGradient(value){
      this._showGradient = value;
      drawParams.showGradient = value;
    },

    get showGradient(){
      return this._showGradient;
    },

    set showNoise(value){
      this._showNoise = value;
      drawParams.showNoise = value;
    },

    get showNoise(){
      return this._showNoise;
    },
    set showInvert(value){
      this._showInvert = value;
      drawParams.showInvert = value;
    },

    get showInvert(){
      return this._showInvert;
    },

    set showEmboss(value){
      this._showEmboss = value;
      drawParams.showEmboss = value;
    },

    get showEmboss(){
      return this._showEmboss;
    },

    fullscreen(){
        Fullscreen();
    },

}

const rippleSource = {
  frequencyR : true, 
  timeDomainR: false,
}
const circleSource = {
  timeDomianC: true,
  frequencyC : false, 
}

let canvasElement, rippleCanvas;
let timeDisplay;
function init(){
  audio.setupWebaudio(DEFAULTS.sound1);
  canvasElement = document.querySelector("canvas"); 
  rippleCanvas = document.querySelector("#ripples");// hookup <canvas> element
  setupUI();
  canvas.setupCanvas(canvasElement, rippleCanvas, audio.analyserNode);
  //window.addEventListener('resize', canvas.resize, false);
  loop();
}

function playOrPause(playing) {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    if(audio.audioCtx.state == "suspended"){
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if(playing == "no"){
      audio.playCurrentSound();
      playing = "yes";
    }
    else{
      audio.pauseCurrentSound();
      playing = "no";
    }
    return playing;
  }
function Fullscreen(){
    utils.goFullscreen(canvasElement);
}

function radioButton(params, checked)
{
  for (let param in params){
    params[param] = false;
  }
  params[checked] = true;
}

function setupUI(){
  // A - hookup fullscreen button

    const gui = new dat.GUI({width : 400});
    gui.close();
    gui.add(controllerObject, 'play').name("Play");

    gui.add(controllerObject, 'track', ["media/TownTheme.mp3", "media/beat.mp3",  "media/Peanuts Theme.mp3", "media/The Picard Song.mp3", "media/New Adventure Theme.mp3"]).name("Track Select");

    gui.add(controllerObject, 'fullscreen').name("Full Screen");
    gui.add(controllerObject, 'volume', 0, 100).name("Volume");
    let ripples = gui.addFolder("Ripples");
    ripples.add(controllerObject, 'showRipples').name("Show Ripples");
    ripples.add(controllerObject, 'sensitivity', 100, 250).name("Ripple Sensitivity");
    ripples.add(rippleSource, 'frequencyR').name("Use Frequency: ").listen().onChange(function(){radioButton(rippleSource, "frequencyR")});
    ripples.add(rippleSource, 'timeDomainR').name("Use Time Domain: ").listen().onChange(function(){radioButton(rippleSource, "timeDomainR")});
    let circle = gui.addFolder("Circle");
    circle.add(controllerObject, 'showCircle').name("Show Circle");
    circle.add(controllerObject, 'threshold', 50, 200).name("Circle Sensitivity");
    circle.add(circleSource, 'timeDomianC').name("Use Time Domain: ").listen().onChange(function(){radioButton(circleSource, "timeDomianC")});
    circle.add(circleSource, 'frequencyC').name("Use Frequency: ").listen().onChange(function(){radioButton(circleSource, "frequencyC")});
    let extras = gui.addFolder("Extras");
    extras.add(controllerObject, "showGradient").name("Show Gradient");
    extras.add(controllerObject, "showNoise").name("Show Noise");
    extras.add(controllerObject, "showInvert").name("Invert Colors");
    extras.add(controllerObject, "showEmboss").name("Show Emboss");

    timeDisplay = document.querySelector("#time-display");
    timeDisplay.innerHTML = audio.getProgress() + "%";

    //timeDisplay.

} // end setupUI

function loop(){
  requestAnimationFrame(loop);
  canvas.draw(drawParams, controllerObject._sensitivity, controllerObject._threshold);
  timeDisplay.innerHTML = audio.getProgress() + "%";
}

export{init};