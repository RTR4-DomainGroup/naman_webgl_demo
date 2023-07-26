/*********** Draw Models ***********/

//draw static models
var staticModels = {
    exposure1: 2.0,
    contrast1: 1.75,
    exposure2: 1.0,
    contrast2: 1.75,
    exposure3: 1.0,
    contrast3: 1.0,

    exposure4: 1.0,

    flowerPosX: -20.0,
    flowerPosY: -8.5,
    flowerPosZ: 17.0,


    init: function () {

        // var numChairInstances = 500 ;
        var numChairInstances = 252;
        var numHalogenInstances = 5;
        var instancePositions;
        var defaultPositions = new Float32Array([0.0, 0.0, 0.0]);
        this.nataraj0 = loadModelAndTextures(natarajModel0, "res/models/nataraj/0", 1, defaultPositions);

        instancePositions = this.generateChairsInstancePositions(numChairInstances);
        //console.log(instancePositions);
        this.chair0 = loadModelAndTextures(chairModel0, "res/models/chair/0", numChairInstances, instancePositions);
        this.chair1 = loadModelAndTextures(chairModel1, "res/models/chair/1", numChairInstances, instancePositions);
        
        this.flowerBasket0 = loadModelAndTextures(flowerBasketModel0, "res/models/flowerBasket/0", 1, defaultPositions);
        this.flowerBasket1 = loadModelAndTextures(flowerBasketModel1, "res/models/flowerBasket/1", 1, defaultPositions);
        this.flowerBasket2 = loadModelAndTextures(flowerBasketModel2, "res/models/flowerBasket/0", 1, defaultPositions);

        this.singleFlower0 = loadModelAndTextures(singleFlowerModel0, "res/models/singleFlower/0", 1, defaultPositions);
        
        this.speaker0 = loadModelAndTextures(speakerModel0, "res/models/speaker/0", 1, defaultPositions);
        
        this.spotHalogen0 = loadModelAndTextures(spotHalogenModel0, "res/models/spotHalogen/0", 1, defaultPositions);
        
        this.footHalogen0 = loadModelAndTextures(footHalogenModel0, "res/models/footHalogen/0", 1, defaultPositions);
        this.footHalogen1 = loadModelAndTextures(footHalogenModel1, "res/models/footHalogen/1", 1, defaultPositions);
        
        this.hangingMic0 = loadModelAndTextures(hangingMicModel0, "res/models/hangingMic/0", 1, defaultPositions);
        
        //init the projection matrix
        this.perspectiveProjectionMatrix = mat4.create();
    },

    generateChairsInstancePositions: function(numInstances) {
        var positions = new Float32Array(numInstances * 3); // x,y,z
        var xPos = values.X_MIN;
        var yPos = values.Y_MIN;
        var zPos = values.Z_MIN;

        var xMinLast = values.X_MIN;
        var xMaxLast = values.X_MAX;

        var curveIncrment = 0;
        var incrementor = 5;
        var rowCount = 1;
        for(let i = 0; i < numInstances; i++)
        {
            
            positions[(i*3)+0] = xPos;
            positions[(i*3)+1] = yPos+curveIncrment;
            positions[(i*3)+2] = zPos; 
            
            if(xPos >= xMaxLast)
            {    
                yPos += values.Y_INCREMENT;    
                zPos += values.Z_INCREMENT; // chairs uplifing
                incrementor *= -1;
                curveIncrment = 0;
                rowCount++;
                if(yPos >= values.Y_MAX)
                {
                    break;
                }    
                
                // chairs per row increment interval
                if(rowCount % 4 == 0)
                {
                    xMinLast -= values.X_INCREMENT;
                    xMaxLast += values.X_INCREMENT;
                }
                xPos = xMinLast;
                if(rowCount % 2 == 0)
                {
                    xPos += values.X_INCREMENT / 2;
                }
            }

            if(xPos > -90.0 && xPos < -1.0 )
            {
                xPos += values.ROW_SEPARTION;    
                incrementor *= -1;
            }
            else
            {
                xPos += values.X_INCREMENT;
                curveIncrment += incrementor;    
            }

        }

        return positions;
    },

    resize: function () {

        mat4.perspective(this.perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width / canvas.height), 0.1, 1000.0);

    },

    draw: function (viewMatrix, lightSpaceMatrix, depthOnly, godRay_scenepass) {

        var stat = staticModelShader.use();

        if (depthOnly) {
            // Shadow Uniforms
            gl.uniform1i(stat.actualSceneUniform, 0);
            gl.uniform1i(stat.depthSceneUniform, 1);
            gl.uniform1i(stat.depthQuadSceneUniform, 0);

            gl.uniformMatrix4fv(stat.lightSpaceMatrixUniform, false, lightSpaceMatrix);

        }

        if (!depthOnly) {
            // Shadow Uniforms
            gl.uniform1i(stat.actualSceneUniform, 1);
            gl.uniform1i(stat.depthSceneUniform, 0);
            gl.uniform1i(stat.depthQuadSceneUniform, 0);

            gl.uniformMatrix4fv(stat.lightSpaceMatrixUniform, false, lightSpaceMatrix);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, values.footLightShadowFB.fbo_depth_texture);

        }
        
        gl.uniform1f(stat.alphaBlendingUniform, values.alphaSceneTwo);

        // Positional Light Related Code
        gl.uniform3fv(stat.posLAZeroUniform, values.poslightAmbientZero);
        gl.uniform3fv(stat.posLDZeroUniform, values.poslightDiffuseZero);
        gl.uniform3fv(stat.posLSZeroUniform, values.poslightSpecularZero);
        gl.uniform4fv(stat.poslightPositionZeroUniform, values.poslightPositionZero);

         gl.uniform3fv(stat.posLAOneUniform, values.poslightAmbientOne);
         gl.uniform3fv(stat.posLDOneUniform, values.poslightDiffuseOne);
         gl.uniform3fv(stat.posLSOneUniform, values.poslightSpecularOne);
         gl.uniform4fv(stat.poslightPositionOneUniform, values.poslightPositionOne);

         gl.uniform3fv(stat.posLATwoUniform, values.poslightAmbientTwo);
         gl.uniform3fv(stat.posLDTwoUniform, values.poslightDiffuseTwo);
         gl.uniform3fv(stat.posLSTwoUniform, values.poslightSpecularTwo);
         gl.uniform4fv(stat.poslightPositionTwoUniform, values.poslightPositionTwo);

        gl.uniform3fv(stat.posLAThreeUniform, values.poslightAmbientThree);
        gl.uniform3fv(stat.posLDThreeUniform, values.poslightDiffuseThree);
        gl.uniform3fv(stat.posLSThreeUniform, values.poslightSpecularThree);
        gl.uniform4fv(stat.poslightPositionThreeUniform, values.poslightPositionThree);

        // Positional Light Diffuse Factor
        gl.uniform1f(stat.alphaPoslightZeroUniform, values.alphaPoslightZero);
        gl.uniform1f(stat.alphaPoslightOneUniform, values.alphaPoslightOne);
        gl.uniform1f(stat.alphaPoslightTwoUniform, values.alphaPoslightTwo);
        gl.uniform1f(stat.alphaPoslightThreeUniform, values.alphaPoslightThree);

        gl.uniform1f(stat.kShininessUniform, values.materialShininess);

        // Godrays
        gl.uniform1i(stat.godRay_sceneUniform, godRay_scenepass);

        // Spotlight Related Code
        gl.uniform3fv(stat.spotlightLAZeroUniform, values.spotlightAmbientZero);
        gl.uniform3fv(stat.spotlightLDZeroUniform, values.spotlightDiffuseZero);
        gl.uniform3fv(stat.spotlightLSZeroUniform, values.spotlightSpecularZero);
        gl.uniform4fv(stat.spotlightPositionZeroUniform, values.spotlightPositionZero);
        gl.uniform3fv(stat.spotDirectionZeroUniform, values.spotDirectionZero);
        gl.uniform1f(stat.constantAttenuationZeroUniform, values.constantAttenuationZero);
        gl.uniform1f(stat.linearAttenuationZeroUniform, values.linearAttenuationZero);
        gl.uniform1f(stat.quadraticAttenuationZeroUniform, values.quadraticAttenuationZero);
        gl.uniform1f(stat.spotCosCutoffZeroUniform, values.spotCosCutoffZero);
        gl.uniform1f(stat.spotCosOuterCutoffZeroUniform, values.spotCosOuterCutoffZero);

        gl.uniform3fv(stat.spotlightLAOneUniform, values.spotlightAmbientOne);
        gl.uniform3fv(stat.spotlightLDOneUniform, values.spotlightDiffuseOne);
        gl.uniform3fv(stat.spotlightLSOneUniform, values.spotlightSpecularOne);
        gl.uniform4fv(stat.spotlightPositionOneUniform, values.spotlightPositionOne);
        gl.uniform3fv(stat.spotDirectionOneUniform, values.spotDirectionOne);
        gl.uniform1f(stat.constantAttenuationOneUniform, values.constantAttenuationOne);
        gl.uniform1f(stat.linearAttenuationOneUniform, values.linearAttenuationOne);
        gl.uniform1f(stat.quadraticAttenuationOneUniform, values.quadraticAttenuationOne);
        gl.uniform1f(stat.spotCosCutoffOneUniform, values.spotCosCutoffOne);
        gl.uniform1f(stat.spotCosOuterCutoffOneUniform, values.spotCosOuterCutoffOne);

        gl.uniform3fv(stat.spotlightLATwoUniform, values.spotlightAmbientTwo);
        gl.uniform3fv(stat.spotlightLDTwoUniform, values.spotlightDiffuseTwo);
        gl.uniform3fv(stat.spotlightLSTwoUniform, values.spotlightSpecularTwo);
        gl.uniform4fv(stat.spotlightPositionTwoUniform, values.spotlightPositionTwo);
        gl.uniform3fv(stat.spotDirectionTwoUniform, values.spotDirectionTwo);
        gl.uniform1f(stat.constantAttenuationTwoUniform, values.constantAttenuationTwo);
        gl.uniform1f(stat.linearAttenuationTwoUniform, values.linearAttenuationTwo);
        gl.uniform1f(stat.quadraticAttenuationTwoUniform, values.quadraticAttenuationTwo);
        gl.uniform1f(stat.spotCosCutoffTwoUniform, values.spotCosCutoffTwo);
        gl.uniform1f(stat.spotCosOuterCutoffTwoUniform, values.spotCosOuterCutoffTwo);

        gl.uniform3fv(stat.spotlightLAThreeUniform, values.spotlightAmbientThree);
        gl.uniform3fv(stat.spotlightLDThreeUniform, values.spotlightDiffuseThree);
        gl.uniform3fv(stat.spotlightLSThreeUniform, values.spotlightSpecularThree);
        gl.uniform4fv(stat.spotlightPositionThreeUniform, values.spotlightPositionThree);
        gl.uniform3fv(stat.spotDirectionThreeUniform, values.spotDirectionThree);
        gl.uniform1f(stat.constantAttenuationThreeUniform, values.constantAttenuationThree);
        gl.uniform1f(stat.linearAttenuationThreeUniform, values.linearAttenuationThree);
        gl.uniform1f(stat.quadraticAttenuationThreeUniform, values.quadraticAttenuationThree);
        gl.uniform1f(stat.spotCosCutoffThreeUniform, values.spotCosCutoffThree);
        gl.uniform1f(stat.spotCosOuterCutoffThreeUniform, values.spotCosOuterCutoffThree);

        gl.uniform3fv(stat.spotlightLAFourUniform, values.spotlightAmbientFour);
        gl.uniform3fv(stat.spotlightLDFourUniform, values.spotlightDiffuseFour);
        gl.uniform3fv(stat.spotlightLSFourUniform, values.spotlightSpecularFour);
        gl.uniform4fv(stat.spotlightPositionFourUniform, values.spotlightPositionFour);
        gl.uniform3fv(stat.spotDirectionFourUniform, values.spotDirectionFour);
        gl.uniform1f(stat.constantAttenuationFourUniform, values.constantAttenuationFour);
        gl.uniform1f(stat.linearAttenuationFourUniform, values.linearAttenuationFour);
        gl.uniform1f(stat.quadraticAttenuationFourUniform, values.quadraticAttenuationFour);
        gl.uniform1f(stat.spotCosCutoffFourUniform, values.spotCosCutoffFour);
        gl.uniform1f(stat.spotCosOuterCutoffFourUniform, values.spotCosOuterCutoffFour);

        // Spotlight Diffuse Factor
        gl.uniform1f(stat.alphaSpotlightZeroUniform, values.alphaSpotlightZero);
        gl.uniform1f(stat.alphaSpotlightOneUniform, values.alphaSpotlightOne);
        gl.uniform1f(stat.alphaSpotlightTwoUniform, values.alphaSpotlightTwo);
        gl.uniform1f(stat.alphaSpotlightThreeUniform, values.alphaSpotlightThree);
        gl.uniform1f(stat.alphaSpotlightFourUniform, values.alphaSpotlightFour);

        // -- 1 --
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-35.0, -17.5, 15.0]);
        mat4.scale(modelMatrix, modelMatrix, [20.0, 20.0, 20.0]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(65.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

        

        //if (values.lastSpotEnable == true) {

        //    gl.uniform1f(stat.contrastUniform, 2.0);
        //    gl.uniform1f(stat.exposureUniform, 2.0);

        //} else {

            gl.uniform1f(stat.contrastUniform, this.contrast1);
            gl.uniform1f(stat.exposureUniform, this.exposure1);

        //}
        if (values.lastSpotEnable == true) {

            // this.exposure1 += 0.0018;
            // if (this.exposure1 > 2.0)
            //     this.exposure1 = 2.0;

            this.contrast1 += 0.00045;
            if (this.contrast1 > 2.0)
                this.contrast1 = 2.0;

        }

        this.nataraj0.draw();

        // -- 3 --
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-20.0, -13.0, 16.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.5, 0.6, 0.5]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(-180.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        //gl.uniform1f(stat.contrastUniform, 1.75);
        //gl.uniform1f(stat.exposureUniform, 1.0);

        

        //if (values.lastSpotEnable == true) {

        //    gl.uniform1f(stat.contrastUniform, 2.0);
        //    gl.uniform1f(stat.exposureUniform, 2.0);

        //} else {

            gl.uniform1f(stat.contrastUniform, this.contrast2);
            gl.uniform1f(stat.exposureUniform, this.exposure2);

        //}

        if (values.lastSpotEnable == true) {

            this.exposure2 += 0.0018;
            if (this.exposure2 > 2.0)
                this.exposure2 = 2.0;

            this.contrast2 += 0.00045;
            if (this.contrast2 > 2.0)
                this.contrast2 = 2.0;

        }


        this.flowerBasket0.draw();
        this.flowerBasket1.draw();
        this.flowerBasket2.draw();

        // -- 2 --
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-10.0, -20.8, 65.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(-180.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

        //if (values.lastSpotEnable == true) {

        //    gl.uniform1f(stat.contrastUniform, 2.0);
        //    gl.uniform1f(stat.exposureUniform, 2.0);

        //} else {

            gl.uniform1f(stat.contrastUniform, this.contrast3);
            gl.uniform1f(stat.exposureUniform, this.exposure3);

        //}

        if (values.lastSpotEnable == true) {

            this.exposure3 += 0.0018;
            if (this.exposure3 > 2.0)
                this.exposure3 = 2.0;

            this.contrast3 += 0.0018;
            if (this.contrast3 > 2.0)
                this.contrast3 = 2.0;

        }

        this.chair0.draw();
        this.chair1.draw();

       

        // -- 4 --
        // speaker 1 // left
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [50.0, -12.0, 35.0]);
        mat4.scale(modelMatrix, modelMatrix, [16.0, 16.0, 8.0]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(-20.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

        this.speaker0.draw();
        
        // speaker 2 // right
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-50.0, -12.0, 35.0]);
        mat4.scale(modelMatrix, modelMatrix, [16.0, 16.0, 8.0]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(20.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.speaker0.draw();

        // -- 5 --
        // spotHalogen 1 Natraj
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-25.0, 23.0, 28.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.30, 0.30, 0.30]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(90.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(210.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.spotHalogen0.draw();
        
        // spotHalogen 2 // - from Left white
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-31.0, 25.0, 25.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.30, 0.30, 0.30]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(60.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.spotHalogen0.draw();

        // spotHalogen 3 // - from Right white
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [30.5, 24.5, 25.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.30, 0.30, 0.30]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(120.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(230.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.spotHalogen0.draw();

        // spotHalogen 4 // Drawing Canvas spotlight
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [18.0, 25.0, 20.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.30, 0.30, 0.30]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-45.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(60.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.spotHalogen0.draw();

        // spotHalogen 5 // Back-Curton left
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [-20.0, 22.0, 15.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.30, 0.30, 0.30]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(20.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.spotHalogen0.draw();
        
        // spotHalogen 6 // Back-Curton - right -  god rays - Red
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [14.0, 22.0, 15.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.30, 0.30, 0.30]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(90.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(130.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(180.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.spotHalogen0.draw();

        // spotHalogen 7 // Center - god rays - Amber on Natraj
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [3.0, 22.0, 18.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.30, 0.30, 0.30]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(90.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(220.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(20.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.spotHalogen0.draw();

        // spotHalogen 8 // Center2 - vertical - godrays - on stage
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [2.0, 23.0, 3.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.30, 0.30, 0.30]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(60.0));
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(-90.0));
        // mat4.rotateZ(modelMatrix, modelMatrix, degToRad(20.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.spotHalogen0.draw();
        // -- 6 --
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, -15.7, 31.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.12, 0.12, 0.12]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-90.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(-180.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.footHalogen0.draw();
        this.footHalogen1.draw();

        // -- 7 --
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, 28.0, 10.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.02, 0.02, 0.02]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-120.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(90.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.hangingMic0.draw();

        // -- 8 --
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [this.flowerPosX, this.flowerPosY, this.flowerPosZ]);
        mat4.scale(modelMatrix, modelMatrix, [1.0, 1.0, 1.0]);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(-120.0));
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(90.0));
        gl.uniformMatrix4fv(stat.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(stat.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(stat.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        this.singleFlower0.draw();

        if (!depthOnly) {
            // Shadow Uniforms
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        
        gl.useProgram(null);
    },

    update: function () {

        values.alphaSceneTwo = values.alphaSceneTwo + values.alphaBlendIncrement;
        if (values.alphaSceneTwo >= 1.0)
            values.alphaSceneTwo = 1.0;

            if (frameCount >= 6450 && frameCount < 8100)
            {
                values.alphaSpotlightZero = values.alphaSpotlightZero + 0.005;
                if (values.alphaSpotlightZero >= 1.0)
                    values.alphaSpotlightZero = 1.0;
            }
        
            if (frameCount >= 8300 && frameCount < 8750)
            {    
                values.alphaSpotlightZero = values.alphaSpotlightZero - 0.005;
                if (values.alphaSpotlightZero <= 0.0)
                    values.alphaSpotlightZero = 0.0;
            }
        
            if (frameCount >= 8700 && frameCount < 10600) 
            {
                values.alphaSpotlightThree = values.alphaSpotlightThree + 0.005;
                if (values.alphaSpotlightThree >= 1.0)
                    values.alphaSpotlightThree = 1.0;
            }
    
            if (frameCount >= 10600 && frameCount < 11100) 
            {    
                values.alphaSpotlightThree = values.alphaSpotlightThree - 0.005;
                if (values.alphaSpotlightThree <= 0.0)
                    values.alphaSpotlightThree = 0.0;
            }
    
            if (frameCount >= 11200 && frameCount < 11850)
            {
                values.alphaSpotlightOne = values.alphaSpotlightOne + 0.005;
                if (values.alphaSpotlightOne >= 1.0)
                    values.alphaSpotlightOne = 1.0; 

                values.alphaSpotlightTwo = values.alphaSpotlightTwo + 0.005;
                if (values.alphaSpotlightTwo >= 1.0)
                    values.alphaSpotlightTwo = 1.0;
            }
    
        if (frameCount > 11850 && frameCount < 14000) 
        {
            values.alphaSpotlightOne = values.alphaSpotlightOne - 0.005;
            if (values.alphaSpotlightOne <= 0.0)
                values.alphaSpotlightOne = 0.0;
    
            values.alphaSpotlightTwo = values.alphaSpotlightTwo - 0.005;
            if (values.alphaSpotlightTwo <= 0.0)
                values.alphaSpotlightTwo = 0.0; 

            values.alphaSpotlightFour = values.alphaSpotlightFour + 0.005;
            if (values.alphaSpotlightFour >= 1.0)
                values.alphaSpotlightFour = 1.0;
        }

        if (frameCount > 14800 ) {
            values.alphaSpotlightFour = values.alphaSpotlightFour - 0.005;
            if (values.alphaSpotlightFour < 0.0)
                values.alphaSpotlightFour = 0.0;
        }
    },

    uninit: function () {

        this.nataraj0.uninit();
        this.singleFlower0.uninit();
        this.hangingMic0.uninit();
        this.footHalogen0.uninit();
        this.footHalogen1.uninit();
        this.spotHalogen0.uninit();
        this.speaker0.uninit();
        this.chair0.uninit();
        this.chair1.uninit();
        this.flowerBasket0.uninit();
        this.flowerBasket1.uninit();
        this.flowerBasket2.uninit();


    },

};

//draw animated models
var animatedModels = {

    keyframe: 180,
    deltaTime: 0,

    sirPosX: 66.0,   //72
    sirPosY: -16.35,
    sirPosZ: 25.0,
    sirRotY: -90.0,
    exposure4: 2.0,

    init: function () {
        
        var defaultPositions = new Float32Array([0.0, 0.0, 0.0]);
        this.sir0 = loadModelAndTextures(sirModel0, "res/models/sir/0", 1, defaultPositions);
        this.sir1 = loadModelAndTextures(sirModel1, "res/models/sir/0", 1, defaultPositions);
        this.sir2 = loadModelAndTextures(sirModel2, "res/models/sir/0", 1, defaultPositions);
        this.sir3 = loadModelAndTextures(sirModel3, "res/models/sir/0", 1, defaultPositions);
        this.sir4 = loadModelAndTextures(sirModel4, "res/models/sir/0", 1, defaultPositions);
        this.sir5 = loadModelAndTextures(sirModel5, "res/models/sir/1", 1, defaultPositions);
        this.sir6 = loadModelAndTextures(sirModel6, "res/models/sir/0", 1, defaultPositions);

        //init the projection matrix
        this.perspectiveProjectionMatrix = mat4.create();
    },

    resize: function () {

        mat4.perspective(this.perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width / canvas.height), 0.1, 1000.0);

    },

    draw: function (viewMatrix, lightSpaceMatrix, depthOnly, godRay_scenepass) {

        var anim = animatedModelShader.use();

        if (depthOnly) {
            // Shadow Uniforms
            gl.uniform1i(anim.actualSceneUniform, 0);
            gl.uniform1i(anim.depthSceneUniform, 1);
            gl.uniform1i(anim.depthQuadSceneUniform, 0);

            gl.uniformMatrix4fv(anim.lightSpaceMatrixUniform, false, lightSpaceMatrix);

        }

        if (!depthOnly) {
            // Shadow Uniforms
            gl.uniform1i(anim.actualSceneUniform, 1);
            gl.uniform1i(anim.depthSceneUniform, 0);
            gl.uniform1i(anim.depthQuadSceneUniform, 0);

            gl.uniformMatrix4fv(anim.lightSpaceMatrixUniform, false, lightSpaceMatrix);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, values.footLightShadowFB.fbo_depth_texture);

        }

        {
            
            if (values.lastSpotEnable == true) {

                this.exposure4 -= 0.05;
                if (this.exposure4 < 0.5)
                    this.exposure4 = 0.5;
            }

            gl.uniform1f(anim.exposureUniform, this.exposure4);

            gl.uniform1f(anim.alphaBlendingUniform, values.alphaSceneTwo);

            // Positional Light Related Code
            gl.uniform3fv(anim.posLAZeroUniform, values.poslightAmbientZero);
            gl.uniform3fv(anim.posLDZeroUniform, values.poslightDiffuseZero);
            gl.uniform3fv(anim.posLSZeroUniform, values.poslightSpecularZero);
            gl.uniform4fv(anim.poslightPositionZeroUniform, values.poslightPositionZero);

             gl.uniform3fv(anim.posLAOneUniform, values.poslightAmbientOne);
             gl.uniform3fv(anim.posLDOneUniform, values.poslightDiffuseOne);
             gl.uniform3fv(anim.posLSOneUniform, values.poslightSpecularOne);
             gl.uniform4fv(anim.poslightPositionOneUniform, values.poslightPositionOne);

             gl.uniform3fv(anim.posLATwoUniform, values.poslightAmbientTwo);
             gl.uniform3fv(anim.posLDTwoUniform, values.poslightDiffuseTwo);
             gl.uniform3fv(anim.posLSTwoUniform, values.poslightSpecularTwo);
             gl.uniform4fv(anim.poslightPositionTwoUniform, values.poslightPositionTwo);

            gl.uniform3fv(anim.posLAThreeUniform, values.poslightAmbientThree);
            gl.uniform3fv(anim.posLDThreeUniform, values.poslightDiffuseThree);
            gl.uniform3fv(anim.posLSThreeUniform, values.poslightSpecularThree);
            gl.uniform4fv(anim.poslightPositionThreeUniform, values.poslightPositionThree);

            // Positional Light Diffuse Factor
            gl.uniform1f(anim.alphaPoslightZeroUniform, values.alphaPoslightZero);
            gl.uniform1f(anim.alphaPoslightOneUniform, values.alphaPoslightOne);
            gl.uniform1f(anim.alphaPoslightTwoUniform, values.alphaPoslightTwo);
            gl.uniform1f(anim.alphaPoslightThreeUniform, values.alphaPoslightThree);

            gl.uniform1f(anim.kShininessUniform, values.materialShininess);

            // Godrays
            gl.uniform1i(anim.godRay_sceneUniform, godRay_scenepass);

            // Spotlight Related Code
            gl.uniform3fv(anim.spotlightLAZeroUniform, values.spotlightAmbientZero);
            gl.uniform3fv(anim.spotlightLDZeroUniform, values.spotlightDiffuseZero);
            gl.uniform3fv(anim.spotlightLSZeroUniform, values.spotlightSpecularZero);
            gl.uniform4fv(anim.spotlightPositionZeroUniform, values.spotlightPositionZero);
            gl.uniform3fv(anim.spotDirectionZeroUniform, values.spotDirectionZero);
            gl.uniform1f(anim.constantAttenuationZeroUniform, values.constantAttenuationZero);
            gl.uniform1f(anim.linearAttenuationZeroUniform, values.linearAttenuationZero);
            gl.uniform1f(anim.quadraticAttenuationZeroUniform, values.quadraticAttenuationZero);
            gl.uniform1f(anim.spotCosCutoffZeroUniform, values.spotCosCutoffZero);
            gl.uniform1f(anim.spotCosOuterCutoffZeroUniform, values.spotCosOuterCutoffZero);

            gl.uniform3fv(anim.spotlightLAOneUniform, values.spotlightAmbientOne);
            gl.uniform3fv(anim.spotlightLDOneUniform, values.spotlightDiffuseOne);
            gl.uniform3fv(anim.spotlightLSOneUniform, values.spotlightSpecularOne);
            gl.uniform4fv(anim.spotlightPositionOneUniform, values.spotlightPositionOne);
            gl.uniform3fv(anim.spotDirectionOneUniform, values.spotDirectionOne);
            gl.uniform1f(anim.constantAttenuationOneUniform, values.constantAttenuationOne);
            gl.uniform1f(anim.linearAttenuationOneUniform, values.linearAttenuationOne);
            gl.uniform1f(anim.quadraticAttenuationOneUniform, values.quadraticAttenuationOne);
            gl.uniform1f(anim.spotCosCutoffOneUniform, values.spotCosCutoffOne);
            gl.uniform1f(anim.spotCosOuterCutoffOneUniform, values.spotCosOuterCutoffOne);

            gl.uniform3fv(anim.spotlightLATwoUniform, values.spotlightAmbientTwo);
            gl.uniform3fv(anim.spotlightLDTwoUniform, values.spotlightDiffuseTwo);
            gl.uniform3fv(anim.spotlightLSTwoUniform, values.spotlightSpecularTwo);
            gl.uniform4fv(anim.spotlightPositionTwoUniform, values.spotlightPositionTwo);
            gl.uniform3fv(anim.spotDirectionTwoUniform, values.spotDirectionTwo);
            gl.uniform1f(anim.constantAttenuationTwoUniform, values.constantAttenuationTwo);
            gl.uniform1f(anim.linearAttenuationTwoUniform, values.linearAttenuationTwo);
            gl.uniform1f(anim.quadraticAttenuationTwoUniform, values.quadraticAttenuationTwo);
            gl.uniform1f(anim.spotCosCutoffTwoUniform, values.spotCosCutoffTwo);
            gl.uniform1f(anim.spotCosOuterCutoffTwoUniform, values.spotCosOuterCutoffTwo);

            gl.uniform3fv(anim.spotlightLAThreeUniform, values.spotlightAmbientThree);
            gl.uniform3fv(anim.spotlightLDThreeUniform, values.spotlightDiffuseThree);
            gl.uniform3fv(anim.spotlightLSThreeUniform, values.spotlightSpecularThree);
            gl.uniform4fv(anim.spotlightPositionThreeUniform, values.spotlightPositionThree);
            gl.uniform3fv(anim.spotDirectionThreeUniform, values.spotDirectionThree);
            gl.uniform1f(anim.constantAttenuationThreeUniform, values.constantAttenuationThree);
            gl.uniform1f(anim.linearAttenuationThreeUniform, values.linearAttenuationThree);
            gl.uniform1f(anim.quadraticAttenuationThreeUniform, values.quadraticAttenuationThree);
            gl.uniform1f(anim.spotCosCutoffThreeUniform, values.spotCosCutoffThree);
            gl.uniform1f(anim.spotCosOuterCutoffThreeUniform, values.spotCosOuterCutoffThree);

            gl.uniform3fv(anim.spotlightLAFourUniform, values.spotlightAmbientFour);
            gl.uniform3fv(anim.spotlightLDFourUniform, values.spotlightDiffuseFour);
            gl.uniform3fv(anim.spotlightLSFourUniform, values.spotlightSpecularFour);
            gl.uniform4fv(anim.spotlightPositionFourUniform, values.spotlightPositionFour);
            gl.uniform3fv(anim.spotDirectionFourUniform, values.spotDirectionFour);
            gl.uniform1f(anim.constantAttenuationFourUniform, values.constantAttenuationFour);
            gl.uniform1f(anim.linearAttenuationFourUniform, values.linearAttenuationFour);
            gl.uniform1f(anim.quadraticAttenuationFourUniform, values.quadraticAttenuationFour);
            gl.uniform1f(anim.spotCosCutoffFourUniform, values.spotCosCutoffFour);
            gl.uniform1f(anim.spotCosOuterCutoffFourUniform, values.spotCosOuterCutoffFour);

            // Spotlight Diffuse Factor
            gl.uniform1f(anim.alphaSpotlightZeroUniform, values.alphaSpotlightZero);
            gl.uniform1f(anim.alphaSpotlightOneUniform, values.alphaSpotlightOne);
            gl.uniform1f(anim.alphaSpotlightTwoUniform, values.alphaSpotlightTwo);
            gl.uniform1f(anim.alphaSpotlightThreeUniform, values.alphaSpotlightThree);
            gl.uniform1f(anim.alphaSpotlightFourUniform, values.alphaSpotlightFour);

        }

        // -- 2 --
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [this.sirPosX, this.sirPosY, this.sirPosZ]);
        //mat4.translate(modelMatrix, modelMatrix, [0.0, -16.35, 25.0]);
        mat4.scale(modelMatrix, modelMatrix, [0.15, 0.15, 0.15]);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(this.sirRotY));
        gl.uniformMatrix4fv(anim.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(anim.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(anim.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);
        gl.uniformMatrix4fv(anim.boneMatrixUniform, false, sirAnim0[Math.min(this.keyframe, sirAnim0.length - 1)]);
        this.sir0.draw(); // eyebrows
        this.sir1.draw(); // hairs
        this.sir2.draw(); // mustache
        this.sir3.draw(); // pants
        this.sir4.draw(); // shirt
        this.sir5.draw(); // face, hands and legs
        this.sir6.draw(); // Eyes

        if (!depthOnly) {
            // Shadow Uniforms

            gl.bindTexture(gl.TEXTURE_2D, null);

        }

        gl.useProgram(null);

    },

    update: function () {

        //for animated models
        this.keyframe = this.deltaTime;
        this.deltaTime++;

        //this.keyframe = frameCount;

        // Start to Natraj
        if (this.keyframe >= 3353 && this.keyframe <= 4070) { 
            this.sirPosX -= 0.113;
            this.sirPosZ -= 0.007;
            this.sirRotY -= 0.01;
            
        }

        // Picking flower
        else if (this.keyframe >= 4280 && this.keyframe <= 4320) {
            staticModels.flowerPosX += 0.08;
            staticModels.flowerPosY -= 0.01;
            staticModels.flowerPosZ += 0.08;

        }

        // One step forword to Natraj
        else if (this.keyframe >= 4348 && this.keyframe <= 4430) {
            this.sirPosX -= 0.12;
            staticModels.flowerPosX -= 0.12;
            
        }

        // dropping flower to Natraj
        else if (this.keyframe >= 4460 && this.keyframe <= 4530) {
            staticModels.flowerPosX -= 0.1;

        }
        else if (this.keyframe >= 4530 && this.keyframe <= 4600) 
        {
            staticModels.flowerPosY -= 0.01 ;
        }
        
        // Natraj to Canvas
        else if (this.keyframe >= 6350 && this.keyframe <= 6720) {
            this.sirPosX += 0.111;
            this.sirPosZ -= 0.0015;
           this.sirRotY += 0.02;
            if (this.sirRotY <= -100.0)
                this.sirRotY = -100.0;
            //this.sirPosX = values.lerp(this.sirPosX, 18.0, 0.001);
            //this.sirRotY = values.lerp(this.sirRotY, -19.0, 0.01);
            //this.sirPosZ = values.lerp(this.sirPosZ, 15.0, 0.007);
        }

        else if (this.keyframe >= 7185 && this.keyframe <= 7335) {
            this.sirRotY -= 0.2;
        }
        // canvas to center
        //else if (this.keyframe >= 7118 && this.keyframe <= 7268) {
        else if (this.keyframe >= 7307 && this.keyframe <= 7500) {

            if(this.keyframe >= 7300 && this.keyframe <= 7412){
                this.sirPosX -= 0.14;
                this.sirPosZ += 0.005;
            }
            else
            {
                this.sirPosX -= 0.0523;
                this.sirPosZ += 0.0355;
               // this.sirRotY += 0.80;
            }            
        }
        else {
            if (this.sirRotY < -90.0)
                this.sirRotY += 1.0;
            else
                this.sirRotY = -90.0;

        }

        values.alphaSceneTwo = values.alphaSceneTwo + values.alphaBlendIncrement;
        if (values.alphaSceneTwo >= 1.0)
            values.alphaSceneTwo = 1.0;

        if (frameCount >= 6450 && frameCount < 8100)
        {
            values.alphaSpotlightZero = values.alphaSpotlightZero + 0.005;
            if (values.alphaSpotlightZero >= 1.0)
                values.alphaSpotlightZero = 1.0;
        }
    
        if (frameCount >= 8300 && frameCount < 8750)
        {    
            values.alphaSpotlightZero = values.alphaSpotlightZero - 0.005;
            if (values.alphaSpotlightZero <= 0.0)
                values.alphaSpotlightZero = 0.0;
        }
    
        if (frameCount >= 8700 && frameCount < 10600) 
        {
            values.alphaSpotlightThree = values.alphaSpotlightThree + 0.005;
            if (values.alphaSpotlightThree >= 1.0)
                values.alphaSpotlightThree = 1.0;
        }

        if (frameCount >= 10600 && frameCount < 11100) 
        {    
            values.alphaSpotlightThree = values.alphaSpotlightThree - 0.005;
            if (values.alphaSpotlightThree <= 0.0)
                values.alphaSpotlightThree = 0.0;
        }

        if (frameCount >= 11200 && frameCount < 11850)  
        {
            values.alphaSpotlightOne = values.alphaSpotlightOne + 0.005;
            if (values.alphaSpotlightOne >= 1.0)
                values.alphaSpotlightOne = 1.0; 

            values.alphaSpotlightTwo = values.alphaSpotlightTwo + 0.005;
            if (values.alphaSpotlightTwo >= 1.0)
                values.alphaSpotlightTwo = 1.0;
        }
    
        if (frameCount > 11850 && frameCount < 14000) 
        {
            values.alphaSpotlightOne = values.alphaSpotlightOne - 0.005;
            if (values.alphaSpotlightOne <= 0.0)
                values.alphaSpotlightOne = 0.0;
    
            values.alphaSpotlightTwo = values.alphaSpotlightTwo - 0.005;
            if (values.alphaSpotlightTwo <= 0.0)
                values.alphaSpotlightTwo = 0.0; 

            values.alphaSpotlightFour = values.alphaSpotlightFour + 0.005;
            if (values.alphaSpotlightFour >= 1.0)
                values.alphaSpotlightFour = 1.0;
        }

        if (frameCount > 14800 ) {
            values.alphaSpotlightFour = values.alphaSpotlightFour - 0.005;
            if (values.alphaSpotlightFour < 0.0)
                values.alphaSpotlightFour = 0.0;
        }

    },

    uninit: function () {
        this.sir0.uninit(); // eyebrows
        this.sir1.uninit(); // hairs
        this.sir2.uninit(); // mustache
        this.sir3.uninit(); // pants
        this.sir4.uninit(); // shirt
        this.sir5.uninit(); // face, hands and legs
        this.sir6.uninit(); // Eyes

    },

};
