/*********** Fullscreen Shader ***********/

const depthQuadShader = {

    shaderProgramObject: 0,
    uniforms: {},

    init: function () {

        //----------- SHADER SOURCE CODE -----------//

        //VERTEX SHADER
        var vertexShaderSourceCode =
            "#version 300 es \n" +
            "\n" +

            "in vec4 a_position; \n" +
			"in vec2 a_texcoord; \n" +           
            "out vec2 a_texcoord_out; \n" +

            "void main(void) \n" +
            "{ \n" +

            "   a_texcoord_out = a_texcoord; \n" +
            "   gl_Position = a_position; \n" +

            "} \n";

        var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShaderObject, vertexShaderSourceCode);
        gl.compileShader(vertexShaderObject);

        if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(vertexShaderObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Quad Vertex Shader Compilation: " + error;
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

            "uniform sampler2D tex1Sampler; \n" +
            "uniform float near_plane; \n" +
            "uniform float far_plane; \n" +
            "float LinearizeDepth(float depth) \n" +
            "{ \n" +
            "float z = depth * 2.0 - 1.0; \n" +
            "return (2.0 * near_plane * far_plane) / (far_plane + near_plane - z * (far_plane - near_plane)); \n" +
            "} \n" +

            "out vec4 fragColor; \n" +

            "void main(void) \n" +
            "{ \n" +

            "float depthValue = texture(tex1Sampler, a_texcoord_out).r; \n" +
            "fragColor = vec4(vec3(LinearizeDepth(depthValue) / far_plane), 1.0); \n" +

            "} \n";

        var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
        gl.compileShader(fragmentShaderObject);

        if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(fragmentShaderObject);
            if (error.length > 0) {
                var errorStr = "ERROR: Quad Fragment Shader Compilation: " + error;
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

        // Shader Program Linking
        gl.linkProgram(this.shaderProgramObject);

        if (gl.getProgramParameter(this.shaderProgramObject, gl.LINK_STATUS) == false) {
            var error = gl.getProgramInfoLog(this.shaderProgramObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Quad Shader Program Object Linking: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //get uniform location
        this.uniforms.farUniform = gl.getUniformLocation(this.shaderProgramObject, "far_plane");
        this.uniforms.nearUniform = gl.getUniformLocation(this.shaderProgramObject, "near_plane");
        this.uniforms.texture1SamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "tex1Sampler");

        // set texture uniforms
        gl.useProgram(this.shaderProgramObject);

        gl.uniform1i(this.uniforms.texture1SamplerUniform, 0);

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

