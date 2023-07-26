// JavaScript source code

var canvas = null;
var gl = null;
var bFullscreen = true;
var canvas_original_width;
var canvas_original_height;

var camera0;    // for sceneOne
// var camera1;    // for sceneTwo
var camera2;    // for sceneTwo
// var camera3;    // for sceneTwo

var camera4;    // for sceneThree

// var restoreCamera; // camera to store previous camera state

var cameraCounterSideWays = 0;
var cameraCounterUpWays = 0;

var currentCamera;

var scenesStack;

var currentScene;
var previousScene;

var appStart = false;

const webGLMacros =
{
    DG_ATTRIBUTE_POSITION: 0,
    DG_ATTRIBUTE_COLOR: 1,
    DG_ATTRIBUTE_NORMAL: 2,
    DG_ATTRIBUTE_TEXTURE0: 3,
    DG_ATTRIBUTE_BONE_ID: 4,
    DG_ATTRIBUTE_BONE_WEIGHT: 5,
    DG_ATTRIBUTE_INSTANCE_POSITION: 6,
    

};

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.oRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

//the following code is required to stop the double-buffering / animation
/*var cancelAnimationFrame = window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame ||
    window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame ||
    window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame ||
    window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame;*/

// Audio variable
var projectAudio;

var frameCount = -11400;


let previousFrameTime = 0;
let desiredFPS = 60;
let desiredFrameTime = (1.0 / desiredFPS) * 1000;

var startTime = 0.0;
var FPS = 0;

function main() {
    //code

    //Get canvas from DOM [Document Object Model]
    canvas = document.getElementById("SPK");
    if (!canvas)
        console.log("Obtaining Canvas Failed. \n");
    else
        console.log("Obtaining Canvas Succeeded. \n");

    //backup canvas dimensions
    canvas_original_width = canvas.width;
    canvas_original_height = canvas.height;

    //init
    initialize();

    //warm-up resize
    resize();

    //display
    display(0.0);

    //add events of keyboard and mouse
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("click", mouseDown, false);
    window.addEventListener("resize", resize, false);
}

//keyboard event listener
function keyDown(event) {

    switch (event.keyCode) {

        case 49:                //1 
            values.clothTranslateEnable = 1;
            break;

        case 71:                //'G / g'
            values.fourier_stroke_enable = 1;
            break;

        case 65:                //'a'
            currentCamera.eye[0] -= 0.5;
            currentCamera.center[0] -= 0.5;
            break;

        case 68:                //'d'
            currentCamera.eye[0] += 0.5;
            currentCamera.center[0] += 0.5;
            break;
        
        case 76:
            console.log("frameCount : " + this.frameCount);
        break;

        case 87:                //'w'
            currentCamera.eye[2] -= 1.5;
            currentCamera.center[2] -= 1.5;
            break;

        case 83:                //'s'
            currentCamera.eye[2] += 1.0;
            currentCamera.center[2] += 1.0;
            break;

        case 81:                //'q'
            currentCamera.eye[1] += 1.0;
            currentCamera.center[1] += 1.0;
            break;

        case 69:                //'e'
            currentCamera.eye[1] -= 1.0;
            currentCamera.center[1] -= 1.0;
            break;

        case 37:                //'<-'
            currentCamera.center[0] = Math.sin(cameraCounterSideWays) * 360.0;
            currentCamera.center[2] = Math.cos(cameraCounterSideWays) * 360.0;
            cameraCounterSideWays += 0.01;
            break;

        case 39:                //'->'
            currentCamera.center[0] = Math.sin(cameraCounterSideWays) * 360.0;
            currentCamera.center[2] = Math.cos(cameraCounterSideWays) * 360.0;
            cameraCounterSideWays -= 0.01;
            break;

        case 38:                //'^'
            currentCamera.center[0] = Math.sin(cameraCounterUpWays) * 360.0;
            currentCamera.center[1] = Math.cos(cameraCounterUpWays) * 360.0;
            cameraCounterUpWays += 0.01;
            break;

        case 40:                //'v'
            currentCamera.center[0] = Math.sin(cameraCounterUpWays) * 360.0;
            currentCamera.center[1] = Math.cos(cameraCounterUpWays) * 360.0;
            cameraCounterUpWays -= 0.01;
            break;

        case 188:               //','
            currentCamera.eye[1] -= 1.0;
            currentCamera.center[1] = 0.0;
            break;

        case 190:               //'.'
            currentCamera.eye[1] += 1.0;
            currentCamera.center[1] = 0.0;
            break;

        case 80:                // 'p'
            console.log("lookat([" +
                currentCamera.eye[0] +
                ", " +
                currentCamera.eye[1] +
                ", " +
                currentCamera.eye[2] +
                "], [" +
                currentCamera.center[0] +
                ", " +
                currentCamera.center[1] +
                ", " +
                currentCamera.center[2] +
                "], [" +
                currentCamera.up[0] +
                ", " +
                currentCamera.up[1] +
                ", " +
                currentCamera.up[2] +
                "]);"
                );
            break;

        case 54:                // '6'
            currentScene = scenesStack.pop();
            break;

        case 84:                //'T'
            uninitialize();
            window.close();     //not all browsers will follow this
            break;
        case 79:        // Orange Light - Amber 'O' Key
            if(values.godray_light1Alpha <= 1.0)
            {
                values.godray_light1Alpha += 0.5;
            }
            else
            {
                values.godray_light1Alpha = 1.0;
            }
            break;
        case 82:
            if(values.godray_light2Alpha <= 1.0)
            {
                values.godray_light2Alpha += 0.5;
            }
            else
            {
                values.godray_light2Alpha = 1.0;
            }
            break;
        
        case 86:        // 'v' key for white lights
            if(values.godray_light3Alpha <= 0.65)
            {
                values.godray_light3Alpha += 0.65;
            }
            else
            {
                values.godray_light3Alpha = 0.65;
            }

            if(values.godray_light4Alpha <= 0.65)
            {
                values.godray_light4Alpha += 0.65;
            }
            else
            {
                values.godray_light4Alpha = 0.65;
            }
            break;
        case 70:                //'F'
            toggleFullscreen();
            break;

        case 32:                // 'Space'
            if (projectAudio == null && appStart == false) {
                appStart = true;
                projectAudio = new Audio();
                projectAudio.src = "res/audio/panchtund_nandi.mp3";
                projectAudio.play();
            }
            break;
        default:
            console.log("key " + event.keyCode + " not handled");
            break;
    }
}

//mouse event listener
function mouseDown(event) {

}

function toggleFullscreen() {
    //code

    var fullscreen_element = document.fullscreenElement ||
                             document.mozFullScreenElement ||
                             document.webkitFullscreenElement ||
                             document.msFullscreenElement ||
                             null;

    if (fullscreen_element == null) {

        if (canvas.requestFullscreen)
            canvas.requestFullscreen();

        else if (canvas.mozRequestFullscreen)
            canvas.mozRequestFullScreen();

        else if (canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();

        else if (canvas.msRequestFullscreen)
            canvas.msRequestFullscreen();

        bFullscreen = true;
    }
    else
    {
        if (document.exitFullscreen)
            document.exitFullscreen();

        else if (document.mozCancelFullScreen)
            document.mozExitFullScreen();

        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();

        else if (document.msExitFullscreen)
            document.msExitFullscreen();

        bFullscreen = false;
    }
}

function initialize()
{
    //code

    //Get drawing context from canvas
    gl = canvas.getContext("webgl2");
    if (!gl)
        console.log("Obtaining WebGL2.0 Context Failed. \n");
    else
        console.log("Obtaining WebGL2.0 Context Succeeded. \n");

    //set viewport width and height of context
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;


    //INIT ALL SHADERS
    if (!initAllShaders()) {
        console.log("ERROR: initAllShaders() failed.");
    }

    // INIT SCENES STACK
    scenesStack = new ScenesStack();

    scenesStack.push(3);
    scenesStack.push(2);
    scenesStack.push(1);
    scenesStack.push(0);

    //INIT ALL SCENES
    sceneZero.init();
    sceneOne.init();
    sceneTwo.init();
    sceneThree.init();

    currentScene = scenesStack.pop();

    //INIT AUDIO


    //INIT CAMERA
    camera0 = new Camera([0.0, 0.0, 200.0], [0.0, 0.0, 7.9], [0.0, 1.0, 0.0]);
    // camera1 = new Camera([11.0, -5.0, 30.0], [30.0, -5.0, 10.0], [0.0, 1.0, 0.0]);
    camera2 = new Camera([0.0, 15.0, 200.0], [0.0, 0.0, 7.9], [0.0, 1.0, 0.0]);
    // camera3 = new Camera([-0.5, -5.0, 24.0], [-35.0, -5.0, 13.0], [0.0, 1.0, 0.0]);
    camera4 = new Camera([0.0, 1.0, 200.0], [0.0, 0.0, 7.9], [0.0, 1.0, 0.0]);

    currentCamera = camera2;

    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
   
    //clear the screen
    gl.clearColor(1.0, 1.0, 0.9, 1.0);

    perspectiveProjectionMatrix = mat4.create();
}

function resize()
{
    //code

    if (bFullscreen == true)
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    else
    {
        canvas.width = canvas_original_width;
        canvas.height = canvas_original_height;
    }

    if (canvas.height == 0)
        canvas.height = 1;

    gl.viewport(0, 0, canvas.width, canvas.height);

    //RESIZE ALL SCENES

    sceneZero.resize();
    sceneOne.resize();
    sceneTwo.resize();
    sceneThree.resize();
    
}

function display(time)
{
    //code
    let diff = time - previousFrameTime;
    //if (diff >= desiredFrameTime) {
    if (diff < desiredFrameTime) {

        ////update
        //update();

        //previousFrameTime = time;
        requestAnimationFrame(display);
        return;
    }

    previousFrameTime = time;

    let deltaTime = time ? (time - startTime) : 0.0;

    if (deltaTime >= 1000.0) {
        //console.log(FPS);
        FPS = 0;
        startTime = time;
    }
    else {
        FPS++;
    }
  
    //DISPLAY ALL SCENES
    if (appStart == true) {
        if (currentScene == 0) {
            sceneZero.draw();
        }
        if (currentScene == 1) {
            sceneOne.draw();
        }

        if (currentScene == 2) {
            sceneTwo.draw();
        }

        if (currentScene == 3) {
            sceneThree.draw();
        }

        ////update
        update();
    }

    // Double Buffer Emulation
    requestAnimationFrame(display);

    previousScene = currentScene;
}

function update()
{
    //code
    this.frameCount++;

    // console.log("console log : " + this.frameCount);
   if (this.frameCount == 0) {
       currentScene = scenesStack.pop();
       // sceneZero.uninit();
       //this.frameCount = 0;
	}        
   if (this.frameCount == 3840) { // 1920 according to current storyboard time calculation
       currentScene = scenesStack.pop();
       currentCamera = camera2;
   }
   if (this.frameCount == 15300) { // 15780 according to current storyboard time calculation
       currentScene = scenesStack.pop();
       currentCamera = camera4;
   }

    // end sceneThree condition at flute

    //UPDATE ALL SCENES
    if (currentScene == 0) {
        sceneZero.update();
    }
    if (currentScene == 1) {
        sceneOne.update();
    }

    if (currentScene == 2) {
        sceneTwo.update();
    }

    if (currentScene == 3) {
        sceneThree.update();
    }
}

function uninitialize() {

    //code

    //UNINIT ALL SCENES
    appStart = false;    
    sceneThree.uninit();
    sceneTwo.uninit();
    sceneOne.uninit();
    sceneZero.uninit();
    
    while (scenesStack)
        scenesStack.pop();
	scenesStack = null;
    console.log("All scene popped. \n");
    
    //UNINT ALL SHADERS
    uninitAllShaders();
    console.log("uninitAllShaders complete. \n");
    if (projectAudio) {
        projectAudio.pause();
        projectAudio = null;
        console.log("Project Audio UnInitialize Succeeded. \n");
    }
    window.close();
}

