/*********** Scene Three - main scene ***********/



const sceneThree = {

    //gobal variables
    perspectiveProjectionMatrix: mat4.create(),

    mixValue : [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,0.0,1.0],
    val: 1,
    flag : [false, false, false, false, false, false, false, false, false, false, false,false],
    credits_texture: [null, null, null, null, null, null, null, null, null, null, null, null],
    innerLoopFlag: [false, false, false, false, false, false, false, false, false, false, false,false],
    frameCount: 0,
    creditImage: 0,

    init: function () {

        this.texture_array = ["/EndCreditsBackground.png", "/01-songInfo.png", "/02-audio_multitexture.png", "/03-camera_drawing.png", "/04-spot_instancing.png", "/05-fourier_normal.png", "/06-shadow_godrays.png", "/07-direction.png", "/08-TechRef_1.png", "/08-TechRef_2.png", "/09-thanks.png", "/10-blessings.png","/11-sir.png"];
        this.path = "res/textures/introAndEndCredits";

        // 1
        quad.init();
    
        this.endCreditsBackground_texture = loadTexture(this.path.concat(this.texture_array[0]));
      
        for (var i = 1; i <= 12; i++) {
            this.credits_texture[i] = loadTexture(this.path.concat(this.texture_array[i]));
        }
    },

    resize: function () {
        mat4.perspective(perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width) / parseFloat(canvas.height), 0.1, 100.0);
    },

    draw: function () {

        var fsShader = fsQuadShader.use();
 
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.endCreditsBackground_texture);
        //gl.uniform1f(fsShader.mixValueUniform, 1.0);

        if (this.val == 13) {
            gl.uniform1f(fsShader.mixValueUniform, this.mixValue[12]);
            this.creditImage = 13;
        }
        else {
            gl.uniform1f(fsShader.mixValueUniform, 1.0);
        }

        gl.uniform1i(fsShader.textureSampler_fp1Uniform, 0);
        gl.uniform1i(fsShader.isGodRayUniform, 0);
        quad.draw();

      

        // 2

        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(fsShader.textureSampler_fp1Uniform, 0);

        switch (this.val) {

            case 1:

                gl.bindTexture(gl.TEXTURE_2D,this.credits_texture[1]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[0]);
                this.creditImage = 1;
                break;

            case 2:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[2]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[1]);
                this.creditImage = 2;
                break;

            case 3:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[3]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[2]);
                this.creditImage = 3;
                break;

            case 4:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[4]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[3]);
                this.creditImage = 4;
                break;

            case 5:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[5]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[4]);
                this.creditImage = 5;
                break;

            case 6:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[6]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[5]);
                this.creditImage = 6;
                break;

            case 7:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[7]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[6]);
                this.creditImage = 7;
                break;

            case 8:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[8]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[7]);
                this.creditImage = 8;
                break;

            case 9:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[9]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[8]);
                this.creditImage = 9;
                break;

            case 10:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[10]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[9]);
                this.creditImage = 10;
                break;

            case 11:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[11]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[10]);
                this.creditImage = 11;
                break;
            case 12:

                gl.bindTexture(gl.TEXTURE_2D, this.credits_texture[12]);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[11]);
                this.creditImage = 12;
                break; 

            default:
                break;

        }

        quad.draw();

        gl.bindTexture(gl.TEXTURE_2D, null);

        update();

        gl.useProgram(null);

    },

    update: function () {

        switch (this.creditImage)
        {
            case 1:

                this.mixValue[0] = this.mixValue[0] + 0.009;

                if (this.mixValue[0] >= 1.0) {
                    this.mixValue[0] = 1.0;

                    while (this.frameCount != 600) {

                        this.frameCount++;
                        this.innerLoopFlag[0] = true;
                    }
                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[0] == true) {
                    this.mixValue[0] = this.mixValue[0] - 0.010;

                    if (this.mixValue[0] <= 0.0) {
                        this.mixValue[0] = 0.0;
                        this.val = 2;
                    }

                }
                break;

            case 2:
                this.mixValue[1] = this.mixValue[1] + 0.009;

                if (this.mixValue[1] >= 1.0) {
                    this.mixValue[1] = 1.0;

                    while (this.frameCount != 420) {

                        this.frameCount++;
                        this.innerLoopFlag[1] = true;
                    }
                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[1] == true) {

                    this.mixValue[1] = this.mixValue[1] - 0.010;

                    if (this.mixValue[1] <= 0.0) {
                        this.mixValue[1] = 0.0;
                        this.val = 3;

                    }
                }
                break;

            case 3:
                this.mixValue[2] = this.mixValue[2] + 0.009;

                if (this.mixValue[2] >= 1.0) {
                    this.mixValue[2] = 1.0;

                    while (this.frameCount != 420) {
                        this.frameCount++;
                        this.innerLoopFlag[2] = true;
                    }
                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[2] == true) {

                    this.mixValue[2] = this.mixValue[2] - 0.010;

                    if (this.mixValue[2] <= 0.0) {
                        this.mixValue[2] = 0.0;
                        this.val = 4;

                    }
                }
                break;

            case 4:
                this.mixValue[3] = this.mixValue[3] + 0.009;

                if (this.mixValue[3] >= 1.0) {
                    this.mixValue[3] = 1.0;

                    while (this.frameCount != 420) {
                        this.frameCount++;
                        this.innerLoopFlag[3] = true;
                    }
                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[3] == true) {

                    this.mixValue[3] = this.mixValue[3] - 0.010;

                    if (this.mixValue[3] <= 0.0) {
                        this.mixValue[3] = 0.0;
                        this.val = 5;

                    }
                }

                break;

            case 5:
                this.mixValue[4] = this.mixValue[4] + 0.009;

                if (this.mixValue[4] >= 1.0) {
                    this.mixValue[4] = 1.0;

                    while (this.frameCount != 420) {
                        this.frameCount++;
                        this.innerLoopFlag[4] = true;
                    }

                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[4] == true) {

                    this.mixValue[4] = this.mixValue[4] - 0.010;

                    if (this.mixValue[4] <= 0.0) {
                        this.mixValue[4] = 0.0;
                        this.val = 6;
                    }
                }
                break;

            case 6:

                this.mixValue[5] = this.mixValue[5] + 0.009;

                if (this.mixValue[5] >= 1.0) {
                    this.mixValue[5] = 1.0;

                    while (this.frameCount != 420) {
                        this.frameCount++;
                        this.innerLoopFlag[5] = true;
                    }
                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[5] == true) {

                    this.mixValue[5] = this.mixValue[5] - 0.010;

                    if (this.mixValue[5] <= 0.0) {
                        this.mixValue[5] = 0.0;
                        this.val = 7;
                    }
                }

                break;

            case 7:

                this.mixValue[6] = this.mixValue[6] + 0.009;

                if (this.mixValue[6] >= 1.0) {
                    this.mixValue[6] = 1.0;

                    while (this.frameCount != 360) {
                        this.frameCount++;
                        this.innerLoopFlag[6] = true;
                    }

                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[6] == true) {

                    this.mixValue[6] = this.mixValue[6] - 0.010;

                    if (this.mixValue[6] <= 0.0) {
                        this.mixValue[6] = 0.0;
                        this.val = 8;
                    }
                }
                break;

            case 8:

                this.mixValue[7] = this.mixValue[7] + 0.009;

                if (this.mixValue[7] >= 1.0) {
                    this.mixValue[7] = 1.0;

                    while (this.frameCount != 900) {
                        this.frameCount++;
                        this.innerLoopFlag[7] = true;
                    }

                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[7] == true) {

                    this.mixValue[7] = this.mixValue[7] - 0.010;

                    if (this.mixValue[7] <= 0.0) {
                        this.mixValue[7] = 0.0;
                        this.val = 9;
                    }
                }
                break;

            case 9:

                this.mixValue[8] = this.mixValue[8] + 0.009;

                if (this.mixValue[8] >= 1.0) {
                    this.mixValue[8] = 1.0;

                    while (this.frameCount != 900) {
                        this.frameCount++;
                        this.innerLoopFlag[8] = true;
                    }

                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[8] == true) {

                    this.mixValue[8] = this.mixValue[8] - 0.010;

                    if (this.mixValue[8] <= 0.0) {
                        this.mixValue[8] = 0.0;
                        this.val = 10;
                    }
                }
                break;

            case 10:
                this.mixValue[9] = this.mixValue[9] + 0.009;

                if (this.mixValue[9] >= 1.0) {
                    this.mixValue[9] = 1.0;

                    while (this.frameCount != 600) {
                        this.frameCount++;
                        this.innerLoopFlag[9] = true;
                    }

                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[9] == true) {

                    this.mixValue[9] = this.mixValue[9] - 0.010;

                    if (this.mixValue[9] <= 0.0) {
                        this.mixValue[9] = 0.0;
                        this.val = 11;

                    }
                }
                break;

            case 11:
                this.mixValue[10] = this.mixValue[10] + 0.009;

                if (this.mixValue[10] >= 1.0) {
                    this.mixValue[10] = 1.0;

                    while (this.frameCount != 420) {
                        this.frameCount++;
                        this.innerLoopFlag[10] = true;
                    }
                    this.frameCount = 0;
                }

                if (this.innerLoopFlag[10] == true) {

                    this.mixValue[10] = this.mixValue[10] - 0.010;

                    if (this.mixValue[10] <= 0.0) {
                        this.mixValue[10] = 0.0;
                        this.val = 12;

                    }
                }
                break;

            case 12:

               
                this.mixValue[11] = this.mixValue[11] + 0.009;

                if (this.mixValue[11] >= 1.0) {
                    this.mixValue[11] = 1.0;

                    while (this.frameCount != 420) {
                        this.frameCount++;
                        this.innerLoopFlag[11] = true;
                    }

                    this.frameCount = 0;
                }
        

                if (this.innerLoopFlag[11] == true) {
                    this.mixValue[11] = this.mixValue[11] - 0.010;

                    if (this.mixValue[11] <= 0.0) {
                        this.mixValue[11] = 0.0;
                        this.val = 13;
                    }
                }

                break;

            case 13:

            
                this.mixValue[12] = this.mixValue[12] - 0.010;

                if (this.mixValue[12] <= 0.0) {
                    this.mixValue[12] = 0.0;

                }
                break;

            default:
                break;
    }     
    },

    uninit: function () {
    
     
    }

};
