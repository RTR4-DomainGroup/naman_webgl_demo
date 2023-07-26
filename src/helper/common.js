/*********** Common Utils ***********/

//macros

//variables
const values = {

    lastSpotEnable: false,

    // shadow variables
    footLightShadowFB: 0,
    SHADOW_WIDTH: 2048,
    SHADOW_HEIGHT: 2048,

    // Godrays Related Variables
    god_rayLightPosition: [-0.5, 22.5, 19.0, 1.0],
    god_rayLightPosition2: [18, 21.0, 16.0, 1.0],
    god_rayLightPosition3: [-28.0, 25.0, 21.0, 1.0], // right
    god_rayLightPosition4: [28.0, 25.0, 21.0, 1.0],  // left
    god_rayLightPosition5: [-0.8, 21.0, 4.2, 1.0],  // Foco

    godray_light1Alpha: 0.0,
    godray_isAmberFadeIn: false,
    godray_isRedFadeIn: false,
    godray_isWhite3FadeIn: false,
    godray_isWhite4FadeIn: false,
    godray_light2Alpha: 0.0,
    godray_light3Alpha: 0.0,
    godray_light4Alpha: 0.0,
    godray_light5Alpha: 0.0,

    godray_fadeOutFactor: 0.002,
    godray_fadeOut_whiteFactor: 0.0025,
    godray_fadeOut_redFactor: 0.003,
    godray_fadeInFactor: 0.0015,
    materialShininess: 128.0,
    gr_decay: 1.0,
    gr_density: 0.92,
    gr_density_light34: 0.92,
    gr_foco_density: 0.88,
    gr_exposure: 0.25,
    gr_weight: 0.06,
    gr_offsets:[[0.032, 0.05], [-0.03, 0.08], [-0.016, 0.055], [0.015, 0.055], [0.0, 0.05]],

    //light and material arrays
    poslightAmbientZero: [0.1, 0.1, 0.1],
    poslightDiffuseZero: [1.0, 1.0, 1.0],
    poslightSpecularZero: [0.0, 0.0, 0.0],
    poslightPositionZero: [0.0, 0.0, 38.0, 1.0],

    poslightAmbientOne: [0.0, 0.0, 0.0],
    poslightDiffuseOne: [0.0, 0.0, 0.0],
    poslightSpecularOne: [0.0, 0.0, 0.0],
    poslightPositionOne: [0.0, 70.0, 70.0, 1.0],

    poslightAmbientTwo: [0.0, 0.0, 0.0],
    poslightDiffuseTwo: [0.0, 0.0, 0.0],
    poslightSpecularTwo: [0.0, 0.0, 0.0],
    poslightPositionTwo: [0.0, 70.0, 70.0, 1.0],

    poslightAmbientThree: [0.0, 0.0, 0.0],
    poslightDiffuseThree: [0.0, 0.0, 0.0],
    poslightSpecularThree: [0.0, 0.0, 0.0],
    poslightPositionThree: [0.0, 70.0, 70.0, 1.0],

    // Positional Diffuse Factor Related Variables
    alphaPoslightZero: 1.0,
    alphaPoslightOne: 1.0,
    alphaPoslightTwo: 1.0,
    alphaPoslightThree: 1.0,
    
    // Spotlight Related Code
    spotlightAmbientZero: [1.0, 1.0, 1.0],
    spotlightDiffuseZero: [1.0, 0.6, 0.0],
    spotlightSpecularZero: [0.0, 0.0, 0.0],
    //spotlightPositionZero: [-1.5, 22.5, 20.0, 1.0],
    spotlightPositionZero: [-37.0, 4.0, 13.5, 1.0],
    //spotDirectionZero: [-2.0, -Math.cos(degToRad(45.0)), -1.0],
    spotDirectionZero: [0.0, -1.0, 0.0],
    constantAttenuationZero: 1.0,
    linearAttenuationZero: 0.007,
    quadraticAttenuationZero: 0.0002,
    spotCosCutoffZero: Math.cos(degToRad(30.0)),
    spotCosOuterCutoffZero: Math.cos(degToRad(32.0)),

    spotlightAmbientOne: [0.0, 0.0, 0.0],
    spotlightDiffuseOne: [1.0, 1.0, 1.0],
    spotlightSpecularOne: [0.0, 0.0, 0.0],
    //spotlightPositionOne: [-20.0, 4.0, 10.0, 1.0],
    spotlightPositionOne: [-2.5, 4.0, 22.0, 1.0],
    spotDirectionOne: [0.0, -Math.cos(degToRad(30.0)), 0.0],
    //spotDirectionOne: [0.0, -1.0, 0.0],
    constantAttenuationOne: 1.0,
    linearAttenuationOne: 0.007,
    quadraticAttenuationOne: 0.0002,
    spotCosCutoffOne: Math.cos(degToRad(6.0)),
    spotCosOuterCutoffOne: Math.cos(degToRad(30.0)),

    // SpotlightOne is set on Center of Stage From Right Top of Stage 
    spotlightAmbientTwo: [0.0, 0.0, 0.0],
    spotlightDiffuseTwo: [1.0, 1.0, 1.0],
    spotlightSpecularTwo: [0.0, 0.0, 0.0],
    //spotlightPositionTwo: [20.0, 4.0, 30.0, 1.0],
    spotlightPositionTwo: [2.5, 4.0, 22.0, 1.0],
    spotDirectionTwo: [0.0, -Math.cos(degToRad(30.0)), 0.0],
    //spotDirectionTwo: [0.0, -1.0, 0.0],
    constantAttenuationTwo: 1.0,
    linearAttenuationTwo: 0.007,
    quadraticAttenuationTwo: 0.0002,
    spotCosCutoffTwo: Math.cos(degToRad(6.0)),
    spotCosOuterCutoffTwo: Math.cos(degToRad(30.0)),

    spotlightAmbientThree: [0.0, 0.0, 0.0],
    spotlightDiffuseThree: [3.0, 0.0, 0.0],
    spotlightSpecularThree: [0.0, 0.0, 0.0],
    spotlightPositionThree: [35.0, 4.0, 8.0, 1.0],
    //spotDirectionThree: [0.0, -Math.cos(Math.PI / 4), 0.0],
    spotDirectionThree: [0.0, -1.0, 0.0],
    constantAttenuationThree: 1.0,
    linearAttenuationThree: 0.007,
    quadraticAttenuationThree: 0.0002,
    spotCosCutoffThree: Math.cos(degToRad(30.0)),
    spotCosOuterCutoffThree: Math.cos(degToRad(32.0)),

    spotlightAmbientFour: [1.0, 1.0, 1.0],
    spotlightDiffuseFour: [5.0, 5.0, 5.0],
    spotlightSpecularFour: [0.0, 0.0, 0.0],
    spotlightPositionFour: [0.0, 4.0, 0.0, 1.0],
    spotDirectionFour: [0.0, -Math.cos(degToRad(45.0)), 0.5],
    //spotDirectionFour: [0.0, 0.0, -1.0],
    constantAttenuationFour: 1.0,
    linearAttenuationFour: 0.007,
    quadraticAttenuationFour: 0.0002,
    spotCosCutoffFour: Math.cos(degToRad(20.0)),
    spotCosOuterCutoffFour: Math.cos(degToRad(22.0)),

    // Spot Diffuse Factor Related Variables
    alphaSpotlightZero: 0.0,
    alphaSpotlightOne: 0.0,
    alphaSpotlightTwo: 0.0,
    alphaSpotlightThree: 0.0,
    alphaSpotlightFour: 0.0,

    poslightZeroFadeIn: true,
    poslightOneFadeIn: false,
    poslightTwoFadeIn: false,
    poslightThreeFadeIn: false,

    spotlightZeroFadeIn: true,
    spotlightOneFadeIn: true,
    spotlightTwoFadeIn: true,
    spotlightThreeFadeIn: true,
    spotlightFourFadeIn: true,

    // flag0: true,
    // flag1: false,
    // flag2: false,
    // flag3: false,

    spotFlag: true,
    posFlag: true,

    alphaSceneZero: 0.0,
    alphaSceneTwo: 0.0,
    alphaBlendIncrement: 0.0007,

    // fourier fbo size
    fourier_fbo_width: 1920,
    fourier_fbo_height: 1080,
    fourier_stroke_speed: 15,
    fourier_stroke_enable: 0,

    // instancing macros
    // X_MIN :-220.0,
    // X_MAX :150.0,
    X_MIN :-230.0,
    X_MAX :130.0,

    Y_MIN :-10.8,
    Y_MAX :700.0,

    Z_MIN :0.0,
    Z_MAX :3.0,

    X_INCREMENT :22.0,
    Y_INCREMENT :28.0,
    Z_INCREMENT :3.0,

    ROW_SEPARTION :90.0,
    
    X_SEPARTION_OFFSET :0.1,
    Y_SEPARTION_OFFSET :0.1,
    Z_SEPARTION_OFFSET: 0.1,


    // Cloth
    clothTranslateY: 0.0,
    clothTranslateEnable: 0,

    lerp: function(v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    }
    
};


const sceneZeroValue = {
        // Spotlight Related Code
        defaultlight: [0.0, 0.0, 0.0],
      
        spotlightAmbientZero: [1.0, 1.0, 1.0],
        spotlightDiffuseZero: [1.0, 1.0, 1.0],
        spotlightSpecularZero: [0.0, 0.0, 0.0],
        spotlightPositionZero: [0.0, 0.0, -2.0, 1.0],
        spotDirectionZero: [0.0, 0.0, -1.0],

        constantAttenuationZero: 1.0,
        linearAttenuationZero: 0.7,
        quadraticAttenuationZero: 1.8,
        
        spotCosCutoffZero: Math.cos(degToRad(100.0)),
        spotCosOuterCutoffZero: Math.cos(degToRad(300.0)),

        //light and material arrays
        poslightAmbientZero: [0.1, 0.1, 0.1],
        poslightDiffuseZero: [1.0, 1.0, 1.0],
        poslightSpecularZero: [0.0, 0.0, 0.0],
        poslightPositionZero: [0.0, 0.0, 38.0, 1.0],

        // Positional Diffuse Factor Related Variables
        alphaPoslightZero: 1.0,
        alphaSpotlightZero: 1.0,

        transitionSpeed:0.018
};

//functions

function degToRad(degrees) {

    return (degrees * Math.PI / 180.0);
}

function loadTexture(path) {

    var tex = gl.createTexture();
    tex.image = new Image();
    tex.image.src = path;
    tex.image.onload = function () {

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    return (tex);
}

function createFBO(fboDetails) {
    // Code
    //1. Check available render buffer Size
    var maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    if (maxRenderbufferSize < fboDetails.textureWidth || maxRenderbufferSize < fboDetails.textureHeight) {
        console.log("Insufficient Render buffer size");
        return null;
    }

    //2. Create frame buffer object
    fboDetails.framebuffer_obj = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboDetails.framebuffer_obj);

    // 3. Create Render Buffer object
    fboDetails.renderbuffer_obj = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, fboDetails.renderbuffer_obj);

    // 4. Storage and Format of the Render Buffer
    //This has nothing to with depth. 
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fboDetails.textureWidth, fboDetails.textureHeight);

    //5. Create Empty texture for upcoming target scene
    fboDetails.framebuffer_texture = gl.createTexture();

    // closure / functure / Lambda
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, fboDetails.framebuffer_texture);

    // Linear and Mip map linear are allowed but not portable across browser
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fboDetails.textureWidth, fboDetails.textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboDetails.framebuffer_texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fboDetails.renderbuffer_obj);

    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.log("Framebuffer is not complete \n");
        return null;
    }
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return fboDetails;
}

function createShadowFrameBuffer(width, height) {

    var fb = {};


    // FBO for Shadow Depth
    // Create a depth texture
    fb.fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb.fbo);
    // create depth texture

    fb.fbo_depth_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fb.fbo_depth_texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);

    // attach depth texture as FBO's depth buffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, fb.fbo_depth_texture, 0);
    //gl.drawBuffers([gl.NONE]);
    //gl.readBuffers([gl.NONE]);

    var result = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (result != gl.FRAMEBUFFER_COMPLETE) {

        console.log("ERROR: ShadowFrameBuffer is not Complete.\n");

        return false;

    }

    //gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return fb;


}

