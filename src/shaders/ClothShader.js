/*********** Phong ADS Light Shader ***********/

const clothShader = {

    shaderProgramObject: 0,
    uniforms: {},

    init: function () {

        //----------- SHADER SOURCE CODE -----------//

        //VERTEX SHADER
        var vertexShaderSourceCode =
            "#version 300 es \n" +
            "\n" +

            "precision lowp int; \n" +

            "in vec4 a_position; \n" +
            "in vec4  a_color; \n" +
            //"in vec3 a_normal; \n" +
            "in vec2 a_texcoord; \n" +

            "uniform mat4 u_modelMatrix; \n" +
            "uniform mat4 u_viewMatrix; \n" +
            "uniform mat4 u_projectionMatrix; \n" +
            "out vec4 a_color_out;\n" +
            "out vec2 a_texcoord_out;\n" +

            "void main(void) \n" +
            "{ \n" +
                "a_texcoord_out = a_texcoord; \n" +
                "gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position; \n" +
                "a_color_out = a_color;\n" +
            "} \n";
        
        var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShaderObject, vertexShaderSourceCode);
        gl.compileShader(vertexShaderObject);

        if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(vertexShaderObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Cloth Light Vertex Shader Compilation: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //FRAGMENT SHADER
        var fragmentShaderSourceCode =
            "#version 300 es \n" +
            "\n" +
            "precision highp float; \n" +

            "in vec4 a_color_out;\n" +
            "in vec2 a_texcoord_out;\n" +

            "uniform sampler2D u_diffuseTexSampler;\n" +
            "uniform float u_alphaCloth; \n" +

            "out vec4 FragColor; \n" +

            "void main(void) \n" +
            "{ \n" +
                "vec4 texColor = texture(u_diffuseTexSampler, a_texcoord_out); \n" +
                "if(texColor.a < 0.1)\n" +
                "discard; \n" +
                "vec3 newTexColor = vec3(texColor.r * u_alphaCloth, texColor.g * u_alphaCloth, texColor.b * u_alphaCloth); \n" +

                "FragColor = vec4(newTexColor.rgb, 1.0); \n" +
            "} \n";

        var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
        gl.compileShader(fragmentShaderObject);

        if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(fragmentShaderObject);
            if (error.length > 0) {
                var errorStr = "ERROR: Cloth Light Fragment Shader Compilation: " + error;
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
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_NORMAL, "a_normal");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_TEXTURE0, "a_texcoord");

        // Shader Program Linking
        gl.linkProgram(this.shaderProgramObject);

        if (gl.getProgramParameter(this.shaderProgramObject, gl.LINK_STATUS) == false) {
            var error = gl.getProgramInfoLog(this.shaderProgramObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Cloth Light Shader Program Object Linking: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //get uniform location
        this.uniforms.modelMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_modelMatrix");
        this.uniforms.viewMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_viewMatrix");
        this.uniforms.projectionMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_projectionMatrix");

        this.uniforms.clothTextureSampler = gl.getUniformLocation(this.shaderProgramObject, "u_diffuseTexSampler");
        this.uniforms.alphaClothUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaCloth");


        // set texture uniforms
        gl.useProgram(this.shaderProgramObject);

        gl.uniform1i(this.uniforms.clothTextureSampler, 0);

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


