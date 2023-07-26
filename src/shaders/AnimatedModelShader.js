/*********** Skeletal Animation Shader ***********/

const animatedModelShader = {

    shaderProgramObject: 0,
    uniforms: {},

    init: function () {

        //----------- SHADER SOURCE CODE -----------//

        //VERTEX SHADER
        var vertexShaderSourceCode =
		    "#version 300 es \n" 																			    +
		    "\n" 																							    +
            "precision lowp int; \n" +
            "in vec4 a_position; \n"                                                                            +
		    "in vec3 a_normal; \n" 																				+
            "in vec2 a_texcoord; \n"                                                                            +

            //in attributes
            "in vec4 a_boneIds; \n" +
            "in vec4 a_boneWeight; \n" +
            "in vec4 a_gr_color;\n" +

            "#define NUM_POSLIGHT 4 \n"                                                                         +
            "#define NUM_SPOTLIGHT 5 \n"                                                                        +

		    "uniform mat4 u_modelMatrix; \n" 																    +
		    "uniform mat4 u_viewMatrix; \n" 																	+
		    "uniform mat4 u_projectionMatrix; \n" 															    +
		    "uniform vec4 u_poslightPosition[NUM_POSLIGHT]; \n" 					        					+
            "uniform vec4 u_spotlightPosition[NUM_SPOTLIGHT]; \n"                                               +

            // Shadow Uniforms
            "uniform int u_actualScene; \n" +
            "uniform int u_depthScene; \n" +
            "uniform int u_depthQuadScene; \n" +
            "uniform mat4 lightSpaceMatrix; \n" +

            //skeletal anim
            "const int MAX_BONES = 100; \n"                                                                     +
            "const int MAX_BONE_INFLUENCE = 4; \n"                                                              +
            "uniform mat4 u_finalBonesMatrices[MAX_BONES]; \n"                                                  +
            //out variables
            "out vec4 FragPos; \n" +
            "out vec3 Normal; \n" +
            "out vec2 TexCoords; \n" +
            "out vec4 FragPosLightSpace; \n" +
            "out vec4 a_color_out;\n" +            

		    "out vec3 transformedNormals; \n" 																	+
		    "out vec3 viewerVector; \n" 																		+
            "out vec2 a_texcoord_out; \n"                                                                       +

		    "out vec3 poslightDirection[NUM_POSLIGHT]; \n" 														+

            "out vec3 spotlightDirection[NUM_SPOTLIGHT]; \n"                                                    +
            "out float spotlightDistance[NUM_SPOTLIGHT]; \n"                                                    +

            //for normal mapping
            "out vec4 worldPos; \n" +
            "out vec3 tNormal; \n" +

		    "void main(void) \n" 																				+
            "{ \n"                                                                                              +
            //"vec4 worldPos; \n" +
            "a_color_out = a_gr_color;\n" +
            "if(u_actualScene == 1)\n" +
            "{ \n" +
                "worldPos = u_modelMatrix * a_position; \n" +
			    "vec4 eyeCoordinates = u_viewMatrix * worldPos; \n" 				                            +
			    "mat3 normalMatrix = mat3(u_viewMatrix * u_modelMatrix); \n" 							        +
			    "transformedNormals = normalMatrix * a_normal; \n" 											    +
			    "for(int i = 0; i < NUM_POSLIGHT; i++) \n" 													    +
			    "{ \n" 																						    +
				    "poslightDirection[i] = vec3(u_poslightPosition[i]) - worldPos.xyz; \n" 				    +
			    "} \n" 																						    +
                
                "for(int i = 0; i < NUM_SPOTLIGHT; i++) \n"                                                     +
                "{ \n"                                                                                          +
                    "spotlightDirection[i] = vec3(u_spotlightPosition[i]) - worldPos.xyz; \n"                   +
                    "spotlightDistance[i] = length(u_spotlightPosition[i] - a_position); \n"                    +
                "} \n"                                                                                          +

                "viewerVector = -eyeCoordinates.xyz; \n"                                                        +
                "a_texcoord_out = a_texcoord; \n"                                                               +

                //skeletal anim
                "mat4 boneTransform; \n"                                                                        +
                "boneTransform  = a_boneWeight.x * u_finalBonesMatrices[int(round(a_boneIds.x))]; \n"           +
                "boneTransform += a_boneWeight.y * u_finalBonesMatrices[int(round(a_boneIds.y))]; \n"           +
                "boneTransform += a_boneWeight.z * u_finalBonesMatrices[int(round(a_boneIds.z))]; \n"           +
                "boneTransform += a_boneWeight.w * u_finalBonesMatrices[int(round(a_boneIds.w))]; \n" +

                "vec4 tPosition = boneTransform * a_position; \n "                                              +
                "tNormal   = (boneTransform * vec4(a_normal, 0.0)).xyz; \n "                               +

                // shadow
                "FragPos = u_modelMatrix * a_position; \n" +
                "Normal = mat3(transpose(inverse(u_modelMatrix))) * a_normal; \n" +
                "FragPosLightSpace = lightSpaceMatrix * FragPos; \n" +

                //gl_Position
                "gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * tPosition; \n"               +
            "} \n" +

            "if(u_depthScene == 1)\n" +
            "{ \n" +
                //skeletal anim
                "mat4 boneTransform; \n" +
                "boneTransform  = a_boneWeight.x * u_finalBonesMatrices[int(round(a_boneIds.x))]; \n" +
                "boneTransform += a_boneWeight.y * u_finalBonesMatrices[int(round(a_boneIds.y))]; \n" +
                "boneTransform += a_boneWeight.z * u_finalBonesMatrices[int(round(a_boneIds.z))]; \n" +
                "boneTransform += a_boneWeight.w * u_finalBonesMatrices[int(round(a_boneIds.w))]; \n" +

                "vec4 tPosition = boneTransform * a_position; \n " +
                "tNormal   = (boneTransform * vec4(a_normal, 0.0)).xyz; \n " +

                "gl_Position = lightSpaceMatrix * u_modelMatrix * tPosition; \n" +
            "} \n" +

            "if(u_depthQuadScene == 1)\n" +
            "{" +
            "\n" +
                "a_texcoord_out = a_texcoord;\n" +
                "gl_Position = a_position; \n" +
            "} \n" +

        "} \n";

        var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShaderObject, vertexShaderSourceCode);
        gl.compileShader(vertexShaderObject);

        if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(vertexShaderObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Animated Model Vertex Shader Compilation: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //FRAGMENT SHADER
        var fragmentShaderSourceCode =
            "#version 300 es \n" +
            "\n" +

            "precision highp float; \n" +
            "precision lowp int; \n" +


            "#define NUM_POSLIGHT 4 \n" +
            "#define NUM_SPOTLIGHT 5 \n " +

            "in vec3 poslightDirection[NUM_POSLIGHT]; \n" +
            "in vec3 spotlightDirection[NUM_SPOTLIGHT]; \n" +
            "in float spotlightDistance[NUM_SPOTLIGHT]; \n" +

            "in vec3 transformedNormals; \n" +
            "in vec3 viewerVector; \n" +
            "in vec2 a_texcoord_out; \n" +
            "in vec4 a_color_out; \n" +
            "uniform float u_alphaBlending; \n" +

            //for normal mapping
            "uniform sampler2D u_NormalTexSampler;\n" +

            "uniform sampler2D u_diffuseTexSampler;\n" +
            "uniform vec3 u_poslightAmbient[NUM_POSLIGHT]; \n" +
            "uniform vec3 u_poslightDiffuse[NUM_POSLIGHT]; \n" +
            "uniform vec3 u_poslightSpecular[NUM_POSLIGHT]; \n" +
            "uniform float u_materialShininess; \n" +
            "uniform float u_alphaPoslight[NUM_POSLIGHT]; \n" +

            "uniform vec3 u_spotlightAmbient[NUM_SPOTLIGHT]; \n" +
            "uniform vec3 u_spotlightDiffuse[NUM_SPOTLIGHT]; \n" +
            "uniform vec3 u_spotlightSpecular[NUM_SPOTLIGHT]; \n" +
            "uniform vec3 u_spotDirection[NUM_SPOTLIGHT]; \n" +
            "uniform float u_constantAttenuation[NUM_SPOTLIGHT]; \n" +
            "uniform float u_linearAttenuation[NUM_SPOTLIGHT]; \n" +
            "uniform float u_quadraticAttenuation[NUM_SPOTLIGHT]; \n" +
            "uniform float u_spotCutoff[NUM_SPOTLIGHT]; \n" +
            "uniform float u_spotOuterCutoff[NUM_SPOTLIGHT]; \n" +
            "uniform float u_alphaSpotlight[NUM_SPOTLIGHT]; \n" +

            "out vec4 FragColor; \n" +

            // Taken from VS For Shadow
            "uniform vec4 u_poslightPosition[NUM_POSLIGHT]; \n" +

            // Shadow in variables

            "in vec4 FragPos; \n" +
            "in vec3 Normal; \n" +
            "in vec2 TexCoords; \n" +
            "in vec4 FragPosLightSpace; \n" +

            // shadow Uniforms
            "uniform int u_actualScene; \n" +
            "uniform int u_depthScene; \n" +
            "uniform int u_depthQuadScene; \n" +

            "uniform sampler2D shadowMap; \n" +
            "uniform int u_isGodRay_scenePass; \n" +
            // Exposure tone Mapping
            "uniform float exposure; \n" +
            // Shadow
            "float ShadowCalculation(vec4 fragPosLightSpace) \n" +
            "{ \n" +
                "vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w; \n" +
                "projCoords = projCoords * 0.5 + 0.5; \n" +
                "float closestDepth = texture(shadowMap, projCoords.xy).r; \n" +
                "float currentDepth = projCoords.z; \n" +
                "vec3 normal = normalize(Normal); \n" +
                "vec3 lightDir = normalize(u_poslightPosition[0] - FragPos).xyz; \n" +
                "float bias = max(0.0025 * (1.0 - dot(normal, lightDir)), 0.005); \n" +
                "float shadow = 0.0; \n" +
                "ivec2 texelSize = 1 / textureSize(shadowMap, 0); \n" +
                "for (int x = -1; x <= 1; ++x) \n" +
                "{ \n" +
                    "for (int y = -1; y <= 1; ++y) \n" +
                    "{ \n" +
                        "float pcfDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * vec2(texelSize)).r; \n" +
                        "shadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0; \n" +
                    "} \n" +
                "} \n" +

                "shadow /= 9.0; \n" +
                "if (projCoords.z > 1.0) \n" +
                    "shadow = 0.0; \n" +
                //"float shadow = textureProjOffset(shadowMap, fragPosLightSpace, ivec2(0, 0)); \n" +

            "return shadow; \n" +
            "} \n" +

            // depthQUad Shadow
            "uniform sampler2D depthMap; \n" +
            "uniform float near_plane; \n" +
            "uniform float far_plane; \n" +
            "float LinearizeDepth(float depth) \n" +
            "{ \n" +
            "float z = depth * 2.0 - 1.0; \n" +
            "return (2.0 * near_plane * far_plane) / (far_plane + near_plane - z * (far_plane - near_plane)); \n" +
            "} \n" +

            //normal mapping variables
            "vec3 poslightDirectionNM[NUM_POSLIGHT]; \n" +
            "vec3 spotlightDirectionNM[NUM_SPOTLIGHT]; \n" +
            "vec3 viewerVectorNM; \n" +
            "vec3 T ;\n" +
            "vec3 B ;\n" +
            "vec3 N ;\n" +
            "mat3 TBN ;\n" +
            "in vec4 worldPos; \n" +
            "in vec3 tNormal; \n" +

            //GET NORMAP FROM NORMAL MAP
            "vec3 getNormalFromMap() \n" +
            "{ \n" +
            "vec3 tangentNormal = texture(u_NormalTexSampler, a_texcoord_out).xyz * 2.0 - 1.0; \n" +

            "vec3 Q1 = dFdx(worldPos.xyz); \n" +
            "vec3 Q2 = dFdy(worldPos.xyz); \n" +
            "vec2 st1 = dFdx(a_texcoord_out); \n" +
            "vec2 st2 = dFdy(a_texcoord_out); \n" +

            "N = normalize(tNormal); \n" +
            "T = normalize(Q1 * st2.t - Q2 * st1.t); \n" +
            "B = -normalize(cross(N, T)); \n" +
            "TBN = mat3(T, B, N); \n" +

            "return normalize(TBN * tangentNormal); \n" +
            "} \n" +

            "vec3 poslightCalculation() \n" +
            "{ \n" +
            "vec3 light = vec3(0.0, 0.0, 0.0); \n" +
            //normal mapping change
            "vec3 normalized_transformed_normals = normalize(texture(u_NormalTexSampler,a_texcoord_out).rgb*2.0 - vec3(1.0)); \n" +
            "viewerVectorNM = normalize(viewerVector); \n" +
            "vec3 normalized_viewer_vector = viewerVectorNM; \n" +

            "vec3 ambient[NUM_POSLIGHT]; \n" +
            "vec3 normalized_light_direction[NUM_POSLIGHT]; \n" +
            "vec3 diffuse[NUM_POSLIGHT]; \n" +
            "vec3 reflectionVector[NUM_POSLIGHT]; \n" +
            "vec3 specular[NUM_POSLIGHT]; \n" +
            "vec3 texColor = vec3(texture(u_diffuseTexSampler, a_texcoord_out)); \n" +

			    "for(int i = 0; i < NUM_POSLIGHT; i++) \n" 																						                                            +
			    "{ \n" 																													                                                    +
                    //normal mapping change
                    "poslightDirectionNM[i] = normalize(poslightDirection[i]); \n" +
                    "poslightDirectionNM[i] = normalize(vec3(dot(poslightDirectionNM[i],T), dot(poslightDirectionNM[i],B),dot(poslightDirectionNM[i],N))); \n" +


                    "ambient[i] = u_poslightAmbient[i] * texColor \n; \n" +
				    "normalized_light_direction[i] = normalize(poslightDirectionNM[i]); \n" 													                                                +
				    "diffuse[i] = u_poslightDiffuse[i] * texColor * max(dot(normalized_light_direction[i], normalized_transformed_normals), 0.0) * u_alphaPoslight[i]; \n"                  +
				    "reflectionVector[i] = reflect(-normalized_light_direction[i], normalized_transformed_normals); \n" 				                                                    +
                    "specular[i] = u_poslightSpecular[i] * pow(max(dot(reflectionVector[i], normalized_viewer_vector), 0.0), u_materialShininess); \n" +
                "} \n"                                                                                                                                                                      +

                "float shadow = ShadowCalculation(FragPosLightSpace); \n" +
                "light = ambient[0] +  ((1.0 - shadow)*diffuse[0] + (1.0 - shadow)*specular[0]); \n" +

                "for(int i = 1; i < NUM_POSLIGHT; i++) \n" +
                "{ \n" +
                    "light = light + ambient[i] + diffuse[i] + specular[i]; \n" +
                "} \n" +

                "return(light); \n" +
		    "} \n"                                                                                                                                                                          +

            "vec3 spotlightCalculation() \n" +
            "{\n" +
                "vec3 light; \n" +
                "vec3 ambient[NUM_SPOTLIGHT]; \n" +
                "vec3 diffuse[NUM_SPOTLIGHT]; \n" +
                "vec3 specular[NUM_SPOTLIGHT]; \n" +
                //normal mapping change
                "vec3 normalized_transformed_normals = normalize(texture(u_NormalTexSampler,a_texcoord_out).rgb*2.0 - vec3(1.0)); \n" +
                "viewerVectorNM = normalize(viewerVector); \n" +
                "vec3 normalized_viewer_vector = viewerVectorNM; \n" +

                "vec3 texColor = vec3(texture(u_diffuseTexSampler, a_texcoord_out)); \n" +
                "vec3 normalized_light_direction[NUM_SPOTLIGHT]; \n" +

                "float theta[NUM_SPOTLIGHT]; \n" +
                "float epsilon[NUM_SPOTLIGHT]; \n" +
                "float intensity[NUM_SPOTLIGHT]; \n" +
                "float attenuation[NUM_SPOTLIGHT]; \n" +

                "for(int i = 0; i < NUM_SPOTLIGHT; i++) \n" +
                "{ \n" +

                    //normal mapping change
                    "spotlightDirectionNM[i] = normalize(spotlightDirection[i]); \n" +
                    "spotlightDirectionNM[i] = normalize(vec3(dot(spotlightDirectionNM[i],T), dot(spotlightDirectionNM[i],B),dot(spotlightDirectionNM[i],N))); \n" +

                    "ambient[i] = u_spotlightAmbient[i] * texColor; \n" +

                    "normalized_light_direction[i] = normalize(spotlightDirectionNM[i]); \n" +
                    "diffuse[i] = u_spotlightDiffuse[i] * texColor * max(dot(normalized_light_direction[i], normalized_transformed_normals), 0.0) * u_alphaSpotlight[i]; \n" +

                    "vec3 reflectionVector = reflect(-normalized_light_direction[i], normalized_transformed_normals); \n" +
                    "specular[i] = u_spotlightSpecular[i] * pow(max(dot(reflectionVector, normalized_viewer_vector), 0.0), u_materialShininess); \n" +

                    "theta[i] = dot(normalized_light_direction[i], normalize(-u_spotDirection[i])); \n" +
                    "epsilon[i] = (u_spotCutoff[i] - u_spotOuterCutoff[i]); \n" +
                    "intensity[i] = clamp((theta[i] - u_spotOuterCutoff[i]) / epsilon[i], 0.0, 1.0); \n" +

                    "diffuse[i] = diffuse[i] * intensity[i]; \n" +
                    "specular[i] = specular[i] * intensity[i]; \n" +

                    "attenuation[i] = (1.0 / (u_constantAttenuation[i] + (u_linearAttenuation[i] * spotlightDistance[i]) + (u_quadraticAttenuation[i] * spotlightDistance[i] * spotlightDistance[i]))); \n" +

                    "ambient[i] = ambient[i] * attenuation[i]; \n" +
                    "diffuse[i] = diffuse[i] * attenuation[i]; \n" +
                    "specular[i] = specular[i] * attenuation[i]; \n" +

                    "light = light + ambient[i] + diffuse[i] + specular[i]; \n" +
                "} \n" +
                "return(light); \n" +
            "}\n" +

            "void main(void) \n" +
            "{ \n" +
                "vec3 phong_ads_color = vec3(1.0, 1.0, 1.0); \n" +
                "if(u_actualScene == 1) { \n" +

                "phong_ads_color = poslightCalculation(); \n" +
                "phong_ads_color = phong_ads_color + spotlightCalculation(); \n" +

                // "const float gamma = 1.0; \n" +
                // "vec3 mapped = vec3(1.0) - exp(-phong_ads_color * exposure); \n" +
                // //"vec3 mapped = phong_ads_color / (phong_ads_color + vec3(1.0)); \n" +
                // "mapped = pow(mapped, vec3(1.0 / gamma)); \n" +

                // "FragColor = vec4(mapped, 1.0); \n" +

                "FragColor = vec4(phong_ads_color, u_alphaBlending); \n" +
                
            "}\n" +
            "if(u_isGodRay_scenePass == 1) \n" +
            "{\n" +
            "    FragColor = a_color_out; \n" +
            "}\n" +
            "else\n" +
            "{\n" +
                //"FragColor = vec4(phong_ads_color, 1.0); \n" +
            "}\n" +
            "if(u_depthScene == 1)" +
            "{ \n" +
            "FragColor = vec4(1.0); \n" +
            "} \n" +

            "} \n";

        var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
        gl.compileShader(fragmentShaderObject);


        if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
            var error = gl.getShaderInfoLog(fragmentShaderObject);
            if (error.length > 0) {
                var errorStr = "ERROR: Animated Model Fragment Shader Compilation: " + error;
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
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_COLOR, "a_gr_color");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_NORMAL, "a_normal");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_TEXTURE0, "a_texcoord");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_BONE_ID, "a_boneIds");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.DG_ATTRIBUTE_BONE_WEIGHT, "a_boneWeight");

        // Shader Program Linking
        gl.linkProgram(this.shaderProgramObject);

        if (gl.getProgramParameter(this.shaderProgramObject, gl.LINK_STATUS) == false) {
            var error = gl.getProgramInfoLog(this.shaderProgramObject);

            if (error.length > 0) {
                var errorStr = "ERROR: Animated Model Shader Program Object Linking: " + error;
                alert(errorStr);
                return (false);
            }
        }

        //get uniform location
        this.uniforms.modelMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_modelMatrix");
        this.uniforms.viewMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_viewMatrix");
        this.uniforms.projectionMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_projectionMatrix");

        this.uniforms.alphaBlendingUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaBlending");

        this.uniforms.posLAZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightAmbient[0]");
        this.uniforms.posLDZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightDiffuse[0]");
        this.uniforms.posLSZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightSpecular[0]");;
        this.uniforms.poslightPositionZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightPosition[0]");

        // this.uniforms.posLAOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightAmbient[1]");
        // this.uniforms.posLDOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightDiffuse[1]");
        // this.uniforms.posLSOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightSpecular[1]");;
        // this.uniforms.poslightPositionOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightPosition[1]");

        // this.uniforms.posLATwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightAmbient[2]");
        // this.uniforms.posLDTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightDiffuse[2]");
        // this.uniforms.posLSTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightSpecular[2]");;
        // this.uniforms.poslightPositionTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightPosition[2]");

        this.uniforms.posLAThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightAmbient[3]");
        this.uniforms.posLDThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightDiffuse[3]");
        this.uniforms.posLSThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightSpecular[3]");;
        this.uniforms.poslightPositionThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_poslightPosition[3]");

        this.uniforms.kShininessUniform = gl.getUniformLocation(this.shaderProgramObject, "u_materialShininess");
        this.uniforms.diffuseTextureSamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "u_diffuseTexSampler");
        this.uniforms.normalTextureSamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "u_NormalTexSampler");

        this.uniforms.spotlightLAZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightAmbient[0]");
        this.uniforms.spotlightLDZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightDiffuse[0]");
        this.uniforms.spotlightLSZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightSpecular[0]");
        this.uniforms.spotlightPositionZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightPosition[0]");
        this.uniforms.spotDirectionZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotDirection[0]");
        this.uniforms.constantAttenuationZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_constantAttenuation[0]");
        this.uniforms.linearAttenuationZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_linearAttenuation[0]");
        this.uniforms.quadraticAttenuationZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_quadraticAttenuation[0]");
        this.uniforms.spotCosCutoffZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotCutoff[0]");
        this.uniforms.spotCosOuterCutoffZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotOuterCutoff[0]");

        this.uniforms.spotlightLAOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightAmbient[1]");
        this.uniforms.spotlightLDOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightDiffuse[1]");
        this.uniforms.spotlightLSOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightSpecular[1]");
        this.uniforms.spotlightPositionOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightPosition[1]");
        this.uniforms.spotDirectionOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotDirection[1]");
        this.uniforms.constantAttenuationOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_constantAttenuation[1]");
        this.uniforms.linearAttenuationOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_linearAttenuation[1]");
        this.uniforms.quadraticAttenuationOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_quadraticAttenuation[1]");
        this.uniforms.spotCosCutoffOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotCutoff[1]");
        this.uniforms.spotCosOuterCutoffOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotOuterCutoff[1]");

        this.uniforms.spotlightLATwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightAmbient[2]");
        this.uniforms.spotlightLDTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightDiffuse[2]");
        this.uniforms.spotlightLSTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightSpecular[2]");
        this.uniforms.spotlightPositionTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightPosition[2]");
        this.uniforms.spotDirectionTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotDirection[2]");
        this.uniforms.constantAttenuationTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_constantAttenuation[2]");
        this.uniforms.linearAttenuationTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_linearAttenuation[2]");
        this.uniforms.quadraticAttenuationTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_quadraticAttenuation[2]");
        this.uniforms.spotCosCutoffTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotCutoff[2]");
        this.uniforms.spotCosOuterCutoffTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotOuterCutoff[2]");

        this.uniforms.spotlightLAThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightAmbient[3]");
        this.uniforms.spotlightLDThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightDiffuse[3]");
        this.uniforms.spotlightLSThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightSpecular[3]");
        this.uniforms.spotlightPositionThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightPosition[3]");
        this.uniforms.spotDirectionThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotDirection[3]");
        this.uniforms.constantAttenuationThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_constantAttenuation[3]");
        this.uniforms.linearAttenuationThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_linearAttenuation[3]");
        this.uniforms.quadraticAttenuationThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_quadraticAttenuation[3]");
        this.uniforms.spotCosCutoffThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotCutoff[3]");
        this.uniforms.spotCosOuterCutoffThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotOuterCutoff[3]");

        this.uniforms.spotlightLAFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightAmbient[4]");
        this.uniforms.spotlightLDFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightDiffuse[4]");
        this.uniforms.spotlightLSFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightSpecular[4]");
        this.uniforms.spotlightPositionFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotlightPosition[4]");
        this.uniforms.spotDirectionFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotDirection[4]");
        this.uniforms.constantAttenuationFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_constantAttenuation[4]");
        this.uniforms.linearAttenuationFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_linearAttenuation[4]");
        this.uniforms.quadraticAttenuationFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_quadraticAttenuation[4]");
        this.uniforms.spotCosCutoffFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotCutoff[4]");
        this.uniforms.spotCosOuterCutoffFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_spotOuterCutoff[4]");

        this.uniforms.alphaPoslightZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaPoslight[0]");
        this.uniforms.alphaPoslightOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaPoslight[1]");
        this.uniforms.alphaPoslightTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaPoslight[2]");
        this.uniforms.alphaPoslightThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaPoslight[3]");

        this.uniforms.alphaSpotlightZeroUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaSpotlight[0]");
        this.uniforms.alphaSpotlightOneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaSpotlight[1]");
        this.uniforms.alphaSpotlightTwoUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaSpotlight[2]");
        this.uniforms.alphaSpotlightThreeUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaSpotlight[3]");
        this.uniforms.alphaSpotlightFourUniform = gl.getUniformLocation(this.shaderProgramObject, "u_alphaSpotlight[4]");

        this.uniforms.boneMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_finalBonesMatrices");

        // Godray scene uniform for Black and White and colored passes
        this.uniforms.godRay_sceneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_isGodRay_scenePass");

        this.uniforms.lightSpaceMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "lightSpaceMatrix");
        this.uniforms.shadowMapSamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "shadowMap");

        this.uniforms.actualSceneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_actualScene");
        this.uniforms.depthSceneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_depthScene");
        this.uniforms.depthQuadSceneUniform = gl.getUniformLocation(this.shaderProgramObject, "u_depthQuadScene");

        this.uniforms.farUniform = gl.getUniformLocation(this.shaderProgramObject, "far_plane");
        this.uniforms.nearUniform = gl.getUniformLocation(this.shaderProgramObject, "near_plane");
        this.uniforms.depthTextureSamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "depthMap");
        this.uniforms.exposureUniform = gl.getUniformLocation(this.shaderProgramObject, "exposure");

        // set texture uniforms
        gl.useProgram(this.shaderProgramObject);

        gl.uniform1i(this.uniforms.shadowMapSamplerUniform, 0);
        gl.uniform1i(this.uniforms.diffuseTextureSamplerUniform, 1);
        gl.uniform1i(this.uniforms.normalTextureSamplerUniform, 2);

        
        //gl.uniform1i(this.uniforms.depthTextureSamplerUniform, 8);

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

