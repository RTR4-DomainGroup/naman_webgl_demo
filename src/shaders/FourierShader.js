/*********** Fourier Shader ***********/

const fourierShader = {

    shaderProgramObject: 0,
    uniforms: {},

    init: function () {

        //----------- SHADER SOURCE CODE -----------//

        //VERTEX SHADER
        var vertexShaderSourceCode =
            "#version 300 es \n" +
            "\n" +

            "in vec4 a_position; \n" +
            "in vec4 a_color;\n" +
			"in vec2 a_texcoord; \n" +

            "out vec2 a_texcoord_out; \n" +
            "out vec4 a_color_out;\n" +

            "void main(void) \n" +
            "{ \n" +

            "   a_texcoord_out = a_texcoord; \n" +
            "   a_color_out = a_color; \n" +

            "   gl_Position =   a_position ; \n" +
            "   gl_PointSize = 1.00; \n" +
            
            "} \n";

        var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShaderObject, vertexShaderSourceCode);
        gl.compileShader(vertexShaderObject);

        if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(vertexShaderObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Fourier Vertex Shader Compilation: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //FRAGMENT SHADER
        var fragmentShaderSourceCode =
            "#version 300 es \n" +
            "\n" +
            "precision highp float; \n" +

            "in vec2 a_texcoord_out; \n" +
            "in vec4 a_color_out;\n" +

            "uniform sampler2D u_TexSampler;\n" +
            "uniform float u_blendValue; \n" +
            "uniform int u_isGodRay_scenePass; \n" +
            "out vec4 fragColor; \n" +

            "void main(void) \n" +
            "{ \n" +

            "   vec4 tex = texture(u_TexSampler, a_texcoord_out); \n" +
            "   if(tex.a < 0.1) \n" +
            "       discard; \n" +

          //  "   if(a_color_out.r  != 1.0) \n" +
            //"       fragColor = vec4(tex.rgb, u_blendValue) * a_color_out ; \n" +
          //  "   else \n" +
           "       fragColor = vec4(tex.rgb, u_blendValue) ;   \n" +
           // "       fragColor =  a_color_out; \n" +
           // Godray
            // "   if(u_isGodRay_scenePass == 1) \n" +
            // "   {\n" +
            // "       fragColor = a_color_out; \n" +
            // "   }\n" +
           
            "} \n";

        var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
        gl.compileShader(fragmentShaderObject);

        if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(fragmentShaderObject);
            if (error.length > 0) {
                var errorStr = "ERROR: Fourier Fragment Shader Compilation: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //SHADER PROGRAM
        this.shaderProgramObject = gl.createProgram();
        gl.attachShader(this.shaderProgramObject, vertexShaderObject);
        gl.attachShader(this.shaderProgramObject, fragmentShaderObject);

        //pre-linking binding the attributes
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_POSITION, "a_position");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_TEXTURE0, "a_texcoord");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_COLOR, "a_color");

        // Shader Program Linking
        gl.linkProgram(this.shaderProgramObject);

        if (gl.getProgramParameter(this.shaderProgramObject, gl.LINK_STATUS) == false) {
            var error = gl.getProgramInfoLog(this.shaderProgramObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Fourier Shader Program Object Linking: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //get uniform location
        this.uniforms.textureSampler = gl.getUniformLocation(this.shaderProgramObject, "u_TexSampler");
        this.uniforms.blendValue = gl.getUniformLocation(this.shaderProgramObject, "u_blendValue");
        this.uniforms.godRay_sceneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_isGodRay_scenePass");
        // set texture uniforms
        gl.useProgram(this.shaderProgramObject);

        gl.uniform1i(this.uniforms.textureSampler, 0);

        gl.useProgram(null);

        return true;
    },

    //use the program
    use: function () {
        gl.useProgram(this.shaderProgramObject);
        return (this.uniforms);
    },

    //uninit shaders
    uninit: function () {

        if (this.shaderProgramObject) {

            gl.useProgram(this.shaderProgramObject);

            var shaderObjects = gl.getAttachedShaders(this.shaderProgramObject);
            for (let i = 0; i < shaderObjects.length; i++) {
                gl.detachShader(this.shaderProgramObject, shaderObjects[i]);
                gl.deleteShader(shaderObjects[i]);
                shaderObjects[i] = null;
            }

            gl.useProgram(null);

            gl.deleteProgram(this.shaderProgramObject);
            this.shaderProgramObject = null;
        }
    }

};

