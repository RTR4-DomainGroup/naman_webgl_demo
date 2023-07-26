/*********** Basic Geometry Shapes ***********/

const fourier = {

    // variables
    x: [],
    fourierX: 0,
    time: 0,

    pm_ratio_x: 8600.0  / 9.0,
    pm_ratio_y: 8600.0 / 16.0,

    stroke: 0,

    path: [],
    gap: [],
    circlePosition: [],
    linePosition: [],


    //vao, vbo variables
    vao_point: 0,
    vbo_point: 0,

    vao_inPoint: 0,
    vbo_inPoint: 0,

    vao_circle: 0,
    vbo_circle: 0,

    vao_line: 0,
    vbo_line: 0,

    blendVal: 0.0,

    fbo_fourier: 0,
    rbo_fourier: 0,
    fourier_texture: 0,


    //init 
    init: function () {

        
        //vertex interleaved array

        const skip = 4;
        for (let i = 0; i < drawing.length; i += skip)
        {
            const c = new Complex(drawing[i].x, drawing[i].y);
            this.x.push(c);
        }
        this.fourierX = dft(this.x);
        this.fourierX.sort((a, b) => b.amp - a.amp);


        //vao and vbo

        this.vao_inPoint = gl.createVertexArray();
        gl.bindVertexArray(this.vao_inPoint);
        this.vbo_inPoint = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_inPoint);
        gl.bufferData(gl.ARRAY_BUFFER, InLineDrawing, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, 1.0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);



        // points
        this.init_points();

        // circle
        this.init_circle();

        // line
        this.init_line();

        quad.init();

        //load textures
        this.ganeshTex = loadTexture("res/textures/fourier/ganeshBlended.png");
        this.canvasPaperTex = loadTexture("res/textures/fourier/canvasPaper.jpg");
        
    },

    //draw
    draw: function () {

        var f = fourierShader.use();

        //
        let v = this.epicycles(0, 0, 0, this.fourierX);
        if (this.time <= TWO_PI) {

            this.path.unshift(v.y);
            this.path.unshift(v.x);

            //console.log(this.path);

            var a = this.path[0] - this.path[2]
            var b = this.path[1] - this.path[3]

            if (Math.sqrt(a * a + b * b) * 100.0 > 10.0) {

                this.gap = this.gap.map(num => num + 1);
                this.gap.unshift(0);
                
            }
            else {
                this.gap = this.gap.map(num => num + 1);
            }

        }

        this.draw_points();


        gl.bindVertexArray(this.vao_inPoint);
        if (this.stroke <= InLineDrawing.length / 2)
            gl.drawArrays(gl.POINTS, 0, this.stroke);
        gl.bindVertexArray(null);

        /* Draw canvas Paper */ 
        //gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0, 1.0);

        //canvas
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.canvasPaperTex);
        gl.uniform1f(f.blendValue, 1.0);
        quad.draw();

        gl.bindTexture(gl.TEXTURE_2D, null);

        //ganpati

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.ganeshTex);
        gl.uniform1f(f.blendValue, this.blendVal);

        quad.draw();

        gl.bindTexture(gl.TEXTURE_2D, null);
      
        gl.useProgram(null);


    },



    // update
    update: function () {

        const dt = TWO_PI / this.fourierX.length;

        if (this.time <= TWO_PI) {
            this.time += dt;
        }

        else if (this.stroke < InLineDrawing.length / 2)
        {
            this.stroke += values.fourier_stroke_speed;
        }
        else if ( this.blendVal  <1.000)
        {
            this.stroke = InLineDrawing.length / 2;
            this.blendVal += 0.005
        }

        /*if (this.time > TWO_PI) {
            this.time = 0;
            this.path = [];
        }*/

        //this.blendVal += 0.001;
        if (this.blendVal >= 1.0)
            this.blendVal = 1.0;
        
    },

    // uninit
    uninit: function ()
    {
        // delete/unintialize created buffer object
        

        if (this.fourier_texture)
        {
            gl.deleteTexture(this.fourier_texture);
            this.fourier_texture = null;

        }

        if (this.rbo_fourier)
        {
            gl.deleteRenderbuffer(this.rbo_fourier);
            this.rbo_fourier = null;
        }

        if (this.fbo_fourier)
        {
            gl.deleteFramebuffer(this.fbo_fourier);
            this.fbo_fourier = null;
        }

        if (this.vbo_point)
        {
            gl.deleteBuffer(this.vbo_point);
            this.vbo_point = null;
        }

        if (this.vbo_inPoint)
        {
            gl.deleteBuffer(this.vbo_inPoint);
            this.vbo_inPoint = null;
        }
        if (this.vbo_circle)
        {
            gl.deleteBuffer(this.vbo_circle);
            this.vbo_circle = null;
        }
        if (this.vbo_line)
        {
            gl.deleteBuffer(this.vbo_line);
            this.vbo_line = null;
        }
        
        // delete/unintialize created vector array object
        if (this.vao_point)
        {
            gl.deleteVertexArray(this.vao_point);
            this.vao_point = null;
        }

        if (this.vao_inPoint)
        {
            gl.deleteVertexArray(this.vao_inPoint);
            this.vao_inPoint = null;
        }

        if (this.vao_circle) {
            gl.deleteVertexArray(this.vao_circle);
            this.vao_circle = null;
        }

        if (this.vao_line) {
            gl.deleteVertexArray(this.vao_line);
            this.vao_line = null;
        }

        //geometry unit
        quad.uninit();

        //textures unint
        gl.deleteTexture(this.canvasPaperTex);
        gl.deleteTexture(this.ganeshTex);



    },

    epicycles: function (x, y, rotation, fourier)
    {

        for (let i = 0; i < fourier.length; i++)
        {
            let prevx = x;
            let prevy = y;
            let freq = fourier[i].freq;
            let radius = fourier[i].amp;
            let phase = fourier[i].phase;
            x += radius * Math.cos(freq * this.time + phase + rotation);
            y += radius * Math.sin(freq * this.time + phase + rotation);

            //gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.80, 0.80, 0.80, 1.0);

            if (this.time <= TWO_PI && values.fourier_stroke_enable == 1)
            {
                gl.lineWidth(1.0);

                this.draw_circle(prevx / this.pm_ratio_x, prevy / this.pm_ratio_y, radius / this.pm_ratio_x);
                this.draw_line(prevx / this.pm_ratio_x, prevy / this.pm_ratio_y, x / this.pm_ratio_x, y / this.pm_ratio_y);
            }
        }
        return new Vector(x, y);
    },

    init_points: function ()
    {
        this.vao_point = gl.createVertexArray();
        gl.bindVertexArray(this.vao_point);
        this.vbo_point = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_point);
        gl.bufferData(gl.ARRAY_BUFFER, this.path, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

    },

    init_circle: function ()
    {
        this.vao_circle = gl.createVertexArray();
        gl.bindVertexArray(this.vao_circle);
        this.vbo_circle = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_circle);
        gl.bufferData(gl.ARRAY_BUFFER, this.circlePosition, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

    },

    init_line: function ()
    {
        this.vao_line = gl.createVertexArray();
        gl.bindVertexArray(this.vao_line);
        this.vbo_line = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_line);
        gl.bufferData(gl.ARRAY_BUFFER, this.linePosition, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

    },

    draw_points: function ()
    {
        gl.bindVertexArray(this.vao_point);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_point);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.path), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, 1.0);

        gl.lineWidth(4.0);

        let initial = 0;
        let len = 0;
        for (let i = 0; i < this.gap.length; i++) {
            gl.drawArrays(gl.LINE_STRIP, initial, this.gap[i] + 1);
            initial = this.gap[i] + 1;
            len = this.gap[i] + 1;
        }
        gl.drawArrays(gl.LINE_STRIP, initial, (this.path.length / 2) - len);
        
        gl.bindVertexArray(null);

    },


    draw_circle: function (prevX, prevY, radius)
    {
        this.circlePosition = []
        for (var rad = 0.0; rad <= 2 * Math.PI; rad += 0.1)
        {
            this.circlePosition.push(prevX + (radius - (radius * 0.42))* Math.cos(rad));
            this.circlePosition.push(prevY + radius * Math.sin(rad));
        }

        gl.lineWidth(2.0);
        gl.bindVertexArray(this.vao_circle);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_circle);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.circlePosition), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0, 1.0);
        //gl.vertexAttrib3f(webGLMacros.PBM_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0);
        gl.drawArrays(gl.LINE_LOOP, 0, this.circlePosition.length / 2);
        gl.bindVertexArray(null);

    },

    draw_line: function (prevX, prevY, X, Y)
    {
        this.linePosition = [prevX, prevY, X, Y]

        gl.lineWidth(2.0);
        gl.bindVertexArray(this.vao_line);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_line);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.linePosition), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.vertexAttrib4f(webGLMacros.DG_ATTRIBUTE_COLOR, 0.0, 0.0, 0.0,1.0);
        gl.drawArrays(gl.LINES, 0, this.linePosition.length / 2);
        gl.bindVertexArray(null);
    }

};


let TWO_PI = 2.0 * Math.PI;

class Complex {
    constructor(a, b) {
        this.re = a;
        this.im = b;
    }

    add(c) {
        this.re += c.re;
        this.im += c.im;
    }

    mult(c) {
        const re = this.re * c.re - this.im * c.im;
        const im = this.re * c.im + this.im * c.re;
        return new Complex(re, im);
    }
}

function dft(x) {
    const X = [];
    const N = x.length;
    for (let k = 0; k < N; k++) {
        let sum = new Complex(0, 0);
        for (let n = 0; n < N; n++) {
            const phi = (Math.PI * 2.0 * k * n) / N;
            const c = new Complex(Math.cos(phi), -Math.sin(phi));
            sum.add(x[n].mult(c));
        }
        sum.re = sum.re / N;
        sum.im = sum.im / N;

        let freq = k;
        let amp = Math.sqrt(sum.re * sum.re + sum.im * sum.im);
        let phase = Math.atan2(sum.im, sum.re);
        X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
    }
    return X;
}


class Vector {
    constructor(a, b) {
        this.x = a / fourier.pm_ratio_x;
        this.y = b / fourier.pm_ratio_y;
        //this.z = 0;
    }
}
