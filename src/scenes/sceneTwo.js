/*********** Scene One - main scene ***********/

const sceneTwoStates =
{
    CENTER_CAMERA_INITIAL: 0,
    CENTER_CAMERA_MOVE_FORWARD: 1,
    /*RIGHT_CAMERA_STAGE: 2,*/
    CENTER_CAMERA_MID: 3,
    CENTER_CAMERA_MID_LEFT_ZOOM: 4,
    CENTER_CAMERA_MID_PAN_RIGHT: 5,
    CENTER_CAMERA_MID_RIGHT_ZOOM: 6,
    CENTER_CAMERA_MID_LEFT_BACK: 7,
    CENTER_CAMERA_MID_PAN_RIGHT_BACK: 8,
    CENTER_CAMERA_END_ZOOM_OUT: 9,
    CENTER_CAMERA_MOVE_BACKWARD: 10
};

var sceneTwo = {

    //gobal variables
    perspectiveProjectionMatrix: mat4.create(),

    //texture variables
    godRay_blackFbo: 0,
    godRay_blackRbo: 0,
    godRay_blackSceneTexture: 0,

    godRay_blackL2Fbo: 0,
    godRay_blackL2Rbo: 0,
    godRay_blackL2SceneTexture: 0,

    // Mid Left
    godRay_blackL3Fbo: 0,
    godRay_blackL3Rbo: 0,
    godRay_blackL3SceneTexture: 0,

    // Mid Right
    godRay_blackL4Fbo: 0,
    godRay_blackL4Rbo: 0,
    godRay_blackL4SceneTexture: 0,

    // Foco Right
    godRay_blackL5Fbo: 0,
    godRay_blackL5Rbo: 0,
    godRay_blackL5SceneTexture: 0,

    godRay_sceneFbo: 0,
    godRay_sceneRbo: 0,
    godRay_sceneTexture: 0,

    // Left - Amber
    godRay_Fbo: 0,
    godRay_Rbo: 0,
    godRay_Texture: 0,

    // Right - Ganesha
    godRay_light2Fbo: 0,
    godRay_light2Rbo: 0,
    godRay_light2Texture: 0,

    // Mid Left 
    godRay_light3Fbo: 0,
    godRay_light3Rbo: 0,
    godRay_light3Texture: 0,

    // Mid Right
    godRay_light4Fbo: 0,
    godRay_light4Rbo: 0,
    godRay_light4Texture: 0,

    // Mid Right
    godRay_light5Fbo: 0,
    godRay_light5Rbo: 0,
    godRay_light5Texture: 0,

    state: sceneTwoStates.CENTER_CAMERA_INITIAL,
    zCamera: 35.0,

    init: function () {

        //init the geometry
        quad.init();
        bharatNatyaMandir.init();
        
        //create fbo
        // fourier frameBuffer creation
        this.fourier_fboDetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, fourier.fbo_fourier, fourier.rbo_fourier, fourier.fourier_texture);
        this.fourier_fboDetails = createFBO(this.fourier_fboDetails);
        fourier.init();

        //console.log(this.fourier_fboDetails);
        
        // Light 1
        this.godRay_blackFBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_blackFbo, this.godRay_blackRbo, this.godRay_blackSceneTexture);
        this.godRay_blackFBODetails = createFBO(this.godRay_blackFBODetails);
        
        // Light 2
        this.godRay_blackL2FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_blackL2Fbo, this.godRay_blackL2Rbo, this.godRay_blackL2SceneTexture);
        this.godRay_blackL2FBODetails = createFBO(this.godRay_blackL2FBODetails); 

        // Light 3 (Mid Left)
        this.godRay_blackL3FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_blackL3Fbo, this.godRay_blackL3Rbo, this.godRay_blackL3SceneTexture);
        this.godRay_blackL3FBODetails = createFBO(this.godRay_blackL3FBODetails); 

        // Light 4 (Mid Right)
        this.godRay_blackL4FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_blackL4Fbo, this.godRay_blackL4Rbo, this.godRay_blackL4SceneTexture);
        this.godRay_blackL4FBODetails = createFBO(this.godRay_blackL4FBODetails);

        // Light 5 (Foco)
        this.godRay_blackL5FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_blackL5Fbo, this.godRay_blackL5Rbo, this.godRay_blackL5SceneTexture);
        this.godRay_blackL5FBODetails = createFBO(this.godRay_blackL5FBODetails);

        // Color scene common for God Ray Light sources
        this.godRay_sceneFBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_sceneFbo, this.godRay_sceneRbo, this.godRay_sceneTexture);
        this.godRay_sceneFBODetails = createFBO(this.godRay_sceneFBODetails);

        this.godRay_FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_Fbo, this.godRay_Rbo, this.godRay_Texture);
        this.godRay_FBODetails = createFBO(this.godRay_FBODetails);
        values.footLightShadowFB = createShadowFrameBuffer(values.SHADOW_WIDTH, values.SHADOW_HEIGHT);

        // Extra Pass for Light Buffer
        this.godRay_light2FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_light2Fbo, 
            this.godRay_light2Rbo, this.godRay_light2Texture);
        this.godRay_light2FBODetails = createFBO(this.godRay_light2FBODetails);

        this.godRay_light3FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_light3Fbo, 
            this.godRay_light3Rbo, this.godRay_light3Texture);
        this.godRay_light3FBODetails = createFBO(this.godRay_light3FBODetails);

        this.godRay_light4FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_light4Fbo, 
            this.godRay_light4Rbo, this.godRay_light4Texture);
        this.godRay_light4FBODetails = createFBO(this.godRay_light4FBODetails);

        this.godRay_light5FBODetails = new FboDetails(values.fourier_fbo_width, values.fourier_fbo_height, this.godRay_light5Fbo,
            this.godRay_light5Rbo, this.godRay_light5Texture);
        this.godRay_light5FBODetails = createFBO(this.godRay_light5FBODetails);


        //load textures

        //load models
        staticModels.init();
        animatedModels.init();

        console.log("Cloth Before Init.");

        // cloth init
        cloth_var.init();

        console.log("Cloth Init Done.");

        //init the projection matrix
        this.perspectiveProjectionMatrix = mat4.create();
    },

    resize: function () {

        mat4.perspective(this.perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width / canvas.height), 0.1, 1000.0);

        bharatNatyaMandir.resize();
        staticModels.resize();
        animatedModels.resize();
        cloth_var.resize();
    },

    draw: function () {

        // --------------------------- Common Camera --------------------------- //

        // set view matrix to identity
        var viewMatrix = mat4.create();

        // set viewMatrix to currentCamera (selected camera)
        var cameraMatrix = currentCamera.lookat();
        viewMatrix = currentCamera.inverse(cameraMatrix);


        var lightProjectionMatrix = mat4.create();
        var lightViewMatrix = mat4.create();
        var lightBiasMatrix = mat4.fromValues([
            0.5, 0.0, 0.0, 0.0,
            0.0, 0.5, 0.0, 0.0,
            0.0, 0.0, 0.5, 0.0,
            0.5, 0.5, 0.5, 1.0
        ]);

        var near_plane = 0.1;
        var far_plane = 200.0;

        var lightSpaceMatrix = mat4.create();

        /* **************************************************************************************
         =========================== pass for fourier drawing ===========================
        ***************************************************************************************** */
       
        // fourier framebuffer display
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fourier_fboDetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        fourier.draw();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);


        /* **************************************************************************************
         =========================== pass for shadows (depthpass) ===========================
        ***************************************************************************************** */

        mat4.perspective(lightProjectionMatrix, 90.0, parseFloat(canvas.width / canvas.height), 0.1, 200.0);

        if (values.lastSpotEnable == true) {
            mat4.lookAt(lightViewMatrix, [0.0, 12.0, 12.0], [0.0, -10.5, 70.0], [0.0, 1.0, 0.0]);
        } else {
            mat4.lookAt(lightViewMatrix, [0.0, -5.7, this.zCamera], [0.0, 5.0, 0.0], [0.0, 1.0, 0.0]);
        }
        //lightSpaceMatrix = lightProjectionMatrix * lightViewMatrix;

        mat4.multiply(lightSpaceMatrix, lightProjectionMatrix, lightViewMatrix);

        //mat4.multiply(lightSpaceMatrix, lightSpaceMatrix, lightBiasMatrix);


         gl.bindFramebuffer(gl.FRAMEBUFFER, values.footLightShadowFB.fbo);
         gl.viewport(0, 0, values.SHADOW_WIDTH, values.SHADOW_HEIGHT);
         gl.clear(gl.DEPTH_BUFFER_BIT);
        
         // Draw Bharat natya
         bharatNatyaMandir.draw(viewMatrix, this.fourier_fboDetails.framebuffer_texture, lightSpaceMatrix, true, 0);
         //draw animated model
         animatedModels.draw(viewMatrix, lightSpaceMatrix, true);

         //draw static models
         staticModels.draw(viewMatrix, lightSpaceMatrix, true);
    

         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        /* **************************************************************************************
         =========================== 1st pass for GodRays (Black Scene) ===========================
        ***************************************************************************************** */
        //#region God Rays Light 1
        // GodRay Black Scene
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_blackFBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // pass view matrix to the scene drawing
        bharatNatyaMandir.draw(viewMatrix, this.fourier_fboDetails.framebuffer_texture, lightSpaceMatrix, false, 1, 0);

        ////draw animated model
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, values.godray_light1Alpha);
        animatedModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        ////draw static models
        staticModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        //gl.vertexAttrib3f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      
       // =========================== 2nd pass for shadows (actual scene) ===========================

        //clear the color and depth buffer
        //// pass view matrix to the scene drawing
        //
        // God Rays Main Processing Shader
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var grs = godRayShader.use();
        gl.uniform4fv(grs.lightPositionUniform, values.god_rayLightPosition);
        
        gl.uniform1f(grs.decayUniform, values.gr_decay);
        gl.uniform1f(grs.densityUniform, values.gr_density);
        gl.uniform1f(grs.exposureUniform, values.gr_exposure);
        gl.uniform1f(grs.weightUniform, values.gr_weight);
        gl.uniform2f(grs.lightPositionOffsetUniform, values.gr_offsets[0][0], values.gr_offsets[0][1]);

        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition[0], values.god_rayLightPosition[1], values.god_rayLightPosition[2]]);
        //mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5 ]);
        
        gl.uniformMatrix4fv(grs.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(grs.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(grs.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

              
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_blackFBODetails.framebuffer_texture);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.useProgram(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        
        //#endregion
        /* **************************************************************************************
         =========================== Final pass of Fullscreen Quad [default framebuffer] ===========================
        ***************************************************************************************** */
        
        //#region God Ray Light2
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_blackL2FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // pass view matrix to the scene drawing
        bharatNatyaMandir.draw(viewMatrix, this.fourier_fboDetails.framebuffer_texture, lightSpaceMatrix, false, 1, 1);

        ////draw animated model
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, values.godray_light2Alpha);
        animatedModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        ////draw static models
        staticModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        //gl.vertexAttrib3f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_light2FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var grs = godRayShader.use();
        gl.uniform4fv(grs.lightPositionUniform, values.god_rayLightPosition2);
        
        gl.uniform1f(grs.decayUniform, values.gr_decay);
        gl.uniform1f(grs.densityUniform, values.gr_density);
        gl.uniform1f(grs.exposureUniform, values.gr_exposure);
        gl.uniform1f(grs.weightUniform, values.gr_weight);
        gl.uniform2f(grs.lightPositionOffsetUniform, values.gr_offsets[1][0], values.gr_offsets[1][1]);

        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition2[0], values.god_rayLightPosition2[1], values.god_rayLightPosition2[2]]);
        
        gl.uniformMatrix4fv(grs.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(grs.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(grs.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_blackL2FBODetails.framebuffer_texture);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.useProgram(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);        

        //#endregion

        //#region God Ray Light3
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_blackL3FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // pass view matrix to the scene drawing
        bharatNatyaMandir.draw(viewMatrix, this.fourier_fboDetails.framebuffer_texture
            ,lightSpaceMatrix, false, 1, 2);

        ////draw animated model
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, values.godray_light3Alpha);
        animatedModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        ////draw static models
        staticModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        //gl.vertexAttrib3f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_light3FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var grs = godRayShader.use();
        gl.uniform4fv(grs.lightPositionUniform, values.god_rayLightPosition3);
        
        gl.uniform1f(grs.decayUniform, values.gr_decay);
        gl.uniform1f(grs.densityUniform, values.gr_density_light34);
        gl.uniform1f(grs.exposureUniform, values.gr_exposure);
        gl.uniform1f(grs.weightUniform, values.gr_weight);
        gl.uniform2f(grs.lightPositionOffsetUniform, values.gr_offsets[2][0], values.gr_offsets[2][1]);

        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition3[0], values.god_rayLightPosition3[1], values.god_rayLightPosition3[2]]);
        
        gl.uniformMatrix4fv(grs.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(grs.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(grs.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_blackL3FBODetails.framebuffer_texture);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.useProgram(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        //#endregion

        //#region Light 4

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_blackL4FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // pass view matrix to the scene drawing
        bharatNatyaMandir.draw(viewMatrix, this.fourier_fboDetails.framebuffer_texture
            ,lightSpaceMatrix, false, 1, 3);

        ////draw animated model
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, values.godray_light4Alpha);
        animatedModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        ////draw static models
        staticModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        //gl.vertexAttrib3f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_light4FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var grs = godRayShader.use();
        gl.uniform4fv(grs.lightPositionUniform, values.god_rayLightPosition4);
        
        gl.uniform1f(grs.decayUniform, values.gr_decay);
        gl.uniform1f(grs.densityUniform, values.gr_density_light34);
        gl.uniform1f(grs.exposureUniform, values.gr_exposure);
        gl.uniform1f(grs.weightUniform, values.gr_weight);
        gl.uniform2f(grs.lightPositionOffsetUniform, values.gr_offsets[3][0], values.gr_offsets[3][1]);

        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition4[0], values.god_rayLightPosition4[1], values.god_rayLightPosition4[2]]);
        
        gl.uniformMatrix4fv(grs.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(grs.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(grs.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_blackL4FBODetails.framebuffer_texture);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.useProgram(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);

        //#endregion

        // Foco From Scene 4 
        /*
         */
        /* **************************************************************************************
         =========================== 1st pass for GodRays (Black Scene) ===========================
        ***************************************************************************************** */

        // GodRay Black Scene
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_blackL5FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // pass view matrix to the scene drawing
        // Draw Bharat natya
        bharatNatyaMandir.draw(viewMatrix, this.fourier_fboDetails.framebuffer_texture, lightSpaceMatrix, false, 1, 4, 1.0, true); 

        ////draw animated model
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, 1.0);
        //draw animated model
        animatedModels.draw(viewMatrix, lightSpaceMatrix, false, 1);

        ////draw static models
        staticModels.draw(viewMatrix, lightSpaceMatrix, false, 1, true);

        //gl.vertexAttrib3f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);


        /* **************************************************************************************
         =========================== 2nd pass for GodRays (Actual Colored Scene) ===========================
        ***************************************************************************************** */

        // GodRay Color Scene
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_sceneFBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // pass view matrix to the scene drawing
        if (frameCount >= 11531) {
            bharatNatyaMandir.draw(viewMatrix, this.fourier_fboDetails.framebuffer_texture, lightSpaceMatrix, false, 0, 0, 1.0, true);
        }
        else
        {
            
            bharatNatyaMandir.draw(viewMatrix, this.fourier_fboDetails.framebuffer_texture, lightSpaceMatrix, false, 0, 0, 1.0, false);
        }
        
        ////draw animated model

        animatedModels.draw(viewMatrix, lightSpaceMatrix, false, 0);

        ////draw static models
        staticModels.draw(viewMatrix, lightSpaceMatrix, false, 0, true);

        //cloth draw
        cloth_var.draw(viewMatrix);
        
        gl.vertexAttrib3f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // =========================== 2nd pass for shadows (actual scene) ===========================

        //clear the color and depth buffer
        //// pass view matrix to the scene drawing
        //
        // God Rays Main Processing Shader
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.godRay_light5FBODetails.framebuffer_obj);
        gl.viewport(0, 0, values.fourier_fbo_width, values.fourier_fbo_height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var grs = godRayShader.use();
        gl.uniform4fv(grs.lightPositionUniform, values.god_rayLightPosition5);

        gl.uniform1f(grs.decayUniform, values.gr_decay);
        gl.uniform1f(grs.densityUniform, values.gr_foco_density);
        gl.uniform1f(grs.exposureUniform, values.gr_exposure);
        gl.uniform1f(grs.weightUniform, values.gr_weight);
        gl.uniform2f(grs.lightPositionOffsetUniform, values.gr_offsets[4][0], values.gr_offsets[4][1]);

        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition5[0], values.god_rayLightPosition5[1], values.god_rayLightPosition5[2]]);
        //mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5 ]);

        gl.uniformMatrix4fv(grs.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(grs.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(grs.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_blackL5FBODetails.framebuffer_texture);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.useProgram(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        //#endregion

        // Final God Ray Full Screnn Quad Textures Addition in default frame buffer

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var fsq = fsQuadShader.use();

        gl.uniform1i(fsq.isGodRayUniform, 1);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_FBODetails.framebuffer_texture);
        gl.uniform1i(fsq.textureSampler_fp0Uniform, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_light2FBODetails.framebuffer_texture);
        gl.uniform1i(fsq.textureSampler_fp1Uniform, 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_light3FBODetails.framebuffer_texture);
        gl.uniform1i(fsq.textureSampler_fp2Uniform, 2);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_light4FBODetails.framebuffer_texture);
        gl.uniform1i(fsq.textureSampler_fp3Uniform, 3);

        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_light5FBODetails.framebuffer_texture);
        gl.uniform1i(fsq.textureSampler_fp4Uniform, 4);

        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, this.godRay_sceneFBODetails.framebuffer_texture);
        gl.uniform1i(fsq.textureSampler_fp5Uniform, 5);
        quad.draw();
        gl.useProgram(null);

        gl.bindTexture(gl.TEXTURE_2D, null);
    },

    update: function () {

        //total frame count

        //geometry
        bharatNatyaMandir.update();
        animatedModels.update();

        if (values.fourier_stroke_enable == 1)
            fourier.update();

        cloth_var.update();

        // update camera
        if (frameCount == 4300) {
        // if (frameCount == 3900) {
            this.state = sceneTwoStates.CENTER_CAMERA_MOVE_FORWARD;
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_MOVE_FORWARD) && (currentCamera.eye[2] > 80.0)) {
            currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 72.0, 0.001);
            currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 1.0, 0.001);
            // currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 72.0, 0.003);
            // currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 1.0, 0.003);
        }

        if (frameCount == 5800) {
        // if (frameCount == 4400) {
            values.clothTranslateEnable = 1;
        }

        // if (frameCount == 7780) {   // actual 5880 according to storyboard
        //     this.state = sceneTwoStates.RIGHT_CAMERA_STAGE;
        //     // currentCamera = camera3;
        // }

        // if ((this.state == sceneTwoStates.RIGHT_CAMERA_STAGE) && (currentCamera.eye[0] < 30.0)) {
        //     new Camera([11.0, -5.0, 30.0], [30.0, -5.0, 10.0], [0.0, 1.0, 0.0]);
        //     currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 0.0, 0.01);
        //     currentCamera.center[1] = currentCamera.preciselerp(currentCamera.center[1], 4.0, 0.01);
        //     currentCamera.center[2] = currentCamera.preciselerp(currentCamera.center[2], 10.0, 0.01);

        //     currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 30.0, 0.01);
        //     currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 4.0, 0.01);
        //     currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 60.0, 0.01);
        // }

        // if (frameCount == 8800) { // actual 7220 according to storyboard
        //     this.state = sceneTwoStates.CENTER_CAMERA_MID;
        // }

        // if ((this.state == sceneTwoStates.CENTER_CAMERA_MID) && (currentCamera.eye[0] >= 0.0)) {
        //     currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 0.0, 0.01);
        //     currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 0.0, 0.01);
        // }

        // if ((this.state == sceneTwoStates.CENTER_CAMERA_MID) && (currentCamera.eye[1] <= 1.0)) {
        //     currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 1.0, 0.01);
        //     currentCamera.center[1] = currentCamera.preciselerp(currentCamera.center[1], 0.0, 0.01);
        // }

        // if ((this.state == sceneTwoStates.CENTER_CAMERA_MID) && (currentCamera.eye[2] <= 80.0)) {
        //     currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 100.0, 0.01);
        //     currentCamera.center[2] = currentCamera.preciselerp(currentCamera.center[2], 7.9, 0.01);
        // }

        // if (frameCount == 9400) {
        if (frameCount == 7400) {
        // if (frameCount == 5400) {
            this.state = sceneTwoStates.CENTER_CAMERA_MID_LEFT_ZOOM;
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_MID_LEFT_ZOOM) && (currentCamera.eye[0] > -20.0)) {
            currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], -15.0, 0.004);
            currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], -15.0, 0.004);
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_MID_LEFT_ZOOM) && (currentCamera.eye[2] > 65.0)) {
            currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 4.0, 0.004);
            currentCamera.center[1] = currentCamera.preciselerp(currentCamera.center[1], 4.0, 0.004);
            currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 20.0, 0.0004);
            currentCamera.center[2] = currentCamera.preciselerp(currentCamera.center[2], 20.0, 0.0004);
        }

        // if (frameCount == 10800) {
        if (frameCount == 8400) {
        // if (frameCount == 6400) {
            this.state = sceneTwoStates.CENTER_CAMERA_MID_PAN_RIGHT;
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_MID_PAN_RIGHT) && (currentCamera.eye[0] <= 0.0)) {
            currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 40.0, 0.001);
            currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 40.0, 0.001);
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_MID_PAN_RIGHT) && (currentCamera.eye[0] > 0.0)) {
            currentCamera.eye[0] = 0.0;
            values.fourier_stroke_enable = 1;
            this.state = sceneTwoStates.CENTER_CAMERA_MID_RIGHT_ZOOM;
        }

        /*if (frameCount == 11200) { // actual 8220 according to storyboard
             this.state = sceneTwoStates.LEFT_CAMERA_STAGE;
             currentCamera = camera1;
        }*/

        // temp removal
        /*if (frameCount == 11500) {
            values.fourier_stroke_enable = 1;
            this.state = sceneTwoStates.CENTER_CAMERA_MID_RIGHT_ZOOM;
        }*/

        if ((this.state == sceneTwoStates.CENTER_CAMERA_MID_RIGHT_ZOOM) && (currentCamera.eye[0] > -10.0)) {
            // new Camera([11.0, -5.0, 30.0], [30.0, -5.0, 10.0], [0.0, 1.0, 0.0]);
            // currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 30.0, 0.01);
            // currentCamera.center[1] = currentCamera.preciselerp(currentCamera.center[1], 4.0, 0.01);
            // currentCamera.center[2] = currentCamera.preciselerp(currentCamera.center[2], -20.0, 0.01);
            // currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 15.0, 0.01);
            // currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 4.0, 0.01);
            // currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 55.0, 0.01);

            // yet zoom
            currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 30.0, 0.01);
            currentCamera.center[1] = currentCamera.preciselerp(currentCamera.center[1], 4.0, 0.01);
            currentCamera.center[2] = currentCamera.preciselerp(currentCamera.center[2], -20.0, 0.01);
            currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 18.0, 0.01);
            currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 5.0, 0.01);
            currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 52.0, 0.01);

            // new Camera([11.0, -5.0, 30.0], [30.0, -5.0, 10.0], [0.0, 1.0, 0.0]);

            // currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 30.0, 0.01);
            // currentCamera.center[1] = currentCamera.preciselerp(currentCamera.center[1], -4.0, 0.01);
            // currentCamera.center[2] = currentCamera.preciselerp(currentCamera.center[2], 10.0, 0.01);

            // currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 11.0, 0.01);
            // currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], -4.0, 0.01);
            // currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 30.0, 0.01);

            
        }

        // if (frameCount == 11000) {
        //     this.state = sceneTwoStates.CENTER_CAMERA_MID_LEFT_BACK;
        // }

        // if ((this.state == sceneTwoStates.CENTER_CAMERA_MID_LEFT_BACK) && (currentCamera.eye[0] > 0.0)) {
        //     currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 0.0, 0.001);
        //     currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 0.0, 0.001);
        // }

        // if ((this.state == sceneTwoStates.CENTER_CAMERA_MID_LEFT_BACK) && (currentCamera.eye[2] < 80.0)) {
        //     currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 0.0, 0.001);
        //     currentCamera.center[1] = currentCamera.preciselerp(currentCamera.center[1], 0.0, 0.001);
        //     currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 80.0, 0.0005);
        //     currentCamera.center[2] = currentCamera.preciselerp(currentCamera.center[2], 80.0, 0.0005);
        // }

        // if (frameCount == 13000) {
        //     this.state = sceneTwoStates.CENTER_CAMERA_MID_PAN_RIGHT_BACK;
        // }

        // if ((this.state == sceneTwoStates.CENTER_CAMERA_MID_PAN_RIGHT_BACK) && (currentCamera.eye[0] <= 40.0)) {
        //     currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 40.0, 0.001);
        //     currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 40.0, 0.001);
        // }

        /*if (frameCount == 14500) { // actual 12900 according to storyboard
            this.state = sceneTwoStates.CENTER_CAMERA_END;
            currentCamera = restoreCamera;
        }*/

        if (frameCount == 10400) {
        // if (frameCount == 9150) {
            this.state = sceneTwoStates.CENTER_CAMERA_END_ZOOM_OUT;
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_END_ZOOM_OUT) && (currentCamera.eye[0] >= 0.0)) {
            currentCamera.eye[0] = currentCamera.preciselerp(currentCamera.eye[0], 0.0, 0.01);
            currentCamera.center[0] = currentCamera.preciselerp(currentCamera.center[0], 0.0, 0.01);
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_END_ZOOM_OUT) && (currentCamera.eye[1] <= 1.0)) {
            currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 1.0, 0.01);
            currentCamera.center[1] = currentCamera.preciselerp(currentCamera.center[1], 0.0, 0.01);
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_END_ZOOM_OUT) && (currentCamera.eye[2] <= 80.0)) {
            currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 100.0, 0.001);
            currentCamera.center[2] = currentCamera.preciselerp(currentCamera.center[2], 7.9, 0.001);
        }

        if (frameCount == 14500) {
            this.state = sceneTwoStates.CENTER_CAMERA_MOVE_BACKWARD;
        }

        if ((this.state == sceneTwoStates.CENTER_CAMERA_MOVE_BACKWARD) && (currentCamera.eye[2] < 100.0)) {
            currentCamera.eye[2] = currentCamera.preciselerp(currentCamera.eye[2], 100.0, 0.001);
            currentCamera.eye[1] = currentCamera.preciselerp(currentCamera.eye[1], 15.0, 0.001);
        }
    },

    uninit: function () {

        //geometry unit
        bharatNatyaMandir.uninit();
        staticModels.uninit();
        animatedModels.uninit();
        fourier.uninit();
        cloth_var.uninit();

        //textures unint
        if (this.godRay_Texture) {
            gl.deleteTexture(this.godRay_Texture);
            this.godRay_Texture = null;
        }

        if (this.godRay_sceneTexture) {
            gl.deleteTexture(this.godRay_sceneTexture);
            this.godRay_sceneTexture = null;
        }

        if (this.godRay_blackSceneTexture) {
            gl.deleteTexture(this.godRay_blackSceneTexture);
            this.godRay_blackSceneTexture = null;
        }

        if (this.godRay_blackL2SceneTexture) {
            gl.deleteTexture(this.godRay_blackL2SceneTexture);
            this.godRay_blackL2SceneTexture = null;
        }

        if (this.godRay_light2Texture) {
            gl.deleteTexture(this.godRay_light2Texture);
            this.godRay_light2Texture = null;
        }

        if (this.godRay_blackL3SceneTexture) {
            gl.deleteTexture(this.godRay_blackL3SceneTexture);
            this.godRay_blackL3SceneTexture = null;
        }

        if (this.godRay_light3Texture) {
            gl.deleteTexture(this.godRay_light3Texture);
            this.godRay_light3Texture = null;
        }

        if (this.godRay_blackL4SceneTexture) {
            gl.deleteTexture(this.godRay_blackL4SceneTexture);
            this.godRay_blackL4SceneTexture = null;
        }

        if (this.godRay_light4Texture) {
            gl.deleteTexture(this.godRay_light4Texture);
            this.godRay_light4Texture = null;
        }

        if (this.godRay_blackL5SceneTexture) {
            gl.deleteTexture(this.godRay_blackL5SceneTexture);
            this.godRay_blackL5SceneTexture = null;
        }

        if (this.godRay_light5Texture) {
            gl.deleteTexture(this.godRay_light5Texture);
            this.godRay_light5Texture = null;
        }

        // rbo uninit
        if (this.godRay_Rbo) {
            gl.deleteRenderbuffer(this.godRay_Rbo);
            this.godRay_Rbo = null;
        }
        if (this.godRay_sceneRbo) {
            gl.deleteRenderbuffer(this.godRay_sceneRbo);
            this.godRay_sceneRbo = null;
        }

        if (this.godRay_blackRbo) {
            gl.deleteRenderbuffer(this.godRay_blackRbo);
            this.godRay_blackRbo = null;
        }

        if (this.godRay_blackL2Rbo) {
            gl.deleteRenderbuffer(this.godRay_blackL2Rbo);
            this.godRay_blackL2Rbo = null;
        }

        if (this.godRay_light2Rbo) {
            gl.deleteRenderbuffer(this.godRay_light2Rbo);
            this.godRay_light2Rbo = null;
        }

        if (this.godRay_blackL3Rbo) {
            gl.deleteRenderbuffer(this.godRay_blackL3Rbo);
            this.godRay_blackL3Rbo = null;
        }

        if (this.godRay_light3Rbo) {
            gl.deleteRenderbuffer(this.godRay_light3Rbo);
            this.godRay_light3Rbo = null;
        }

        if (this.godRay_blackL4Rbo) {
            gl.deleteRenderbuffer(this.godRay_blackL4Rbo);
            this.godRay_blackL4Rbo = null;
        }

        if (this.godRay_light4Rbo) {
            gl.deleteRenderbuffer(this.godRay_light4Rbo);
            this.godRay_light4Rbo = null;
        }

        if (this.godRay_blackL5Rbo) {
            gl.deleteRenderbuffer(this.godRay_blackL5Rbo);
            this.godRay_blackL5Rbo = null;
        }

        if (this.godRay_light2Rbo) {
            gl.deleteRenderbuffer(this.godRay_light2Rbo);
            this.godRay_light2Rbo = null;
        }

        //fbo uninit
        
        if (this.godRay_Fbo) {
            gl.deleteFramebuffer(this.godRay_Fbo);
            this.godRay_Fbo = null;
        }
        if (this.godRay_blackFbo) {
            gl.deleteFramebuffer(this.godRay_blackFbo);
            this.godRay_blackFbo = null;
        }
        if (this.godRay_blackL2Fbo) {
            gl.deleteFramebuffer(this.godRay_blackL2Fbo);
            this.godRay_blackL2Fbo = null;
        }
        if (this.godRay_light2Fbo) {
            gl.deleteFramebuffer(this.godRay_light2Fbo);
            this.godRay_light2Fbo = null;
        }

        if (this.godRay_blackL3Fbo) {
            gl.deleteFramebuffer(this.godRay_blackL3Fbo);
            this.godRay_blackL3Fbo = null;
        }
        if (this.godRay_light3Fbo) {
            gl.deleteFramebuffer(this.godRay_light3Fbo);
            this.godRay_light3Fbo = null;
        }
        if (this.godRay_blackL4Fbo) {
            gl.deleteFramebuffer(this.godRay_blackL4Fbo);
            this.godRay_blackL4Fbo = null;
        }
        if (this.godRay_light4Fbo) {
            gl.deleteFramebuffer(this.godRay_light4Fbo);
            this.godRay_light4Fbo = null;
        }

        if (this.godRay_blackL4Fbo) {
            gl.deleteFramebuffer(this.godRay_blackL4Fbo);
            this.godRay_blackL4Fbo = null;
        }
        if (this.godRay_light4Fbo) {
            gl.deleteFramebuffer(this.godRay_light4Fbo);
            this.godRay_light4Fbo = null;
        }

        if (this.godRay_blackL5Fbo) {
            gl.deleteFramebuffer(this.godRay_blackL5Fbo);
            this.godRay_blackL5Fbo = null;
        }
        if (this.godRay_light5Fbo) {
            gl.deleteFramebuffer(this.godRay_light5Fbo);
            this.godRay_light5Fbo = null;
        }

        if (this.godRay_sceneFbo) {
            gl.deleteFramebuffer(this.godRay_sceneFbo);
            this.godRay_sceneFbo = null;
        }
        
        // Left - Amber
    }

};
