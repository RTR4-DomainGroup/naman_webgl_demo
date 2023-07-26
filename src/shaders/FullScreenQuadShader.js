const fsQuadShader = {
    shaderProgramObject: 0,
    uniforms: {},

    init: function () 
    {
        // Vertex Shader
        var vertexShaderSrcCode = 
            "#version 300 es" +
            "\n" +            
            "in vec4 a_position;" +
            "\n" +
            "in vec2 a_texcoord;" +
            "\n" +
            "out vec2 a_texcoord_out0;" +
            "\n" +
            "void main(void)" +
            "\n" +
            "{" +
                "gl_Position =  a_position;" +
                "a_texcoord_out0 = a_texcoord;" +
                "\n" +
            "}";
        var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShaderObject, vertexShaderSrcCode);
        gl.compileShader(vertexShaderObject);

        if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(vertexShaderObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Full Screen Quad Vertex Shader Compilation: " + error;
                alert(errorStr);
                return (false);
            }
        }
        
        var fragmentShaderSourceCode =
        "#version 300 es" +
        "\n" +
        "precision highp float; \n" +
        "in vec2 a_texcoord_out0;" +
        "\n" +
        "uniform float u_mixValue;" +
        "\n" +
        "uniform int u_isGodRay;" +
        "\n" +
        "uniform sampler2D u_textureSampler0;" +
        "\n" +
        "uniform sampler2D u_textureSampler1;\n" +
        "uniform sampler2D u_textureSampler2;\n" +
        "uniform sampler2D u_textureSampler3;\n" +
        "uniform sampler2D u_textureSampler4;\n" +
        "uniform sampler2D u_textureSampler5;\n" +
        "out vec4 FragColor;" +
        "\n" +
        "void main(void)" +
        "{" +
            //"FragColor = mix(texture(u_textureSampler0, a_texcoord_out0), texture(u_textureSampler1, a_texcoord_out1), 0.5);"
            "if(u_isGodRay == 1)" +
            "\n" +
            "{" +
                "\n" +
                "FragColor = texture(u_textureSampler0, a_texcoord_out0) +" + 
                            "texture(u_textureSampler1, a_texcoord_out0) +" + 
                            "texture(u_textureSampler2, a_texcoord_out0) +" +
                            "texture(u_textureSampler3, a_texcoord_out0) +" +
                            "texture(u_textureSampler4, a_texcoord_out0) +" +
                            "texture(u_textureSampler5, a_texcoord_out0);\n" +
                "\n" +
            "}"+
            "else \n" +
            "{\n" +
                "vec4 baseImage = texture(u_textureSampler1, a_texcoord_out0); \n" +
                "if(baseImage.a < 0.1) \n" +
                    "discard; \n" +
                
                "FragColor = baseImage * u_mixValue; \n" +
            "}\n"+
        "}";

        var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
        gl.compileShader(fragmentShaderObject);

        if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(fragmentShaderObject);
            if (error.length > 0) {
                var errorStr = "ERROR: Full Screen Quad Fragment Shader Compilation: " + error;
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
                var errorStr = "ERROR: Full Screen Shader Program Object Linking: " + error;
                alert(errorStr);
                return (false);
            }
        }

        this.uniforms.isGodRayUniform = gl.getUniformLocation(this.shaderProgramObject, "u_isGodRay");
        this.uniforms.mixValueUniform = gl.getUniformLocation(this.shaderProgramObject, "u_mixValue");
        this.uniforms.textureSampler_fp0Uniform = gl.getUniformLocation(this.shaderProgramObject, "u_textureSampler0");
        this.uniforms.textureSampler_fp1Uniform = gl.getUniformLocation(this.shaderProgramObject, "u_textureSampler1");
        this.uniforms.textureSampler_fp2Uniform = gl.getUniformLocation(this.shaderProgramObject, "u_textureSampler2");
        this.uniforms.textureSampler_fp3Uniform = gl.getUniformLocation(this.shaderProgramObject, "u_textureSampler3");
        this.uniforms.textureSampler_fp4Uniform = gl.getUniformLocation(this.shaderProgramObject, "u_textureSampler4");
        this.uniforms.textureSampler_fp5Uniform = gl.getUniformLocation(this.shaderProgramObject, "u_textureSampler5");

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
}
