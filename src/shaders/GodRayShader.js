const godRayShader = 
{
    godRay_programObj: null,
    uniforms: {},

    init: function() {
        var vertexShaderSourceCode = 
        "#version 300 es \n" +
        "\n" +
        "in vec4 a_position;" +
        "\n" +
        "in vec2 a_texcoord;" +
        "\n" +
        "uniform mat4 u_modelMatrix;" +
        "\n" +
        "uniform mat4 u_viewMatrix;" +
        "\n" +
        "uniform mat4 u_projectionMatrix;" +
        "\n" +
        "out vec2 texcoord;" +
        "\n" +
        "void main(void)" +
        "\n" +
        "{" +
            "gl_Position = a_position;" +
            "\n" +
            "texcoord = a_texcoord;" +
            "\n" +
        "}";
     
        var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShaderObject, vertexShaderSourceCode);
        gl.compileShader(vertexShaderObject);

        if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(vertexShaderObject);

            if (error.length > 0) {
                var errorStr = "ERROR: ERROR: God Rays Vertex Shader Compilation: " + error;
                alert(errorStr);
                return (false);
            }
        }

        var fragmentShaderSourceCode = 
        "#version 300 es \n" +
        "precision highp float; \n" +
        "const int NUM_SAMPLES = 100;" +
        "\n" +
        "in vec2 texcoord;" +
        "\n" +
        "uniform vec2 u_offset; \n" +
        "\n" +
        "uniform float u_exposure;" +
        "\n" +
        "uniform float u_decay;" +
        "\n" +
        "uniform float u_density;" +
        "\n" +
        "uniform float u_weight;" +
        "\n" +
        "uniform mat4 u_modelMatrix;" +
        "\n" +
  //      "uniform int u_currentLight;\n" +
        "uniform mat4 u_viewMatrix;" +
        "\n" +
        "uniform mat4 u_projectionMatrix;" +
        "\n" +
        "uniform vec4 u_lightPositionOnScreen;" +
        "\n" +
        "uniform sampler2D u_godraysampler;" +
        "\n" +
        "out vec4 FragColor;" +
        "\n" +        
        "void main(void)" +
        "{\n" +
            "vec4 lightPosition =  u_projectionMatrix  * u_viewMatrix * u_lightPositionOnScreen;\n" +
            "lightPosition /= lightPosition.w;" +
            "\n" +
            "lightPosition += vec4(1.0);" +
            "\n" +
            "lightPosition *= 0.5;\n" +
            //"vec2 offset = vec2(0.1, 0.06);\n" +
            "vec2 deltaTextCoord = vec2(texcoord - (lightPosition.xy + u_offset));" +
            //"vec2 deltaTextCoord = vec2(texcoord - lightPosition.xy);" +
            "\n" +
            "vec2 textCoo = texcoord;" +
            "\n" +
            "deltaTextCoord *= 1.0 /  float(NUM_SAMPLES) * u_density;" +
            "\n" +
            "float illuminationDecay = 1.0;" +
            "\n" +
            "vec4 myLightSample;" +
            "\n" +
            "for(int i=0; i < NUM_SAMPLES ; i++)" +
            "{\n" +
                "textCoo -= deltaTextCoord;" +
                "\n" +
                "myLightSample = texture(u_godraysampler, textCoo);" +
                "\n" +
                "myLightSample *= illuminationDecay * u_weight;" +
                "\n" +
                "FragColor += myLightSample;" +
                "\n" +
                "illuminationDecay *= u_decay;" +
                "\n" +
            "}\n" +
            "FragColor *= u_exposure;\n" +
            //"FragColor = vec4(FragColor.rgb, 1.0);" +
            "\n" +
        "}";

        var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
        gl.compileShader(fragmentShaderObject);

        if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(fragmentShaderObject);
            if (error.length > 0) {
                var errorStr = "ERROR: God Rays Fragment Shader Compilation: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //SHADER PROGRAM
        this.godRay_programObj = gl.createProgram();
        gl.attachShader(this.godRay_programObj, vertexShaderObject);
        gl.attachShader(this.godRay_programObj, fragmentShaderObject);

        //pre-linking binding the attributes
        gl.bindAttribLocation(this.godRay_programObj, webGLMacros.DG_ATTRIBUTE_POSITION, "a_position");
        gl.bindAttribLocation(this.godRay_programObj, webGLMacros.DG_ATTRIBUTE_TEXTURE0, "a_texcoord");

        // Shader Program Linking
        gl.linkProgram(this.godRay_programObj);

        if (gl.getProgramParameter(this.godRay_programObj, gl.LINK_STATUS) == false) {
            var error = gl.getProgramInfoLog(this.godRay_programObj);

            if (error.length > 0) {
                var errorStr = "ERROR: God Ray Shader Program Object Linking: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //get uniform location
        this.uniforms.modelMatrixUniform = gl.getUniformLocation(this.godRay_programObj, "u_modelMatrix");
        this.uniforms.viewMatrixUniform = gl.getUniformLocation(this.godRay_programObj, "u_viewMatrix");
        this.uniforms.projectionMatrixUniform = gl.getUniformLocation(this.godRay_programObj, "u_projectionMatrix");

        this.uniforms.exposureUniform = gl.getUniformLocation(this.godRay_programObj, "u_exposure");
        this.uniforms.decayUniform = gl.getUniformLocation(this.godRay_programObj, "u_decay");
        this.uniforms.densityUniform = gl.getUniformLocation(this.godRay_programObj, "u_density");
        this.uniforms.weightUniform = gl.getUniformLocation(this.godRay_programObj, "u_weight");
        this.uniforms.lightPositionUniform = gl.getUniformLocation(this.godRay_programObj, "u_lightPositionOnScreen");
        this.uniforms.lightPositionOffsetUniform = gl.getUniformLocation(this.godRay_programObj, "u_offset");
        this.uniforms.godRaySampler = gl.getUniformLocation(this.godRay_programObj, "u_godraysampler");
        
        gl.useProgram(this.godRay_programObj);
        gl.uniform1i(this.uniforms.godRaySampler, 0);
        gl.useProgram(null);
        
        console.log("Init Successfull God Ray \n");
        return true;
    },
    //use the program
    use: function () {
        gl.useProgram(this.godRay_programObj);
        return (this.uniforms);
    },

    //uninit shaders
    uninit: function () {

        if (this.godRay_programObj) {

            gl.useProgram(this.godRay_programObj);

            var shaderObjects = gl.getAttachedShaders(this.godRay_programObj);
            for (let i = 0; i < shaderObjects.length; i++) {
                gl.detachShader(this.godRay_programObj, shaderObjects[i]);
                gl.deleteShader(shaderObjects[i]);
                shaderObjects[i] = null;
            }

            gl.useProgram(null);

            gl.deleteProgram(this.godRay_programObj);
            this.godRay_programObj = null;
        }
    }
};