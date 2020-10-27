import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const DEFAULTS = Object.freeze({
    sound1  :  "media/TownTheme.mp3",
});

const drawParams = {
  showGradient  :  true,
  showCircle   :  true,
  showNoise     :  false,
  showInvert    : false,
  showEmboss    : false,
  showRipples   : true
};
//use scales to move leaves back and forth over ripples
const controllerObject = {

    _track       :  "./media/TownTheme.mp3",
    _playing     :  "no",
    _showRipples :  true,
    _showCircle  :  true,
    _volume      :  50,
    _sensitivity :  180,
    _threshold   :  130,
    _showGradient:  false,
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




    fullscreen(){
        Fullscreen();
    },

}

let canvasElement, rippleCanvas;
function init(){
  audio.setupWebaudio(DEFAULTS.sound1);
  canvasElement = document.querySelector("canvas"); 
  rippleCanvas = document.querySelector("#ripples");// hookup <canvas> element
  setupUI();
  canvas.setupCanvas(canvasElement, rippleCanvas, audio.analyserNode);
  window.addEventListener('resize', canvas.resize, false);
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

function setupUI(){
  // A - hookup fullscreen button

    const gui = new dat.GUI({width : 400});
    gui.close();
    gui.add(controllerObject, 'play').name("Play");

    gui.add(controllerObject, 'track', ["./media/TownTheme.mp3", "media/Peanuts Theme.mp3", "media/The Picard Song.mp3", "media/New Adventure Theme.mp3"]).name("Track Select");

    gui.add(controllerObject, 'fullscreen').name("Full Screen");
    gui.add(controllerObject, 'volume', 0, 100).name("Volume");
    gui.add(controllerObject, 'showRipples').name("Show Ripples");
    gui.add(controllerObject, 'sensitivity', 100, 250).name("Ripple Sensitivity");
    gui.add(controllerObject, 'showCircle').name("Show Circle");
    gui.add(controllerObject, 'threshold', 50, 200).name("Circle Sensitivity");

  let gradientCB = document.querySelector("#gradientCB");
  let noiseCB = document.querySelector("#noiseCB");
  let invertCB = document.querySelector("#invertCB");
  let embossCB = document.querySelector("#embossCB");

  gradientCB.checked = true;
  noiseCB.checked = false;

  gradientCB.onchange = e => {
    drawParams.showGradient = gradientCB.checked;
  }

  noiseCB.onchange = e => {
    drawParams.showNoise = noiseCB.checked;
  }
  invertCB.onchange = e =>{
    drawParams.showInvert = invertCB.checked;
  }
  embossCB.onchange = e => {
    drawParams.showEmboss = embossCB.checked;
  }

} // end setupUI

function loop(){
  requestAnimationFrame(loop);
  canvas.draw(drawParams, controllerObject._sensitivity, controllerObject._threshold);

}

export{init};