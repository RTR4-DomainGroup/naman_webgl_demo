/*********** Scene Zero - main scene ***********/



const sceneZero = {

    //gobal variables
    perspectiveProjectionMatrix: mat4.create(),

    init: function () {

        quad.init();

        this.texture12 = loadTexture("res/textures/sceneZero/sceneZero.jpg");
        this.xTranslateValue = 50.0;
    },

    resize: function () {
        mat4.perspective(this.perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width) / parseFloat(canvas.height), 0.1, 100.0);
    },

    draw: function () {

        var ads = sceneZeroLightShader.use();
        this.xTranslateValue -= sceneZeroValue.transitionSpeed;  

                // quad 1
        // Shadow Uniforms
        gl.uniform1i(ads.actualSceneUniform, 1);
        gl.uniform1i(ads.depthSceneUniform, 0);
        gl.uniform1i(ads.depthQuadSceneUniform, 0);  
       
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture12);
        //gl.uniform1i(ads.diffuseTextureSamplerUniform, 1);

        gl.uniform1f(ads.alphaBlendingSceneZeroUniform, values.alphaSceneZero);
        
        // Spotlight Related Code
        gl.uniform3fv(        ads.spotlightLAZeroUniform, sceneZeroValue.spotlightAmbientZero);
        gl.uniform3fv(        ads.spotlightLDZeroUniform, sceneZeroValue.spotlightDiffuseZero);
        gl.uniform3fv(        ads.spotlightLSZeroUniform, sceneZeroValue.spotlightSpecularZero);
        gl.uniform4fv(  ads.spotlightPositionZeroUniform, sceneZeroValue.spotlightPositionZero);
        gl.uniform3fv(      ads.spotDirectionZeroUniform, sceneZeroValue.spotDirectionZero);
        gl.uniform1f( ads.constantAttenuationZeroUniform, sceneZeroValue.constantAttenuationZero);
        gl.uniform1f(   ads.linearAttenuationZeroUniform, sceneZeroValue.linearAttenuationZero);
        gl.uniform1f(ads.quadraticAttenuationZeroUniform, sceneZeroValue.quadraticAttenuationZero);
        gl.uniform1f(       ads.spotCosCutoffZeroUniform, sceneZeroValue.spotCosCutoffZero);
        gl.uniform1f(  ads.spotCosOuterCutoffZeroUniform, sceneZeroValue.spotCosOuterCutoffZero);
        gl.uniform1f(      ads.alphaSpotlightZeroUniform, sceneZeroValue.alphaSpotlightZero);
        
        // // Positional Light Related Code
        gl.uniform3fv(           ads.posLAZeroUniform, sceneZeroValue.poslightAmbientZero);
        gl.uniform3fv(           ads.posLDZeroUniform, sceneZeroValue.poslightDiffuseZero);
        gl.uniform3fv(           ads.posLSZeroUniform, sceneZeroValue.poslightSpecularZero);
        gl.uniform4fv(ads.poslightPositionZeroUniform, sceneZeroValue.poslightPositionZero);
        gl.uniform1f(    ads.alphaPoslightZeroUniform, sceneZeroValue.alphaPoslightZero);
    

        var modelMatrix = mat4.create();
        var viewMatrix = mat4.create();

        mat4.translate(modelMatrix, modelMatrix, [this.xTranslateValue, 0.0, -10.0]);
        mat4.scale(modelMatrix, modelMatrix, [13.41, 0.85, 1.0]);
        mat4.scale(modelMatrix, modelMatrix, [4.0, 4.0, 4.0]);
        gl.uniformMatrix4fv(ads.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(ads.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(ads.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

        //gl.uniform1f(ads.blendValue, 1.0);

        quad.draw();
        gl.bindTexture(gl.TEXTURE_2D, null);

        update();

        gl.useProgram(null);

    },

    update: function ()
    {
        values.alphaSceneZero = values.alphaSceneZero + values.alphaBlendIncrement / 2.5;
        if (values.alphaSceneZero >= 1.0)
            values.alphaSceneZero = 1.0;
    },

    uninit: function () {

        quad.uninit();
         
    }

};
