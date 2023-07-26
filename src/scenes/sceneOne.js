/*********** Scene One - main scene ***********/



const sceneOne = {

    mixValue: [0.0, 0.0, 0.0, 1.0],
    val: 1,
    flag: [false, false, false],
    credits_texture: [null, null, null],
    innerLoopFlag: [false, false, false],
    frameCount: 0,
    creditImage: 0,

    //gobal variables
    perspectiveProjectionMatrix: mat4.create(),

    init: function () {

        quad.init();

        this.textureBackground = loadTexture("res/textures/introAndEndCredits/EndCreditsBackground.png");
        this.texture1 = loadTexture("res/textures/introAndEndCredits/0_1-Astromedicomp.png");
        this.texture2 = loadTexture("res/textures/introAndEndCredits/0_2-DG.png");
        this.texture3 = loadTexture("res/textures/introAndEndCredits/0_3-Naman.png");
    
    },

    resize: function () {
        mat4.perspective(this.perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width) / parseFloat(canvas.height), 0.1, 100.0);
    },

    draw: function () {

        var fsShader = fsQuadShader.use();

        // quad 1
   
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textureBackground);
        if (this.val == 4) {
            gl.uniform1f(fsShader.mixValueUniform, this.mixValue[3]);
            this.creditImage = 4;
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

                gl.bindTexture(gl.TEXTURE_2D, this.texture1);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[0]);
                this.creditImage = 1;
                break;

            case 2:

                gl.bindTexture(gl.TEXTURE_2D, this.texture2);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[1]);
                this.creditImage = 2;
                break;

            case 3:

                gl.bindTexture(gl.TEXTURE_2D, this.texture3);
                gl.uniform1f(fsShader.mixValueUniform, this.mixValue[2]);
                this.creditImage = 3;
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
        switch (this.creditImage) {
            case 1:

                this.mixValue[0] = this.mixValue[0] + 0.009;

                if (this.mixValue[0] >= 1.0) {
                    this.mixValue[0] = 1.0;

                    while (this.frameCount != 9) {

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

                    while (this.frameCount != 9) {

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

                    while (this.frameCount != 9) {
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

                    while (this.frameCount != 9) {
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

            default:
                break;
        }
    },

    uninit: function () {
    
     
    }

};
