/*********** Model Loading: Static + Skeletal ***********/

function getTimeFraction(times, dt) {
    var segment = 0;
    while (dt > times[segment]) {
        segment++;

        // if the animation is longer than last keyframe just render the last 
        // keyframe for rest of the animation time
        if (segment == times.length) {
            segment--;
            // frac is hardcoded to 1.0 as we have already passed the last
            // timestamp of last keyframe, so clamping to 1.0 will avoid
            // unnecessary extrapolation
            return [segment, 1.0];
        }
    }

    segment = segment > 0 ? segment : 1;

    var start = times[segment - 1];
    var end = times[segment];
    var frac = (dt - start) / (end - start);
    return [segment, frac];
}

// resolve position for model at given time
// returns pose matrix array
function getPose(animData, skeleton, time, parentTransform, globalInverseTransform, output) {

    var btt = animData[skeleton.name];
    var dt = time % animData.duration;

    var globalTransform = parentTransform;

    if (btt.positions.length != 0) {
        // calculate interpolated position
        var fp = getTimeFraction(btt.positionsTime, dt);
        var position1 = btt.positions[fp[0] - 1];
        var position2 = btt.positions[fp[0]];
        var position = vec3.create();
        vec3.lerp(position, position1, position2, fp[1]);

        // calculate interpolated rotation
        fp = getTimeFraction(btt.rotationsTime, dt);
        var rotation1 = btt.rotations[fp[0] - 1];
        var rotation2 = btt.rotations[fp[0]];
        var rotation = quat.create();
        quat.slerp(rotation, rotation1, rotation2, fp[1]);

        // calculate interpolated scale
        fp = getTimeFraction(btt.scalesTime, dt);
        var scale1 = btt.scales[fp[0] - 1];
        var scale2 = btt.scales[fp[0]];
        var scale = vec3.create();
        vec3.lerp(scale, scale1, scale2, fp[1]);

        var localTransform = mat4.create();
        mat4.fromRotationTranslationScale(localTransform, rotation, position, scale);

        mat4.multiply(globalTransform, parentTransform, localTransform);
    }

    var m = mat4.create();
    mat4.multiply(m, globalInverseTransform, globalTransform);
    mat4.multiply(m, m, skeleton.offset);

    output[skeleton.id] = m;

    // update value for child bones
    for (var i = 0; i < skeleton.childs.length; i++) {
        getPose(animData, skeleton.childs[i], dt, globalTransform, globalInverseTransform, output);
    }
}

function loadModelAndTextures(mdl, path, numInstance, instancePositions) {
    var model = {};

    // pyramid Position
    var vertices = new Float32Array(mdl.vertex);
    var indices = new Uint32Array(mdl.index);
    // call to fun

    model.numElements = mdl.index.length;

    model.vao = gl.createVertexArray();
    gl.bindVertexArray(model.vao);

    model.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    /*gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX,    //macro
        3,                                                      // 3 for x,y,z axes in vertex array
        gl.FLOAT,                                               //type
        false,                                                  // is normalized?
        16 * 4, 0 * 4);                                         // stride and offset
    */

    //console.log(vertices);

    gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 16 * 4, 0 * 4);
    gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);

    gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 16 * 4, 3 * 4);
    gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_NORMAL);

    gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 16 * 4, 6 * 4);
    gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_TEXTURE0);

    gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_BONE_ID, 4, gl.FLOAT, false, 16 * 4, 8 * 4);
    gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_BONE_ID);

    gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_BONE_WEIGHT, 4, gl.FLOAT, false, 16 * 4, 12 * 4);
    gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_BONE_WEIGHT);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // instance position
    model.vboInstance = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboInstance);
    gl.bufferData(gl.ARRAY_BUFFER, instancePositions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_INSTANCE_POSITION, 3, gl.FLOAT, false, null, 0);
    gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_INSTANCE_POSITION);
    gl.vertexAttribDivisor(webGLMacros.DG_ATTRIBUTE_INSTANCE_POSITION, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    model.vboElement = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.vboElement);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    vertices.length = [];
    indices.length = [];
    mdl.vertex.length = [];
    mdl.index.length = [];

    model.albedoMap = loadTexture(path + "/albedo.jpg");
    model.normalMap = loadTexture(path + "/normal.jpg");

    model.draw = function () {
        // bind with textures

        /*********TEXTURE0 is temp*****************/
        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.texture_2d, this.albedomap);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.albedoMap);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.normalMap);    


        gl.bindVertexArray(this.vao);
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboElement);
        gl.drawElementsInstanced(gl.TRIANGLES, this.numElements, gl.UNSIGNED_INT, 0, numInstance);
        gl.bindVertexArray(null);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    model.uninit = function () {
        
        if(model.vao)
        {
            gl.deleteVertexArray(model.vao);
            model.vao = null;
        }

        if(model.vbo)
        {
            gl.deleteBuffer(model.vbo);
            model.vbo = null;
        }

        gl.deleteTexture(model.albedoMap);
        gl.deleteTexture(model.normalMap);


    }

    return model;
}

function getInstancePositionBuffer(path) {
    
}

function calculatePositions(params) {
    
}
