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

    _track      :  DEFAULTS.sound1,
    _playing    :  "no",
    _showRipples:  true,
    _volume     :  50,

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
        audio.setVolume(this._volume/50);
    },

    get volume(){
        return this._volume;
    },

    play(){
        this._playing = playOrPause(this._playing);
    },

    fullscreen(){
        utils.goFullscreen(canvasElement);
    },

}

// function setupUI(canvasElement)
// {    
//     const gui = new dat.GUI({width : 400});
//     gui.close();
//     gui.add(controllerObject, 'playing').name("Play");
// }
let canvasElement;
function init(){
  audio.setupWebaudio(DEFAULTS.sound1);
  canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
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
function goFullscreen(){
    utils.goFullscreen(canvasElement);
}

function setupUI(canvasElement){
  // A - hookup fullscreen button

    const gui = new dat.GUI({width : 400});
    gui.close();
    gui.add(controllerObject, 'play').name("Play");

    gui.add(controllerObject, 'track', ["./media/TownTheme.mp3", "media/Peanuts Theme.mp3", "media/The Picard Song.mp3"]).name("Track Select");

    gui.add(controllerObject, 'fullscreen').name("Full Screen");
    gui.add(controllerObject, 'volume', 0, 100).name("Volume");

  let gradientCB = document.querySelector("#gradientCB");
  let barsCB = document.querySelector("#barsCB");
  let circlesCB = document.querySelector("#circlesCB");
  let noiseCB = document.querySelector("#noiseCB");
  let invertCB = document.querySelector("#invertCB");
  let embossCB = document.querySelector("#embossCB");

  gradientCB.checked = true;
  barsCB.checked = true;
  circlesCB.checked = true;
  noiseCB.checked = true;

  gradientCB.onchange = e => {
    drawParams.showGradient = gradientCB.checked;
  }

  barsCB.onchange = e => {
    drawParams.showBars = barsCB.checked;
  }

  circlesCB.onchange = e => {
    drawParams.showCircles = circlesCB.checked;
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
  canvas.draw(drawParams);



}

export{init};