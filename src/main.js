import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const DEFAULTS = Object.freeze({
    sound1  :  "media/TownTheme.mp3",
});

const drawParams = {
  showGradient  :  true,
  showBars      :  true,
  showCircles   :  true,
  showNoise     :  false,
  showInvert    : false,
  showEmboss    : false,
  showRipples   : true
};
//use scales to move leaves back and forth over ripples
const controllerObject = {

    _track      :  "./media/TownTheme.mp3",
    _playing    :  "no",
    _showRipples:  true,
    _volume     :  50,
    _sensitivity:  170,

    set track(value){
        audio.loadSoundFile(value);
        this._track = value;
    },

    get track(){
        return this._track;
    },

    set showRipples(value){
        this._showRipples = value;
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

    play(){
        this._playing = playOrPause(this._playing);
    },

    fullscreen(){
        Fullscreen();
    },

}

// function setupUI(canvasElement)
// {    
//     const gui = new dat.GUI({width : 400});
//     gui.close();
//     gui.add(controllerObject, 'playing').name("Play");
// }
let canvasElement, rippleCanvas;
function init(){
  audio.setupWebaudio(DEFAULTS.sound1);
  canvasElement = document.querySelector("canvas"); 
  rippleCanvas = document.querySelector("#ripples");// hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, rippleCanvas, audio.analyserNode);
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
    utils.goFullscreen(canvasElement, rippleCanvas);
}

function setupUI(canvasElement){
  // A - hookup fullscreen button

    const gui = new dat.GUI({width : 400});
    gui.close();
    gui.add(controllerObject, 'play').name("Play");

    gui.add(controllerObject, 'track', ["./media/TownTheme.mp3", "media/Peanuts Theme.mp3", "media/The Picard Song.mp3", "media/New Adventure Theme.mp3"]).name("Track Select");

    gui.add(controllerObject, 'fullscreen').name("Full Screen");
    gui.add(controllerObject, 'volume', 0, 100).name("Volume");
    gui.add(controllerObject, 'sensitivity', 100, 250).name("Sensitivity");

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
  canvas.draw(drawParams, controllerObject._sensitivity);

}

export{init};