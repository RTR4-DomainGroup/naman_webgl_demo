/*********** All Shaders Init and Uninit ***********/

//init all shaders
function initAllShaders() {

    if (!adsLightShader.init())
        return (false);

    if (!staticModelShader.init())
        return (false);

    if (!animatedModelShader.init())
        return (false);

    if (!fourierShader.init())
        return (false);

    if (!depthQuadShader.init())
        return (false);
    if (!godRayShader.init()) {
        return (false);
    }
    if (!fsQuadShader.init()) {
        return(false);
    }

    if (!clothShader.init()) {
        return (false);
    }
    if (!sceneZeroLightShader.init()) {
        return (false);
    }
    return (true);
}

//uninit all shaders
function uninitAllShaders() {

    adsLightShader.uninit();
    staticModelShader.uninit();
    animatedModelShader.uninit();
    fourierShader.uninit();
    godRayShader.uninit();
    depthQuadShader.uninit();
    clothShader.uninit();
    sceneZeroLightShader.uninit();
}
