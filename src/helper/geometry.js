/*********** Basic Geometry Shapes ***********/

const quad = {

    //vao, vbo variables
    vao_quad: 0,
    vbo_quad: 0,

    


    //init 
    init: function () {

        //vertex interleaved array
        var quadVCNT = new Float32Array(
            [    //vertices                 //color                  //normals                  //texcoords

                //front
                1.0, 1.0, 1.0,              0.0, 0.0, 0.0,          0.0, 0.0, 1.0,              1.0, 1.0,
                -1.0, 1.0, 1.0,             0.0, 0.0, 0.0,          0.0, 0.0, 1.0,              0.0, 1.0,
                -1.0, -1.0, 1.0,            0.0, 0.0, 0.0,          0.0, 0.0, 1.0,              0.0, 0.0,
                1.0, -1.0, 1.0,             0.0, 0.0, 0.0,          0.0, 0.0, 1.0,              1.0, 0.0,
            ]
        );


        //vao and vbo

        this.vao_quad = gl.createVertexArray();
        gl.bindVertexArray(this.vao_quad);

        this.vbo_quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_quad);
        gl.bufferData(gl.ARRAY_BUFFER, quadVCNT, gl.STATIC_DRAW);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 11 * 4, 0);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 11 * 4, 3 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_COLOR);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 11 * 4, 6 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_NORMAL);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 11 * 4, 9 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_TEXTURE0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

    },

    //draw
    draw: function () {

        gl.bindVertexArray(this.vao_quad);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        gl.bindVertexArray(null);
    },

    // uninit
    uninit: function () {

        if (this.vao_quad) {
            gl.deleteVertexArray(this.vao_quad);
            this.vao_quad = null;
        }

        if (this.vbo_quad) {
            gl.deleteBuffer(this.vbo_quad);
            this.vbo_quad = null;
        }
    }
};




const triangle = {

    //vao, vbo variables
    vao_triangle: 0,
    vbo_triangle: 0,

    //init 
    init: function () {

        //vertex interleaved array
        var triangleVCNT = new Float32Array(
            [    //vertices                 //color                  //normals                      //texcoords

                // front					
                0.0, 1.0, 0.0,              1.0, 0.0, 0.0,          0.0, 0.447214, 0.894427,        0.5, 1.0,
                -1.0, -1.0, 1.0,            0.0, 1.0, 0.0,          0.0, 0.447214, 0.894427,        0.0, 0.0,
                1.0, -1.0, 1.0,             0.0, 0.0, 1.0,          0.0, 0.447214, 0.894427,        1.0, 0.0,

            ]
        );


        //vao and vbo

        this.vao_triangle = gl.createVertexArray();
        gl.bindVertexArray(this.vao_triangle);

        this.vbo_triangle = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_triangle);
        gl.bufferData(gl.ARRAY_BUFFER, triangleVCNT, gl.STATIC_DRAW);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 11 * 4, 0);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 11 * 4, 3 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_COLOR);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 11 * 4, 6 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_NORMAL);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 11 * 4, 9 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_TEXTURE0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

    },

    //draw
    draw: function () {

        gl.bindVertexArray(this.vao_triangle);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindVertexArray(null);
    },

    // uninit
    uninit: function () {

        if (this.vao_triangle) {
            gl.deleteVertexArray(this.vao_triangle);
            this.vao_triangle = null;
        }

        if (this.vbo_triangle) {
            gl.deleteBuffer(this.vbo_triangle);
            this.vbo_triangle = null;
        }
    }
};



const cube = {

    //vao, vbo variables
    vao_cube: 0,
    vbo_cube: 0,

    //cubeFacesTex: [6],

    //init 
    init: function () {

        //vertex interleaved array
        var cubeVCNT = new Float32Array(
            [    //vertices                 //color                  //normals                  //texcoords

                //front
                 1.0,  1.0,  1.0,           0.0, 0.0, 0.0,           0.0,  0.0,  1.0,           1.0, 1.0,
                -1.0,  1.0,  1.0,           0.0, 0.0, 0.0,           0.0,  0.0,  1.0,           0.0, 1.0,
                -1.0, -1.0,  1.0,           0.0, 0.0, 0.0,           0.0,  0.0,  1.0,           0.0, 0.0,
                 1.0, -1.0,  1.0,           0.0, 0.0, 0.0,           0.0,  0.0,  1.0,           1.0, 0.0,
                                                                                 
                //right                                                                                                 
                 1.0,  1.0, -1.0,           0.0, 0.0, 0.0,           1.0,  0.0,  0.0,           0.0, 1.0,
                 1.0,  1.0,  1.0,           0.0, 0.0, 0.0,           1.0,  0.0,  0.0,           1.0, 1.0,
                 1.0, -1.0,  1.0,           0.0, 0.0, 0.0,           1.0,  0.0,  0.0,           1.0, 0.0,
                 1.0, -1.0, -1.0,           0.0, 0.0, 0.0,           1.0,  0.0,  0.0,           0.0, 0.0,
                                                                           
                //back                                                                                       
                -1.0,  1.0, -1.0,           0.0, 0.0, 0.0,           0.0,  0.0, -1.0,           0.0, 0.0,
                 1.0,  1.0, -1.0,           0.0, 0.0, 0.0,           0.0,  0.0, -1.0,           1.0, 0.0,
                 1.0, -1.0, -1.0,           0.0, 0.0, 0.0,           0.0,  0.0, -1.0,           1.0, 1.0,
                -1.0, -1.0, -1.0,           0.0, 0.0, 0.0,           0.0,  0.0, -1.0,           0.0, 1.0,
                                                                           
                //left                                                                                       
                -1.0,  1.0,  1.0,           0.0, 0.0, 0.0,          -1.0,  0.0,  0.0,           0.0, 1.0,
                -1.0,  1.0, -1.0,           0.0, 0.0, 0.0,          -1.0,  0.0,  0.0,           1.0, 1.0,
                -1.0, -1.0, -1.0,           0.0, 0.0, 0.0,          -1.0,  0.0,  0.0,           1.0, 0.0,
                -1.0, -1.0,  1.0,           0.0, 0.0, 0.0,          -1.0,  0.0,  0.0,           0.0, 0.0,
                                                                                 
                //top                                                                                    
                 1.0,  1.0, -1.0,           0.0, 0.0, 0.0,           0.0,  1.0,  0.0,           1.0, 1.0,
                -1.0,  1.0, -1.0,           0.0, 0.0, 0.0,           0.0,  1.0,  0.0,           0.0, 1.0,
                -1.0,  1.0,  1.0,           0.0, 0.0, 0.0,           0.0,  1.0,  0.0,           0.0, 0.0,
                 1.0,  1.0,  1.0,           0.0, 0.0, 0.0,           0.0,  1.0,  0.0,           1.0, 0.0,
                                                                                 
                //bottom                                                                                              
                 1.0, -1.0, -1.0,           0.0, 0.0, 0.0,           0.0, -1.0,  0.0,           1.0, 1.0,
                -1.0, -1.0, -1.0,           0.0, 0.0, 0.0,           0.0, -1.0,  0.0,           0.0, 1.0,
                -1.0, -1.0,  1.0,           0.0, 0.0, 0.0,           0.0, -1.0,  0.0,           0.0, 0.0,
                 1.0, -1.0,  1.0,           0.0, 0.0, 0.0,           0.0, -1.0,  0.0,           1.0, 0.0
            ]
        );


        //vao and vbo

        this.vao_cube = gl.createVertexArray();
        gl.bindVertexArray(this.vao_cube);

            this.vbo_cube = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cube);
            gl.bufferData(gl.ARRAY_BUFFER, cubeVCNT, gl.STATIC_DRAW);

            gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 11 * 4, 0);
            gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);

            gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 11 * 4, 3 * 4);
            gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_COLOR);

            gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 11 * 4, 6 * 4);
            gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_NORMAL);

            gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 11 * 4, 9 * 4);
            gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_TEXTURE0);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

    },

    //draw
    drawSingleTex: function () {

        gl.bindVertexArray(this.vao_cube);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);

        gl.bindVertexArray(null);
    },

    //draw
    drawMultipleTex: function (cubeFacesTex) {

        gl.bindVertexArray(this.vao_cube);
            
        gl.bindTexture(gl.TEXTURE_2D, cubeFacesTex[0]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        gl.bindTexture(gl.TEXTURE_2D, cubeFacesTex[1]);
        gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);

        gl.bindTexture(gl.TEXTURE_2D, cubeFacesTex[2]);
        gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);

        gl.bindTexture(gl.TEXTURE_2D, cubeFacesTex[3]);
        gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);

        gl.bindTexture(gl.TEXTURE_2D, cubeFacesTex[4]);
        gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);

        gl.bindTexture(gl.TEXTURE_2D, cubeFacesTex[5]);
        gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);

        gl.bindVertexArray(null);
    },

    // uninit
    uninit: function () {

        if (this.vao_cube) {
            gl.deleteVertexArray(this.vao_cube);
            this.vao_cube = null;
        }

        if (this.vbo_cube) {
            gl.deleteBuffer(this.vbo_cube);
            this.vbo_cube = null;
        }
    }
};




const pyramid = {

    //vao, vbo variables
    vao_pyramid: 0,
    vbo_pyramid: 0,

    //init 
    init: function () {

        //vertex interleaved array
        var pyramidVCNT = new Float32Array(
            [    //vertices                 //color                  //normals                  //texcoords

                // front					
                0.0, 1.0, 0.0,           1.0, 0.0, 0.0,       0.0, 0.447214, 0.894427,          0.5, 1.0,
                -1.0, -1.0, 1.0,         0.0, 1.0, 0.0,       0.0, 0.447214, 0.894427,          0.0, 0.0,
                1.0, -1.0, 1.0,          0.0, 0.0, 1.0,       0.0, 0.447214, 0.894427,          1.0, 0.0,

                // right				                                                                    
                0.0, 1.0, 0.0,           1.0, 0.0, 0.0,       0.894427, 0.447214, 0.0,          0.5, 1.0,
                1.0, -1.0, 1.0,          0.0, 0.0, 1.0,       0.894427, 0.447214, 0.0,          1.0, 0.0,
                1.0, -1.0, -1.0,         0.0, 1.0, 0.0,       0.894427, 0.447214, 0.0,          0.0, 0.0,

                // back					                                                                    
                0.0, 1.0, 0.0,           1.0, 0.0, 0.0,       0.0, 0.447214, -0.894427,         0.5, 1.0,
                1.0, -1.0, -1.0,         0.0, 1.0, 0.0,       0.0, 0.447214, -0.894427,         1.0, 0.0,
                -1.0, -1.0, -1.0,        0.0, 0.0, 1.0,       0.0, 0.447214, -0.894427,         0.0, 0.0,

                // let					                                                                   
                0.0, 1.0, 0.0,           1.0, 0.0, 0.0,       -0.894427, 0.447214, 0.0,         0.5, 1.0,
                -1.0, -1.0, -1.0,        0.0, 0.0, 1.0,       -0.894427, 0.447214, 0.0,         0.0, 0.0,
                -1.0, -1.0, 1.0,         0.0, 1.0, 0.0,       -0.894427, 0.447214, 0.0,         1.0, 0.0,   
            ]
        );


        //vao and vbo

        this.vao_pyramid = gl.createVertexArray();
        gl.bindVertexArray(this.vao_pyramid);

        this.vbo_pyramid = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_pyramid);
        gl.bufferData(gl.ARRAY_BUFFER, pyramidVCNT, gl.STATIC_DRAW);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 11 * 4, 0);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 11 * 4, 3 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_COLOR);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 11 * 4, 6 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_NORMAL);

        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 11 * 4, 9 * 4);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_TEXTURE0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

    },

    //draw
    draw: function () {

        gl.bindVertexArray(this.vao_pyramid);
        gl.drawArrays(gl.TRIANGLES, 0, 12);
        gl.bindVertexArray(null);
    },

    // uninit
    uninit: function () {

        if (this.vao_pyramid) {
            gl.deleteVertexArray(this.vao_pyramid);
            this.vao_pyramid = null;
        }

        if (this.vbo_pyramid) {
            gl.deleteBuffer(this.vbo_pyramid);
            this.vbo_pyramid = null;
        }
    }
};

