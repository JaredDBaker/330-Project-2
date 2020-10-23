import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let s, buffer1, buffer2, damping, temp;

function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:1,color:"cyan"}, {percent:.5,color:"lightskyblue"} ,{percent:0,color:"deepskyblue"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);
    
    s = 1;
    buffer1 = Array(canvasWidth).fill().map(_=>Array(canvasHeight).fill(0));
    buffer2 = Array(canvasWidth).fill().map(_=>Array(canvasHeight).fill(0));
    damping = .99;

}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
    ctx.restore();

    // draw dock
    // ctx.save();
    // ctx.fillStyle = "saddlebrown";
    // for(let i = 0; i < 4; i++){
    //     ctx.fillRect(i* canvasWidth/19, canvasHeight/3, canvasWidth/20, canvasHeight/4);
    // }
    // ctx.restore();
		
    //3 - draw gradient
    if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    
	// 4 - draw bars

	// 5 - draw circles
	if(params.showCircles){
        let maxRadius = canvasHeight/2;
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 5;
        for(let i = 0; i < audioData.length; i++){
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.strokeStyle = utils.makeColor(0, 0, 255, .34 - percent/3.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.closePath();

            // ctx.beginPath();
            // ctx.strokeStyle = utils.makeColor(70, 130, 180, .10 - percent/10.0);
            // ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            // ctx.stroke();
            // ctx.closePath();

            // ctx.save();
            // ctx.beginPath();
            // ctx.strokeStyle = utils.makeColor(65, 105, 225, .5 - percent/5.0);
            // ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * .5, 0, 2 * Math.PI, false);
            // ctx.stroke();
            // ctx.closePath();
            // ctx.restore();
        }
        ctx.restore();
    }	

    if(params.showBars){
        let barSpacing = 4; 
        let margin = 5; 
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length * 4;
        let barHeight = 200;
        let topSpacing = canvasHeight/4;

        ctx.save();
        ctx.fillStyle = 'rgba(160,42,42,0.9)';
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';

        for(let i = 0; i < audioData.length; i++){
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
        }
        ctx.restore();
    }
    // 6 - bitmap manipulation
        // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
        // regardless of whether or not we are applying a pixel effect
        // At some point, refactor this code so that we are looping though the image data only if
        // it is necessary

        // A) grab all of the pixels on the canvas and put them in the `data` array
        // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
        // the variable `data` below is a reference to that array 
        let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;
        // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
        for(let i = 0; i < length; i+=4){
            // C) randomly change every 20th pixel to red
            if(params.showNoise && Math.random() < .05){
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel    
                // data[i+3] is the alpha channel
                data[i] = data[i+1] = data[i+2] = 0;
                data[i] = 177;
                data[i + 1] = 177;
                data[i + 2] = 177;// zero out the red and green and blue channels
                // make the red channel 100% red
            } // end if
            if(params.showInvert){
                let red = data[i], green = data[i+1], blue = data[i+2];
                data[i] = 255 - red;
                data[i+1] = 255 - green;
                data[i+2] = 255 - blue;
                // data[i+3] is the alpha channel
            }

        } // end for

        if(params.showEmboss){
            for(let i = 0; i < length; i++){
                if(i%4 == 3) continue;
                data[i] = 127 + 2*data[i] - data[i+4] - data [i + width * 4];
            }
        }

        ctx.putImageData(imageData, 0, 0);

        if(params.showRipples){
            for(let i = 0; i < audioData.length; i++){
                if(audioData[i] > 150){
                    buffer1[canvasWidth/2][canvasHeight/2] = 5 *  audioData[i];
                    animation();
                }
            }

            //     buffer1[canvasWidth/2][canvasHeight/2] = 2 *  audioData[10 * i];
            //     animation();

            //     buffer1[canvasWidth/2][canvasHeight/2] = 1 *  audioData[20 * i];
            //     animation();
            // }

        }

        // D) copy image data back to canvas
  
}

function animation(){
    for(let i = 1; i < canvasWidth-1; i++){
		for(let j = 1; j < canvasHeight-1; j++){
			buffer2[i][j] = ((buffer1[i-1][j] +
											 buffer1[i+1][j] +
											 buffer1[i][j-1] +
											 buffer1[i][j+1]) / 2 - buffer2[i][j]) * damping;
		}
	}
	
	let img = new ImageData(canvasWidth, canvasHeight);
	
	for(let i = 0; i < buffer1.length; i++){
		for(let j = 0; j < buffer1[0].length; j++){
			let index = (j * buffer1.length + i) * 4;
			img.data[index] = buffer2[i][j];
			img.data[index+1] = buffer2[i][j];
			img.data[index+2] = buffer2[i][j];
			img.data[index+3] = 255;
		}
	}
	
	ctx.putImageData(img,0,0);
	
	temp = buffer2;
	buffer2 = buffer1;
    buffer1 = temp;
    //requestAnimationFrame(animation);
}

export {setupCanvas,draw};