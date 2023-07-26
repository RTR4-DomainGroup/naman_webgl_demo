/*********** Bharat Natya Mandir Drawing ***********/   

var bharatNatyaMandir = {

    perspectiveProjectionMatrix: mat4.create(),

    //texture variables
    marbleTex: 0,
    stage_curtain: 0,
    black_curtain: 0,
    wingTex: 0,
    stage_foot_wall: [],
    floorTex: 0,
    pitTex: [],
    TexTheaterRoof: 0,
    sideWallTex: 0,
    wallDesignedTex: 0,
    designedPillerTex: 0,
    centerPillerTex: 0,
    sideTile: 0,
    topBorderTex: 0,
    sideBorder: 0,
    pitDoorTex: 0,
    natrajTex: 0,
    standTex: 0,
    doorTex: 0,
    shlokaTex: 0,
    sphere: null,
    //update variables
    angle: 0,

    exposure5: 0.8,

    init: function () {

        //init the geometry
        cube.init();
        quad.init();
        this.sphere = new Mesh();
        makeSphere(this.sphere, 1.5, 60, 60);
        //load textures
        this.floorTex = loadTexture("res/textures/bharatNatyaMandir/floor.png");
        this.marbleTex = loadTexture("res/textures/bharatNatyaMandir/Marble.png");
        this.stage_curtain = loadTexture("res/textures/bharatNatyaMandir/stage_curtain.jpg");
        this.wingTex = loadTexture("res/textures/bharatNatyaMandir/wings.jpg");
        this.black_curtain = loadTexture("res/textures/bharatNatyaMandir/black_curtain.jpg");

        this.stage_foot_wall.push(
            loadTexture("res/textures/bharatNatyaMandir/wall.png"),
            loadTexture("res/textures/bharatNatyaMandir/stage_foot_wall.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/stage_foot_wall.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/stage_foot_wall.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/stageFloor.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/stageFloor.jpg")
        );

        this.pitTex.push(
            loadTexture("res/textures/bharatNatyaMandir/stage_foot_wall.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/wall.png.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/stage_foot_wall.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/wall.png.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/pit_top.jpg"),
            loadTexture("res/textures/bharatNatyaMandir/pit_top.png"),
        );

        this.TexTheaterRoof = loadTexture("res/textures/bharatNatyaMandir/audi_roof.jpg");
        this.topBorderTex = loadTexture("res/textures/bharatNatyaMandir/border.png");
        this.sideBorder = loadTexture("res/textures/bharatNatyaMandir/stage_foot_wall.jpg");
        this.sideWallTex = loadTexture("res/textures/bharatNatyaMandir/wall.png");
        this.wallDesignedTex = loadTexture("res/textures/bharatNatyaMandir/sideWallDesign.jpg");
        this.designedPillerTex = loadTexture("res/textures/bharatNatyaMandir/designedPiller.jpg");
        this.centerPillerTex = loadTexture("res/textures/bharatNatyaMandir/centerDesignedPiller.jpg");
        this.sideTile = loadTexture("res/textures/bharatNatyaMandir/sideTile.jpg");
        this.pitDoorTex = loadTexture("res/textures/bharatNatyaMandir/pitDoor.jpg");
        this.natrajTex = loadTexture("res/textures/bharatNatyaMandir/Natraj.jpg");
        this.standTex = loadTexture("res/textures/bharatNatyaMandir/boardStand.jpg");
        this.doorTex = loadTexture("res/textures/bharatNatyaMandir/door.jpg");
        this.shlokaTex = loadTexture("res/textures/bharatNatyaMandir/shlok.png");

        //init the projection matrix
        perspectiveProjectionMatrix = mat4.create();
    },

    resize: function () {

       mat4.perspective(this.perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width / canvas.height), 0.1, 1000.0);

    },

    draw: function (viewMatrix, fourier_texture, lightSpaceMatrix, depthOnly, godRay_scenepass, lightNum, exposure, swaloluki) {

        var ads = adsLightShader.use();

        //START OPENGL DRAWING
        if (depthOnly) {
            // Shadow Uniforms
            gl.uniform1i(ads.actualSceneUniform, 0);
            gl.uniform1i(ads.depthSceneUniform, 1);
            gl.uniform1i(ads.depthQuadSceneUniform, 0);

            gl.uniformMatrix4fv(ads.lightSpaceMatrixUniform, false, lightSpaceMatrix);
        }

        if (!depthOnly) 
        {
            // Shadow Uniforms
            gl.uniform1i(ads.actualSceneUniform, 1);
            gl.uniform1i(ads.depthSceneUniform, 0);
            gl.uniform1i(ads.depthQuadSceneUniform, 0);

            gl.uniformMatrix4fv(ads.lightSpaceMatrixUniform, false, lightSpaceMatrix);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, values.footLightShadowFB.fbo_depth_texture);
        }

        gl.uniform1f(ads.exposureUniform, this.exposure5);

        if (values.lastSpotEnable == true) {

            this.exposure5 -= 0.00144;
            if (this.exposure5 < 0.2)
                this.exposure5 = 0.2;

        }

        gl.uniform1f(ads.alphaBlendingUniform, values.alphaSceneTwo);

        // Positional Light Related Code
        gl.uniform3fv(ads.posLAZeroUniform, values.poslightAmbientZero);
        gl.uniform3fv(ads.posLDZeroUniform, values.poslightDiffuseZero);
        gl.uniform3fv(ads.posLSZeroUniform, values.poslightSpecularZero);
        gl.uniform4fv(ads.poslightPositionZeroUniform, values.poslightPositionZero);

        gl.uniform3fv(ads.posLAOneUniform, values.poslightAmbientOne);
        gl.uniform3fv(ads.posLDOneUniform, values.poslightDiffuseOne);
        gl.uniform3fv(ads.posLSOneUniform, values.poslightSpecularOne);
        gl.uniform4fv(ads.poslightPositionOneUniform, values.poslightPositionOne);

        gl.uniform3fv(ads.posLATwoUniform, values.poslightAmbientTwo);
        gl.uniform3fv(ads.posLDTwoUniform, values.poslightDiffuseTwo);
        gl.uniform3fv(ads.posLSTwoUniform, values.poslightSpecularTwo);
        gl.uniform4fv(ads.poslightPositionTwoUniform, values.poslightPositionTwo);

        gl.uniform3fv(ads.posLAThreeUniform, values.poslightAmbientThree);
        gl.uniform3fv(ads.posLDThreeUniform, values.poslightDiffuseThree);
        gl.uniform3fv(ads.posLSThreeUniform, values.poslightSpecularThree);
        gl.uniform4fv(ads.poslightPositionThreeUniform, values.poslightPositionThree);

        // Positional Light Diffuse Factor
        gl.uniform1f(ads.alphaPoslightZeroUniform, values.alphaPoslightZero);
        gl.uniform1f(ads.alphaPoslightOneUniform, values.alphaPoslightOne);
        gl.uniform1f(ads.alphaPoslightTwoUniform, values.alphaPoslightTwo);
        gl.uniform1f(ads.alphaPoslightThreeUniform, values.alphaPoslightThree);

        gl.uniform1f(ads.kShininessUniform, values.materialShininess);
        gl.uniform1i(ads.godRay_sceneUniform, godRay_scenepass);

        var modelMatrix = mat4.create();

        if(godRay_scenepass == 1)
        {
            /* Sphere for God Rays */
            
            if (lightNum == 0)
            {
                gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 0.6, 0.0, values.godray_light1Alpha);

                mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition[0], values.god_rayLightPosition[1], values.god_rayLightPosition[2]]);    
            }
            else if(lightNum == 1)
            {
                gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 0.0, 0.0, values.godray_light2Alpha);

                mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition2[0], values.god_rayLightPosition2[1], values.god_rayLightPosition2[2]]);
            }
            else if(lightNum == 2)
            {
                gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0, values.godray_light3Alpha);

                mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition3[0], values.god_rayLightPosition3[1], values.god_rayLightPosition3[2]]);
            }
            else if(lightNum == 3)
            {
                gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0, values.godray_light4Alpha);

                mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition4[0], values.god_rayLightPosition4[1], values.god_rayLightPosition4[2]]);
            }
            else if(lightNum == 4)
            {
                gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0, values.godray_light5Alpha);

                mat4.translate(modelMatrix, modelMatrix, [values.god_rayLightPosition5[0], values.god_rayLightPosition5[1], values.god_rayLightPosition5[2]]);
            }
            
            //mat4.scale(modelMatrix, modelMatrix, [0.75, 0.75, 0.75]);
            gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
            gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
            gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
            this.sphere.draw();
        }
        else
        {
            gl.vertexAttrib3f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);
        }

        // Spotlight Related Code
        gl.uniform3fv(ads.spotlightLAZeroUniform, values.spotlightAmbientZero);
        gl.uniform3fv(ads.spotlightLDZeroUniform, values.spotlightDiffuseZero);
        gl.uniform3fv(ads.spotlightLSZeroUniform, values.spotlightSpecularZero);
        gl.uniform4fv(ads.spotlightPositionZeroUniform, values.spotlightPositionZero);
        gl.uniform3fv(ads.spotDirectionZeroUniform, values.spotDirectionZero);
        gl.uniform1f(ads.constantAttenuationZeroUniform, values.constantAttenuationZero);
        gl.uniform1f(ads.linearAttenuationZeroUniform, values.linearAttenuationZero);
        gl.uniform1f(ads.quadraticAttenuationZeroUniform, values.quadraticAttenuationZero);
        gl.uniform1f(ads.spotCosCutoffZeroUniform, values.spotCosCutoffZero);
        gl.uniform1f(ads.spotCosOuterCutoffZeroUniform, values.spotCosOuterCutoffZero);

        gl.uniform3fv(ads.spotlightLAOneUniform, values.spotlightAmbientOne);
        gl.uniform3fv(ads.spotlightLDOneUniform, values.spotlightDiffuseOne);
        gl.uniform3fv(ads.spotlightLSOneUniform, values.spotlightSpecularOne);
        gl.uniform4fv(ads.spotlightPositionOneUniform, values.spotlightPositionOne);
        gl.uniform3fv(ads.spotDirectionOneUniform, values.spotDirectionOne);
        gl.uniform1f(ads.constantAttenuationOneUniform, values.constantAttenuationOne);
        gl.uniform1f(ads.linearAttenuationOneUniform, values.linearAttenuationOne);
        gl.uniform1f(ads.quadraticAttenuationOneUniform, values.quadraticAttenuationOne);
        gl.uniform1f(ads.spotCosCutoffOneUniform, values.spotCosCutoffOne);
        gl.uniform1f(ads.spotCosOuterCutoffOneUniform, values.spotCosOuterCutoffOne);

        gl.uniform3fv(ads.spotlightLATwoUniform, values.spotlightAmbientTwo);
        gl.uniform3fv(ads.spotlightLDTwoUniform, values.spotlightDiffuseTwo);
        gl.uniform3fv(ads.spotlightLSTwoUniform, values.spotlightSpecularTwo);
        gl.uniform4fv(ads.spotlightPositionTwoUniform, values.spotlightPositionTwo);
        gl.uniform3fv(ads.spotDirectionTwoUniform, values.spotDirectionTwo);
        gl.uniform1f(ads.constantAttenuationTwoUniform, values.constantAttenuationTwo);
        gl.uniform1f(ads.linearAttenuationTwoUniform, values.linearAttenuationTwo);
        gl.uniform1f(ads.quadraticAttenuationTwoUniform, values.quadraticAttenuationTwo);
        gl.uniform1f(ads.spotCosCutoffTwoUniform, values.spotCosCutoffTwo);
        gl.uniform1f(ads.spotCosOuterCutoffTwoUniform, values.spotCosOuterCutoffTwo);
                
        gl.uniform3fv(ads.spotlightLAThreeUniform, values.spotlightAmbientThree);
        gl.uniform3fv(ads.spotlightLDThreeUniform, values.spotlightDiffuseThree);
        gl.uniform3fv(ads.spotlightLSThreeUniform, values.spotlightSpecularThree);
        gl.uniform4fv(ads.spotlightPositionThreeUniform, values.spotlightPositionThree);
        gl.uniform3fv(ads.spotDirectionThreeUniform, values.spotDirectionThree);
        gl.uniform1f(ads.constantAttenuationThreeUniform, values.constantAttenuationThree);
        gl.uniform1f(ads.linearAttenuationThreeUniform, values.linearAttenuationThree);
        gl.uniform1f(ads.quadraticAttenuationThreeUniform, values.quadraticAttenuationThree);
        gl.uniform1f(ads.spotCosCutoffThreeUniform, values.spotCosCutoffThree);
        gl.uniform1f(ads.spotCosOuterCutoffThreeUniform, values.spotCosOuterCutoffThree);

        gl.uniform3fv(ads.spotlightLAFourUniform, values.spotlightAmbientFour);
        gl.uniform3fv(ads.spotlightLDFourUniform, values.spotlightDiffuseFour);
        gl.uniform3fv(ads.spotlightLSFourUniform, values.spotlightSpecularFour);
        gl.uniform4fv(ads.spotlightPositionFourUniform, values.spotlightPositionFour);
        gl.uniform3fv(ads.spotDirectionFourUniform, values.spotDirectionFour);
        gl.uniform1f(ads.constantAttenuationFourUniform, values.constantAttenuationFour);
        gl.uniform1f(ads.linearAttenuationFourUniform, values.linearAttenuationFour);
        gl.uniform1f(ads.quadraticAttenuationFourUniform, values.quadraticAttenuationFour);
        gl.uniform1f(ads.spotCosCutoffFourUniform, values.spotCosCutoffFour);
        gl.uniform1f(ads.spotCosOuterCutoffFourUniform, values.spotCosOuterCutoffFour);

        // Spotlight Diffuse Factor
        gl.uniform1f(ads.alphaSpotlightZeroUniform, values.alphaSpotlightZero);
        gl.uniform1f(ads.alphaSpotlightOneUniform, values.alphaSpotlightOne);
        gl.uniform1f(ads.alphaSpotlightTwoUniform, values.alphaSpotlightTwo);
        gl.uniform1f(ads.alphaSpotlightThreeUniform, values.alphaSpotlightThree);
        gl.uniform1f(ads.alphaSpotlightFourUniform, values.alphaSpotlightFour);

        /* Draw Surface */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.floorTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, -27.5, 50.0]);
        mat4.scale(modelMatrix, modelMatrix, [100.0, 1.0, 36.0]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        this.drawSurface(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Draw Surface 2 */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.floorTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, -20.2, 145.5]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-97.0));
        mat4.scale(modelMatrix, modelMatrix, [100.0, 60.0, 1.0]);        
        this.drawSurface(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        modelMatrix = mat4.create();
        /* Stage back curtain */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.stage_curtain);

        mat4.translate(modelMatrix, modelMatrix, [0.0, 5.0, -16.0]);
        mat4.scale(modelMatrix, modelMatrix, [60.0, 26.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Base Stage */
        stageHeight = 4.5;
        stageTranslateY = 22.0;
        stageLengthX = 60.0;

        gl.activeTexture(gl.TEXTURE1);
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, -stageTranslateY, 9.0]);
        mat4.scale(modelMatrix, modelMatrix, [stageLengthX, stageHeight, 25.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawMultipleTex(this.stage_foot_wall);
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Pit Stage */
        pitLength = 7.0;
        pitTranslateX = (stageLengthX + pitLength) / 2;
        pitSizeX = (stageLengthX - pitLength)/2;
        
        /* Left Pit */
        gl.activeTexture(gl.TEXTURE1);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-pitTranslateX, -stageTranslateY, 37.0]);
        mat4.scale(modelMatrix, modelMatrix, [pitSizeX, stageHeight, 3.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawMultipleTex(this.pitTex);
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Right Pit*/
        gl.activeTexture(gl.TEXTURE1);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [pitTranslateX, -stageTranslateY, 37.0]);
        mat4.scale(modelMatrix, modelMatrix, [pitSizeX, stageHeight, 3.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawMultipleTex(this.pitTex);
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Pit Door */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.pitDoorTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, -stageTranslateY, 39.0]);
        mat4.scale(modelMatrix, modelMatrix, [7.0, stageHeight, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);


        /* Stage Roof */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.stage_curtain);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, 32.5, 10.0]);
        mat4.scale(modelMatrix, modelMatrix, [stageLengthX, 1.0, 30.0]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Stage Border */
        /* Left */
        borderSize = 4.0;
        borderTranslateX = stageLengthX - borderSize;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideBorder);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-borderTranslateX, 0.0, 40.0]);
        mat4.scale(modelMatrix, modelMatrix, [borderSize, 31.0, 1.0]);
        this.drawStageBorder(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Right */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideBorder);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [borderTranslateX, 0.0, 40.0]);
        mat4.scale(modelMatrix, modelMatrix, [borderSize, 31.0, 1.0]);
        this.drawStageBorder(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Stage Top */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.topBorderTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, 44.0, 40.0]);
        mat4.scale(modelMatrix, modelMatrix, [stageLengthX, 13.0, 1.0]);
        this.drawStageBorder(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);


        /* Side Wing */
        sideWingTranslateX = 56.0;
        sideWingTranslateY = 5.0;
        sideWingTranslateZ = -4.0;
       
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.wingTex);

        /* Right */
        for (i = 0; i < 4; i++) {
            var modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, [sideWingTranslateX, sideWingTranslateY, sideWingTranslateZ]);
            this.drawSideWings(ads, modelMatrix, viewMatrix);

            sideWingTranslateZ = sideWingTranslateZ + 12.0;
        }

        /* Left */
        sideWingTranslateZ = -4.0;

        for (i = 0; i < 4; i++)
        {
            var modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, [-sideWingTranslateX, sideWingTranslateY, sideWingTranslateZ]);
            this.drawSideWings(ads, modelMatrix, viewMatrix);

            sideWingTranslateZ = sideWingTranslateZ + 12.0;
        }

        gl.bindTexture(gl.TEXTURE_2D, null);


        /* Top stage wing */
        sideWingTranslateZ = -4.0;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.black_curtain);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, 28.0, sideWingTranslateZ]);
        for (i = 0; i < 4; i++) {
            var modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, [0.0, 28.0, sideWingTranslateZ]);
            this.drawTopWings(ads, modelMatrix, viewMatrix);

            sideWingTranslateZ = sideWingTranslateZ + 12.0;
        }

        gl.bindTexture(gl.TEXTURE_2D, null);


        /* Wall Behind wings */
        /* Left */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.stage_curtain);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-63.5, 0.0, 10.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(90.0));
        mat4.scale(modelMatrix, modelMatrix, [28.0, 57.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);


        /* Right */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.stage_curtain);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [60.5, 0.0, 10.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(90.0));
        mat4.scale(modelMatrix, modelMatrix, [28.0, 57.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);


        ///* Upper Wall designed quad */
        ///* Left Upper*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.wallDesignedTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-77.0, 40.0, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 17.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Left Middle*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideWallTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-77.0, 10.5, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 12.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Left Lower*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideTile);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-77.0, -19.0, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 17.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Left black strip lower */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.stage_curtain);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-77.3, 0.0, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 3.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Left black strip upper */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.stage_curtain);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-77.3, 23.0, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 3.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Upper Wall designed quad */
        /* Right Upper*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.wallDesignedTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [77.0, 40.0, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 17.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Right Middle*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideWallTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [77.0, 10.5, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 12.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Right Lower*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideTile);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [77.0, -19.0, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 17.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Right black strip*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.stage_curtain);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [77.3, 25.0, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 3.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Right black strip*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.stage_curtain);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [77.3, 0.0, 109.0]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 3.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-90.0));
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Right Wall Door*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.doorTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [76.6, -14.0, 74.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-90.0));
        mat4.scale(modelMatrix, modelMatrix, [11.5, 12.5, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Right hexagonal*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideBorder);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [80.0, 28.0, 38.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.scale(modelMatrix, modelMatrix, [12.0, 60.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        // bottom depth
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideBorder);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [65.0, 28.0, 35.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(43.0));
        mat4.scale(modelMatrix, modelMatrix, [8.5, 60.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        // bottom depth
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideBorder); 
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [84.0, 28.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(45.0));
        mat4.scale(modelMatrix, modelMatrix, [12.0, 60.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        // cube upper
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.designedPillerTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [74.0, 28.0, 44.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.scale(modelMatrix, modelMatrix, [12.0, 30.0, 9.0]);
        this.drawLightRoom(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // upper cube
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideWallTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [73.0, 28.0, 45.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.scale(modelMatrix, modelMatrix, [4.0, 30.0, 9.0]);
        this.drawLightRoom(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Right Piller
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideWallTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [77.0, 0.0, 146.0]);
        mat4.scale(modelMatrix, modelMatrix, [2.0, 55.0, 3.0]);
        this.drawLightRoom(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);
        

        /* Left hexagonal*/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideBorder);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-80.0, 28.0, 38.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(45.0));
        mat4.scale(modelMatrix, modelMatrix, [12.0, 60.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideBorder);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-65.0, 28.0, 35.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-43.0));
        mat4.scale(modelMatrix, modelMatrix, [8.5, 60.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideBorder);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-84.0, 28.0, 50.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.scale(modelMatrix, modelMatrix, [12.0, 60.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.designedPillerTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-74.0, 28.0, 44.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(45.0));
        mat4.scale(modelMatrix, modelMatrix, [12.0, 30.0, 9.0]);
        this.drawLightRoom(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // upper cube
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideWallTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-73.0, 28.0, 45.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(45.0));
        mat4.scale(modelMatrix, modelMatrix, [4.0, 30.0, 9.0]);
        this.drawLightRoom(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Left Piller
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideWallTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-77.0, 0.0, 146.0]);
        mat4.scale(modelMatrix, modelMatrix, [2.0, 55.0, 3.0]);
        this.drawLightRoom(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);
       
        /* Auditorium Roof */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.TexTheaterRoof);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, 56.0, 90.0]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(90.0));
        mat4.scale(modelMatrix, modelMatrix, [100.0, 90.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);


        /* Auditorium Balcony */
        //gl.activeTexture(gl.TEXTURE1);
        //gl.bindTexture(gl.TEXTURE_2D, this.TexTheaterRoof);
        //var modelMatrix = mat4.create();
        //mat4.translate(modelMatrix, modelMatrix, [0.0, 20.0,200.0]);
        //mat4.scale(modelMatrix, modelMatrix, [100.0, 1.0, 50.0]);
        //mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        //gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        //gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        //gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        //quad.draw();
        //gl.bindTexture(gl.TEXTURE_2D, null);


        /********* Light Room *********/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sideWallTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-70.0, 31.0, 85.0]);  
        mat4.scale(modelMatrix, modelMatrix, [5.0, 27.0, 10.0]);
        this.drawLightRoom(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // upper 
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.centerPillerTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-66.5, 31.0, 85.0]);
        mat4.scale(modelMatrix, modelMatrix, [2.0, 27.0, 5.0]);
        this.drawLightRoom(ads, modelMatrix, viewMatrix);
        gl.bindTexture(gl.TEXTURE_2D, null);


        /**** CANVAS Board ****/
        if (godRay_scenepass == 0) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, fourier_texture);
        }
        else
        {
            gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, values.godray_light1Alpha);
        }
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [34.0, -2.5, 10.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-5.0));
        mat4.scale(modelMatrix, modelMatrix, [10.6, 6.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        if (godRay_scenepass == 0)
            gl.bindTexture(gl.TEXTURE_2D, null);

        /**** Canvas Stand Middle****/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.standTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [36.0, -7.0, 8.0]);
        //mat4.rotateX(modelMatrix, modelMatrix, degToRad(10.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(14.0));
        mat4.scale(modelMatrix, modelMatrix, [0.6, 16.0, 0.2]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawSingleTex()
        gl.bindTexture(gl.TEXTURE_2D, null);

        /**** Canvas Stand Left ****/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.standTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [31.0, -5.5, 6.75]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(-13.0));
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(2.0));
        mat4.scale(modelMatrix, modelMatrix, [0.4, 13.0, 0.2]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawSingleTex()
        gl.bindTexture(gl.TEXTURE_2D, null);


        /**** Canvas Stand Right ****/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.standTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [37.0, -5.5, 13.0]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(15.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(-5.0));
        mat4.scale(modelMatrix, modelMatrix, [0.4, 13.0, 0.2]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawSingleTex()
        gl.bindTexture(gl.TEXTURE_2D, null);

        /**** MAHADEV Photo Border ****/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.standTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, 46.0, 40.5]);
        mat4.scale(modelMatrix, modelMatrix, [8.0, 9.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        /**** MAHADEV Photo ****/
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.natrajTex);
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, 46.0, 41.0]);
        mat4.scale(modelMatrix, modelMatrix, [7.5, 8.5, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawSingleTex()
        gl.bindTexture(gl.TEXTURE_2D, null);

        /**** SHLOKA ****/
        //gl.activeTexture(gl.TEXTURE1);
        //gl.bindTexture(gl.TEXTURE_2D, this.shlokaTex);
        //var modelMatrix = mat4.create();
        //mat4.translate(modelMatrix, modelMatrix, [0.0, 30.0, 42.5]);
        //mat4.scale(modelMatrix, modelMatrix, [58.0, 3.0, 1.0]);
        //gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        //gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        //gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        //quad.draw();
        //gl.bindTexture(gl.TEXTURE_2D, null);

        if (!depthOnly) {
            // Shadow Uniforms
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        //gl.vertexAttrib3f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);
        gl.useProgram(null);
    },

    drawSurface: function (ads, modelMatrix, viewMatrix)
    {
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
    },

    drawStageBorder: function (ads, modelMatrix, viewMatrix)
    {
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawSingleTex();
    },

    drawSideWings: function (ads, modelMatrix, viewMatrix) {
        mat4.scale(modelMatrix, modelMatrix, [5.5, 26.0, 0.3]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawSingleTex();
    },

    drawTopWings: function (ads, modelMatrix, viewMatrix) {
        mat4.scale(modelMatrix, modelMatrix, [60.0, 4.0, 1.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        quad.draw();
    },

    drawLightRoom: function (ads, modelMatrix, viewMatrix) {
        //mat4.rotateY(modelMatrix, modelMatrix, degToRad(45.0));

        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        cube.drawSingleTex();
    },

    update: function () {

        values.alphaSceneTwo = values.alphaSceneTwo + values.alphaBlendIncrement;
        if (values.alphaSceneTwo >= 1.0)
            values.alphaSceneTwo = 1.0;

        if (frameCount >= 6450 && frameCount < 8100)
        {
            this.fadeInAmberGodRay();
            values.alphaSpotlightZero = values.alphaSpotlightZero + 0.005;
            if (values.alphaSpotlightZero >= 1.0)
                values.alphaSpotlightZero = 1.0;
        }

        if (frameCount >= 8300 && frameCount < 8850)
        {
            this.fadeOutAmberGodRay();

            values.alphaSpotlightZero = values.alphaSpotlightZero - 0.005;
            if (values.alphaSpotlightZero <= 0.0)
                values.alphaSpotlightZero = 0.0;
        }

        if (frameCount >= 8750 && frameCount < 10600) 
        {
            this.fadeInRedGodRay();
            values.alphaSpotlightThree = values.alphaSpotlightThree + 0.005;
            if (values.alphaSpotlightThree >= 1.0)
                values.alphaSpotlightThree = 1.0;
        }

        if (frameCount >= 10600 && frameCount < 11100) {
            this.fadeOutRedGodRay();

            values.alphaSpotlightThree = values.alphaSpotlightThree - 0.005;
            if (values.alphaSpotlightThree <= 0.0)
                values.alphaSpotlightThree = 0.0;

        }

        if (frameCount >= 11200 && frameCount < 11850) {
            this.fadeOutRedGodRay();
            this.fadeInWhiteGodRay();

            values.alphaSpotlightOne = values.alphaSpotlightOne + 0.005;
            if (values.alphaSpotlightOne >= 1.0)
                values.alphaSpotlightOne = 1.0; 

            values.alphaSpotlightTwo = values.alphaSpotlightTwo + 0.005;
            if (values.alphaSpotlightTwo >= 1.0)
                values.alphaSpotlightTwo = 1.0;

        }

        if (frameCount > 11800 && frameCount < 14500 ) 
        {
            this.fadeOutWhiteGodRay();
            this.fadeInFocoRay();

            values.alphaSpotlightOne = values.alphaSpotlightOne - 0.005;
            if (values.alphaSpotlightOne <= 0.0)
                values.alphaSpotlightOne = 0.0;
 
            values.alphaSpotlightTwo = values.alphaSpotlightTwo - 0.005;
            if (values.alphaSpotlightTwo <= 0.0)
                values.alphaSpotlightTwo = 0.0; 

            values.alphaSpotlightFour = values.alphaSpotlightFour + 0.005;
            if (values.alphaSpotlightFour >= 1.0)
                values.alphaSpotlightFour = 1.0;
            values.lastSpotEnable = true;

        }
        if (frameCount > 14700) {
            this.fadeOutFocoRay();
            values.alphaSpotlightFour = values.alphaSpotlightFour - 0.005;
            if (values.alphaSpotlightFour < 0.0)
                values.alphaSpotlightFour = 0.0;
                
        }
        /*this.angle += 0.5;
        if (this.angle >= 360.0)
            this.angle = 0.0;*/

    },

    fadeInAmberGodRay: function ()
    {
        if (!values.godray_isAmberFadeIn) 
        {
            values.godray_light1Alpha += values.godray_fadeInFactor;
            if (values.godray_light1Alpha >= 1.0 ) {
                values.godray_light1Alpha = 1.0;
                values.godray_isAmberFadeIn = true;
            }
        }
        
    },

    fadeOutAmberGodRay: function ()
    {
        if (values.godray_isAmberFadeIn) {
            values.godray_light1Alpha -= values.godray_fadeOutFactor;
            if (values.godray_light1Alpha < 0.0 ) {
                values.godray_light1Alpha = 0.0;
                values.godray_isAmberFadeIn = false;
            }
        }
        
    },
    fadeInFocoRay: function () {
        values.godray_light5Alpha += 0.0018;
        if (values.godray_light5Alpha > 1.0 ) {
            values.godray_light5Alpha = 1.0;
        }
    },

    fadeOutFocoRay: function () {
        values.godray_light5Alpha -= 0.0015;
        if (values.godray_light5Alpha < 0.0 ) {
            values.godray_light5Alpha = 0.0;
        }
    },

    fadeInRedGodRay: function ()
    {
        if (!values.godray_isRedFadeIn) {
            values.godray_light2Alpha += values.godray_fadeInFactor;
            if (values.godray_light2Alpha >= 1.0 ) {
                values.godray_light2Alpha = 1.0;
                values.godray_isRedFadeIn = true;
            }
        }            
    },

    fadeOutRedGodRay: function ()
    {
        if (values.godray_isRedFadeIn) {
            values.godray_light2Alpha -= (values.godray_fadeOut_redFactor);
            if (values.godray_light2Alpha < 0.0 ) {
                values.godray_light2Alpha = 0.0;
                values.godray_isRedFadeIn = false;
            }
        }            
    },

    fadeInWhiteGodRay: function ()
    {        
        if (!values.godray_isWhite3FadeIn) {
            values.godray_light3Alpha += values.godray_fadeInFactor;
            if (values.godray_light3Alpha >= 0.8 ) {
                values.godray_light3Alpha = 0.8;
                values.godray_isWhite3FadeIn = true;
            }
        }

        if (!values.godray_isWhite4FadeIn) {
            values.godray_light4Alpha += values.godray_fadeInFactor;
            if (values.godray_light4Alpha >= 0.8 ) {
                values.godray_light4Alpha = 0.8;
                values.godray_isWhite4FadeIn = true;
            }
        }
    },

    fadeOutWhiteGodRay: function ()
    {
        if (values.godray_isWhite3FadeIn) {
            values.godray_light3Alpha -= values.godray_fadeOut_whiteFactor;
            if (values.godray_light3Alpha < 0.0 ) {
                values.godray_light3Alpha = 0.0;
                values.godray_isWhite3FadeIn = false;
            }
        }
        
        if (values.godray_isWhite4FadeIn) {
            values.godray_light4Alpha -= values.godray_fadeOut_whiteFactor;
            if (values.godray_light4Alpha < 0.0 ) {
                values.godray_light4Alpha = 0.0;
                values.godray_isWhite4FadeIn = false;
            }
        }        
    },

    uninit: function () {

        //geometry unit
        cube.uninit();

        //textures unint
        gl.deleteTexture(this.marbleTex);
        gl.deleteTexture(this.stage_curtain);
        gl.deleteTexture(this.black_curtain);
        gl.deleteTexture(this.wingTex);
        gl.deleteTexture(this.stage_foot_wall);
        gl.deleteTexture(this.floorTex);
        gl.deleteTexture(this.pitTex);
        gl.deleteTexture(this.TexTheaterRoof);
        gl.deleteTexture(this.sideWallTex);
        gl.deleteTexture(this.wallDesignedTex);
        gl.deleteTexture(this.designedPillerTex);
        gl.deleteTexture(this.centerPillerTex);
        gl.deleteTexture(this.centerDesignedPillerTex);
        gl.deleteTexture(this.sideTile);
        gl.deleteTexture(this.topBorderTex);
        gl.deleteTexture(this.sideBorder);
        gl.deleteTexture(this.pitDoorTex);
        gl.deleteTexture(this.natrajTex);
        gl.deleteTexture(this.standTex);
        gl.deleteTexture(this.doorTex);
        gl.deleteTexture(this.shlokaTex);

    }

};

