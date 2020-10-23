// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
  };
  
  const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  
  const getRandomColor = () => {
      const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor,255-floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
  };
  
  const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
    let lg = ctx.createLinearGradient(startX,startY,endX,endY);
    for(let stop of colorStops){
      lg.addColorStop(stop.percent,stop.color);
    }
    return lg;
  };
  
  
  const goFullscreen = (element, element2) => {
      if (element.requestFullscreen) {
          element.requestFullscreen();
          element2.requestFullscreen();
      } else if (element.mozRequestFullscreen) {
          element.mozRequestFullscreen();
          element2.mozRequestFullscreen();
      } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
          element.mozRequestFullScreen();
          element2.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
          element2.webkitRequestFullscreen();
      }
      // .. and do nothing if the method is not supported
  };
  
  export {makeColor, getRandomColor, getLinearGradient, goFullscreen};