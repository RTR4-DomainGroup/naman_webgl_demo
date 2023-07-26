/*********** Basic Geometry Shapes ***********/

const cloth_var = {

    // variables
    gravity: -9.8,
	structK: 100000,
	shearK: 5000,
    bendK: 1000,
    dampSpring: 20000,
    dampAir: 2,
    clothWidth: 16,
    clothHeight: 16,
    mass: 800.0,
    sleepThreshold: 0.001,
    sleepCount: 100,
	tension: 1.0,

    timeStep: 0.016,
	clothDt: 0,

    pinned: {
        bottomLeft: false,
        bottomRight: false,
        topLeft: true,
        topRight: true
    },


    dynamicWind: true,
	wind: [0.0, 0.0, 0.0], // if not dynamic

	time: 0.0,

	cloth: null,

	perspectiveProjectionMatrix: mat4.create(),

	vertexBuffer: [],

	shlokClothTex: null,

	stageClothTex: null,

    //vao, vbo variables
    vao_cloth: 0,
    vbo_cloth: 0,
	ibo_cloth: 0,


    //init 
    init: function () {

		shlokClothTex = loadTexture("res/textures/bharatNatyaMandir/shlok.png");

		stageClothTex = loadTexture("res/textures/bharatNatyaMandir/curtain.png");

		this.cloth = new Cloth(this.clothWidth, this.clothHeight, 1.0);
		console.log(this.clothWidth, this.clothHeight);
		this.cloth.wind[0] = -1.0;
		this.cloth.wind[2] = 0.4;


		let { clothWidth, clothHeight } = this;

		console.log({ clothWidth, clothHeight });

		for (let i = 0; i < this.cloth.X.size; ++i)
			this.cloth.X.data[i * 3 + 2] -= 1.75;

		this.cloth.wind[0] = this.wind[0];
		this.cloth.wind[1] = this.wind[1];
		this.cloth.wind[2] = this.wind[2];
		this.clothDt = this.timeStep;
		let selection = 0;

		this.vertexBuffer = new Float32Array(this.cloth.X.size * 8);
		

			this.vao_cloth = gl.createVertexArray();
			gl.bindVertexArray(this.vao_cloth);

			this.vbo_cloth = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cloth);
			gl.bufferData(gl.ARRAY_BUFFER, this.vertexBuffer, gl.DYNAMIC_DRAW);

			
			gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_POSITION);
			gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_NORMAL);
			gl.enableVertexAttribArray(webGLMacros.DG_ATTRIBUTE_TEXTURE0);


			gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 4 * 8, 0); // pos
			gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 4 * 8, 3 * 4); // norm
			gl.vertexAttribPointer(webGLMacros.DG_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 4 * 8, 6 * 4); // texc

			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			this.ibo_cloth = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo_cloth);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.cloth.tris, gl.STATIC_DRAW);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			

		gl.bindVertexArray(null);
		gl.enable(gl.DEPTH_TEST);

		gl.enable(gl.BLEND);

		
    },

	resize: function () {

		mat4.perspective(this.perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width / canvas.height), 0.1, 1000.0);

	},


    //draw
	draw: function (vMatrix) {

		var c = clothShader.use();

		let viewMatrix = vMatrix;
		let modelMatrix = mat4.create();

		mat4.translate(modelMatrix, modelMatrix, [0.0, 25.0, 44.0]);
		mat4.scale(modelMatrix, modelMatrix, [118.0, 22.0, 1.0]);

		
		gl.uniform1f(c.alphaClothUniform, values.alphaSceneTwo);


		gl.uniformMatrix4fv(c.modelMatrixUniform, false, modelMatrix);
		gl.uniformMatrix4fv(c.viewMatrixUniform, false, viewMatrix);
		gl.uniformMatrix4fv(c.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);

		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, shlokClothTex);


		gl.bindVertexArray(this.vao_cloth);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cloth);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertexBuffer, gl.DYNAMIC_DRAW);
		//gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexBuffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		//quad.draw();

		//console.log(this.vertexBuffer);
		//console.log(this.cloth.tris);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo_cloth);
		gl.drawElements(gl.TRIANGLES, this.cloth.tris.length, gl.UNSIGNED_SHORT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindVertexArray(null);

		gl.bindTexture(gl.TEXTURE_2D, null);





		/////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//viewMatrix = vMatrix;
		modelMatrix = mat4.create();

		mat4.translate(modelMatrix, modelMatrix, [0.0, 8.5 + values.clothTranslateY, 42.0]);
		mat4.scale(modelMatrix, modelMatrix, [105.0, 50.0, 1.0]);

		gl.uniformMatrix4fv(c.modelMatrixUniform, false, modelMatrix);
		gl.uniformMatrix4fv(c.viewMatrixUniform, false, viewMatrix);
		gl.uniformMatrix4fv(c.projectionMatrixUniform, false, this.perspectiveProjectionMatrix);


		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, stageClothTex);

		gl.bindVertexArray(this.vao_cloth);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cloth);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertexBuffer, gl.DYNAMIC_DRAW);
		//gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexBuffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		//quad.draw();

		//console.log(this.vertexBuffer);
		//console.log(this.cloth.tris);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo_cloth);
		gl.drawElements(gl.TRIANGLES, this.cloth.tris.length, gl.UNSIGNED_SHORT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindVertexArray(null);

		gl.bindTexture(gl.TEXTURE_2D, null);
				


		gl.useProgram(null);
    },



    // update
    update: function (timestamp) {

		values.alphaSceneTwo = values.alphaSceneTwo + values.alphaBlendIncrement;
		if (values.alphaSceneTwo >= 1.0)
			values.alphaSceneTwo = 1.0;

		this.time += 0.001;

		let unsetPoint = -1;
		if (this.dynamicWind) {
			let sx = Math.sin(this.time);
			let sy = Math.cos(this.time);
			this.cloth.wind[0] = sx;
			this.cloth.wind[1] = 1.0;
			this.cloth.wind[2] = sy;
		}

		// find parameters in init()
		this.cloth.simulate(this.clothDt);						
		this.cloth.populateVertexBuffer(this.vertexBuffer);
		//console.log(this.vertexBuffer);

		if (values.clothTranslateEnable == 1) {

			values.clothTranslateY += 0.05;
			if (values.clothTranslateY > 60.0)
				values.clothTranslateY = 60.0;

		}
		// else if (values.clothTranslateEnable == 2)
		// {
		// 	values.clothTranslateY -= 0.08;
		// 	if (values.clothTranslateY < 40.0)
		// 		values.clothTranslateY = 40.0;
		// }        
    },

    // uninit
    uninit: function ()
    {
        
    },

   

};

const StructSpring = 0;
const ShearSpring = 1;
const BendSpring = 2;
const SpringConstants = [cloth_var.structK, cloth_var.shearK, cloth_var.bendK];

class Spring {
	constructor(type, a, b, rest) {
		this.type = type; // index into SpringConstants -- probably should just store k value here...
		this.rest = rest;
		this.a = a;
		this.b = b;
		this.iab = -1;
		this.iba = -1;
	}
}
// big array of 3d vectors. only treated as 3d for convenience --
// math is the same as if it was a big 1d vector
class BigVec3D {
	constructor(initSize, tight = true) {
		this.size = initSize;
		this.data = new Float32Array(initSize * 3);
	}

	copy(other) {
		console.assert(this.size === other.size);
		for (let i = 0; i < this.size * 3; ++i) {
			this.data[i] = other.data[i];
		}
	}

	forEach(fn, self) {
		for (let i = 0, ii = 0; i < this.size; ++i, ii += 3) {
			fn.call(self, this.data[ii], this.data[ii + 1], this.data[ii + 2], i, this);
		}
	}

	init(x, y, z) {
		for (let i = 0; i < this.data.length; i += 3) {
			this.data[i + 0] = x;
			this.data[i + 1] = y;
			this.data[i + 2] = z;
		}
	}

	zero() {
		for (let i = 0, l = this.size * 3; i < l; ++i) {
			this.data[i] = 0.0;
		}
	}
}

function dot(a, b) {
	let r = 0.0,
		sz = a.size;
	console.assert(a.size === b.size);
	for (let i = 0, size = a.size * 3; i < size; ++i) r += a.data[i] * b.data[i];
	return r;
}

class BigMat3D {
	constructor(diagSize) {
		this.size = diagSize;
		this.data = new Float32Array(Math.max(diagSize, 16) * 9);
		this.posns = new Uint16Array(Math.max(diagSize, 16) * 2);
		for (let i = 0, j = 0; i < diagSize; ++i, j += 2) {
			this.posns[j] = this.posns[j + 1] = i;
		}
	}

	initDiag(f) {
		for (let i = 0, pi = 0, mi = 0; i < this.size; ++i, pi += 2, mi += 9) {
			let d = this.posns[pi] === this.posns[pi + 1] ? f : 0.0;
			for (let r = 0; r < 3; ++r) {
				for (let c = 0; c < 3; ++c) {
					this.data[mi + r * 3 + c] = r === c ? d : 0.0;
				}
			}
		}
	}

	zero() {
		for (let i = 0, l = this.size * 9; i < l; ++i) {
			this.data[i] = 0.0;
		}
	}

	capacity() {
		return Math.floor(this.data.length / 9);
	}

	grow_() {
		let nextData = new Float32Array(this.data.length * 2);
		for (let i = 0; i < this.data.length; ++i) {
			nextData[i] = this.data[i];
		}
		this.data = nextData;
		let nextPosns = new Uint16Array(this.posns.length * 2);
		for (let i = 0; i < this.posns.length; ++i) {
			nextPosns[i] = this.posns[i];
		}
		this.posns = nextPosns;
	}

	push(r, c) {
		if (this.size + 1 >= this.capacity()) {
			this.grow_();
		}
		let nextIdx = this.size * 9;
		let nextPosIdx = this.size * 2;
		this.posns[nextPosIdx + 0] = r;
		this.posns[nextPosIdx + 1] = c;
		this.data[nextIdx + 0] = 0.0;
		this.data[nextIdx + 1] = 0.0;
		this.data[nextIdx + 2] = 0.0;
		this.data[nextIdx + 3] = 0.0;
		this.data[nextIdx + 4] = 0.0;
		this.data[nextIdx + 5] = 0.0;
		this.data[nextIdx + 6] = 0.0;
		this.data[nextIdx + 7] = 0.0;
		this.data[nextIdx + 8] = 0.0;
		++this.size;
		return nextIdx;
	}

	forEach(fn, self) {
		for (let i = 0, ii = 0, pi = 0; i < this.size; ++i, ii += 9, pi += 2) {
			fn.call(self, ii, this.posns[pi], this.posns[pi + 1], i, this);
		}
	}

	pushFront(r, c) {
		if (this.size + 1 >= this.capacity()) {
			this.grow_();
		}
		this.size++;
		for (let totalSize = this.size * 9, i = totalSize - 1; i >= 9; --i) {
			this.data[i] = this.data[i - 9];
		}

		for (let i = this.size * 2 - 1; i >= 2; --i) {
			this.posns[i] = this.posns[i - 2];
		}

		for (let i = 0; i < 9; ++i) {
			this.data[i] = 0.0;
		}

		this.posns[0] = r;
		this.posns[1] = c;
		return 0;
	}

	clearRow(index) {
		let j = 0;
		for (let i = 0, l = this.size; i < l; ++i) {
			if (this.posns[i * 2] !== index) {
				this.posns[j * 2 + 0] = this.posns[i * 2 + 0];
				this.posns[j * 2 + 1] = this.posns[i * 2 + 1];
				let mi = i * 9,
					mj = j * 9;
				for (let mii = 0; mii < 9; ++mii) {
					this.data[mj + mii] = this.data[mi + mii];
				}
				j++;
			}
		}
		this.size = j;
	}
}

function mul(out, mat, vec) {
	if (!out) out = new BigVec3D(v.size);
	else out.init(0, 0, 0);
	let m = mat.data,
		v = vec.data,
		o = out.data;
	for (let i = 0, sz = mat.size; i < sz; i++) {
		let r = mat.posns[i * 2 + 0],
			c = mat.posns[i * 2 + 1];
		let mi = (i * 9) >>> 0,
			vr = (r * 3) >>> 0,
			vc = (c * 3) >>> 0;
		let mxx = +m[mi + 0],
			mxy = +m[mi + 1],
			mxz = +m[mi + 2];
		let myx = +m[mi + 3],
			myy = +m[mi + 4],
			myz = +m[mi + 5];
		let mzx = +m[mi + 6],
			mzy = +m[mi + 7],
			mzz = +m[mi + 8];
		let vx = +v[vr + 0],
			vy = +v[vr + 1],
			vz = +v[vr + 2];
		o[vc + 0] += vx * mxx + vy * myx + vz * mzx;
		o[vc + 1] += vx * mxy + vy * myy + vz * mzy;
		o[vc + 2] += vx * mxz + vy * myz + vz * mzz;
	}
	return out;
}

function foreach2d(w, h, fn) {
	for (let i = 0; i < h; ++i) {
		for (let j = 0; j < w; ++j) {
			fn(i, j);
		}
	}
}


class Cloth {
	constructor(w, h, size) {
		let springs = [];
		let points = [];
		let texcoords = [];
		// let quads = [];
		let tris = [];

		foreach2d(w, h, (i, j) => {
			points.push(
				(j / (w - 1.0) - 0.5) * size,
				(i / (w - 1.0) - 0.5) * size,
				0.0
			);
			texcoords.push(j / (w - 1.0), i / (h - 1.0));
		});

		let r = 0.0;
		{
			let dx = points[0] - points[3];
			let dy = points[1] - points[4];
			let dz = points[2] - points[5];
			r = Math.sqrt(dx * dx + dy * dy + dz * dz) * cloth_var.tension;
		}

		foreach2d(w, h, (i, j) => {
			if (i < h - 1)
				springs.push(new Spring(StructSpring, i * w + j, (i + 1) * w + j, r));
		});
		foreach2d(w, h, (i, j) => {
			if (j < w - 1)
				springs.push(new Spring(StructSpring, i * w + j, i * w + (j + 1), r));
		});

		foreach2d(w, h, (i, j) => {
			if (j < w - 1 && i < h - 1)
				springs.push(
					new Spring(
						ShearSpring,
						i * w + j,
						(i + 1) * w + (j + 1),
						r * Math.sqrt(2)
					)
				);
		});
		foreach2d(w, h, (i, j) => {
			if (j > 0 && i < h - 1)
				springs.push(
					new Spring(
						ShearSpring,
						i * w + j,
						(i + 1) * w + (j - 1),
						r * Math.sqrt(2)
					)
				);
		});
		foreach2d(w, h, (i, j) => {
			if (i < h - 2)
				springs.push(new Spring(BendSpring, i * w + j, (i + 2) * w + j, r * 2.0));
		});
		foreach2d(w, h, (i, j) => {
			if (j < w - 2)
				springs.push(new Spring(BendSpring, i * w + j, i * w + (j + 2), r * 2.0));
		});

		foreach2d(w - 1, h - 1, (i, j) => {
			let v0 = (i + 0) * w + (j + 0),
				v1 = (i + 0) * w + (j + 1);
			let v2 = (i + 1) * w + (j + 1),
				v3 = (i + 1) * w + (j + 0);
			tris.push(v0, v1, v2, v2, v3, v0);
		});

		let n = points.length / 3;

		this.wind = new Float32Array([0.0, 0.0, 0.0]);

		this.Xb = new Float32Array(n * 3); // pos
		this.M = new Float32Array(n); // mass

		this.X = new BigVec3D(n);
		this.X.data = new Float32Array(points);

		this.V = new BigVec3D(n); // vel
		this.N = new BigVec3D(n); // normals
		this.P = new BigVec3D(n); // pressure
		this.F = new BigVec3D(n); // force
		this.dV = new BigVec3D(n); // velocity delta

		this.A = new BigMat3D(n); // solution matrix
		this.dFdX = new BigMat3D(n);
		this.dFdV = new BigMat3D(n);

		this.tmpB = new BigVec3D(n);
		this.tmpdFdXmV = new BigVec3D(n);
		this.tmpQ = new BigVec3D(n);
		this.tmpD = new BigVec3D(n);
		this.tmpT = new BigVec3D(n);
		this.tmpR = new BigVec3D(n);

		this.springs = springs;
		this.springs.forEach((s) => {
			s.iab = this.A.size;
			this.A.push(s.a, s.b);
			this.dFdX.push(s.a, s.b);
			this.dFdV.push(s.a, s.b);
			s.iba = this.A.size;
			this.A.push(s.b, s.a);
			this.dFdX.push(s.b, s.a);
			this.dFdV.push(s.b, s.a);
		});

		// this.H = [];

		for (let i = 0; i < n; ++i) {
			this.M[i] = cloth_var.mass;
		}

		this.uvs = new Float32Array(texcoords);

		this.tris = new Uint16Array(tris);

		this.S = new BigMat3D(0);

		if (cloth_var.pinned.bottomLeft) this.pointStatusSet(0, 1);
		if (cloth_var.pinned.bottomRight) this.pointStatusSet(w - 1, 1);
		if (cloth_var.pinned.topLeft) this.pointStatusSet((h - 1) * w, 1);
		if (cloth_var.pinned.topRight) this.pointStatusSet(h * w - 1, 1);
	}

	pointStatusSet(index, op) {
		if (index < 0 || index > this.X.size) return -1;
		let st = false;
		for (let i = 0, l = this.S.size * 2; i < l; i += 2) {
			if (this.S.posns[i] === index) {
				st = true;
				break;
			}
		}
		if (st && (op === 0 || op === 2)) {
			this.S.clearRow(index);
			st = false;
		}
		if (!st && (op === 1 || op === 2)) {
			this.S.pushFront(index, index);
			this.V.data[index * 3 + 0] = 0.0;
			this.V.data[index * 3 + 1] = 0.0;
			this.V.data[index * 3 + 2] = 0.0;
			st = true;
		}
		this.M[index] = st ? 0.0 : cloth_var.mass;
	}
	// just average normal for each face.
	calcNormals() {
		this.N.init(0, 0, 0);
		let N = this.N.data,
			X = this.X.data;
		let tris = this.tris; //, quads = this.quads;
		for (let i = 0, l = tris.length; i < l; i += 3) {
			let v0i = tris[i + 0] * 3,
				v1i = tris[i + 1] * 3,
				v2i = tris[i + 2] * 3;

			let v0x = X[v0i + 0],
				v0y = X[v0i + 1],
				v0z = X[v0i + 2];
			let v1x = X[v1i + 0],
				v1y = X[v1i + 1],
				v1z = X[v1i + 2];
			let v2x = X[v2i + 0],
				v2y = X[v2i + 1],
				v2z = X[v2i + 2];

			let d10x = v1x - v0x,
				d10y = v1y - v0y,
				d10z = v1z - v0z;
			let d21x = v2x - v1x,
				d21y = v2y - v1y,
				d21z = v2z - v1z;

			let nx = d10y * d21z - d10z * d21y;
			let ny = d10z * d21x - d10x * d21z;
			let nz = d10x * d21y - d10y * d21x;
			N[v0i + 0] += nx;
			N[v0i + 1] += ny;
			N[v0i + 2] += nz;
			N[v1i + 0] += nx;
			N[v1i + 1] += ny;
			N[v1i + 2] += nz;
			N[v2i + 0] += nx;
			N[v2i + 1] += ny;
			N[v2i + 2] += nz;
		}
		for (let i = 0, ii = 0, l = this.N.size; i < l; ++i, ii += 3) {
			let x = N[ii + 0],
				y = N[ii + 1],
				z = N[ii + 2];
			let il = 1.0 / Math.sqrt(x * x + y * y + z * z);
			N[ii + 0] = x * il;
			N[ii + 1] = y * il;
			N[ii + 2] = z * il;
		}
	}

	calcForces() {
		this.calcNormals();
		this.dFdX.zero();
		this.dFdV.initDiag(0.0);
		this.F.init(0, cloth_var.gravity, 0);
		let [wx, wy, wz] = this.wind;
		let N = this.N.data,
			F = this.F.data,
			V = this.V.data,
			X = this.X.data;
		for (let i = 0, ii = 0, l = this.F.size; i < l; ++i, ii += 3) {
			let nx = N[ii + 0];
			let ny = N[ii + 1];
			let nz = N[ii + 2];
			let vx = V[ii + 0];
			let vy = V[ii + 1];
			let vz = V[ii + 2];
			let vwx = vx - wx;
			let vwy = vy - wy;
			let vwz = vz - wz;
			let vwdn = vwx * nx + vwy * ny + vwz * nz;
			let s = cloth_var.dampAir * vwdn;
			F[ii + 0] -= nx * s;
			F[ii + 1] -= ny * s;
			F[ii + 2] -= nz * s;
		}
		for (let i = 0; i < this.springs.length; ++i) {
			this.preSolveSpring(this.springs[i]);
		}
	}

	preSolveSpring(s) {
		const I00 = 1.0,
			I01 = 0.0,
			I02 = 0.0;
		const I10 = 0.0,
			I11 = 1.0,
			I12 = 0.0;
		const I20 = 0.0,
			I21 = 0.0,
			I22 = 1.0;

		let sa = (s.a * 3) >>> 0;
		let sb = (s.b * 3) >>> 0;
		let rest = +s.rest;
		let damp = +cloth_var.dampSpring;

		let dFdX = this.dFdX.data,
			dFdV = this.dFdV.data;
		let F = this.F.data,
			X = this.X.data,
			V = this.V.data;

		let eX = X[sb + 0] - X[sa + 0],
			eY = X[sb + 1] - X[sa + 1],
			eZ = X[sb + 2] - X[sa + 2];

		let length = Math.sqrt(eX * eX + eY * eY + eZ * eZ);
		let il = 1.0 / (length + 1e-37);

		let dx = eX * il,
			dy = eY * il,
			dz = eZ * il;
		let velX = V[sb + 0] - V[sa + 0];
		let velY = V[sb + 1] - V[sa + 1];
		let velZ = V[sb + 2] - V[sa + 2];

		let k = +SpringConstants[s.type];
		let velDotDir = velX * dx + velY * dy + velZ * dz;
		let fa = k * (length - rest) + damp * velDotDir;
		let fX = dx * fa,
			fY = dy * fa,
			fZ = dz * fa;

		F[sa + 0] += fX;
		F[sa + 1] += fY;
		F[sa + 2] += fZ;
		F[sb + 0] -= fX;
		F[sb + 1] -= fY;
		F[sb + 2] -= fZ;

		let rl = rest / length < 1.0 ? rest / length : 1.0;
		// outer(dir, dir)
		let dp00 = dx * dx,
			dp01 = dx * dy,
			dp02 = dx * dz;
		let dp10 = dx * dy,
			dp11 = dy * dy,
			dp12 = dy * dz;
		let dp20 = dx * dz,
			dp21 = dy * dz,
			dp22 = dz * dz;

		let dFdXs00 = -k * ((I00 - dp00) * rl - I00),
			dFdXs01 = -k * ((I01 - dp01) * rl - I01),
			dFdXs02 = -k * ((I02 - dp02) * rl - I02);
		let dFdXs10 = -k * ((I10 - dp10) * rl - I10),
			dFdXs11 = -k * ((I11 - dp11) * rl - I11),
			dFdXs12 = -k * ((I12 - dp12) * rl - I12);
		let dFdXs20 = -k * ((I20 - dp20) * rl - I20),
			dFdXs21 = -k * ((I21 - dp21) * rl - I21),
			dFdXs22 = -k * ((I22 - dp22) * rl - I22);

		let m = damp * (velDotDir / Math.max(length, rest));
		let dFdXd00 = (I00 - dp00) * m,
			dFdXd01 = (I01 - dp01) * m,
			dFdXd02 = (I02 - dp02) * m;
		let dFdXd10 = (I10 - dp10) * m,
			dFdXd11 = (I11 - dp11) * m,
			dFdXd12 = (I12 - dp12) * m;
		let dFdXd20 = (I20 - dp20) * m,
			dFdXd21 = (I21 - dp21) * m,
			dFdXd22 = (I22 - dp22) * m;

		let dFdX00 = dFdXs00 + dFdXd00,
			dFdX01 = dFdXs01 + dFdXd01,
			dFdX02 = dFdXs02 + dFdXd02;
		let dFdX10 = dFdXs10 + dFdXd10,
			dFdX11 = dFdXs11 + dFdXd11,
			dFdX12 = dFdXs12 + dFdXd12;
		let dFdX20 = dFdXs20 + dFdXd20,
			dFdX21 = dFdXs21 + dFdXd21,
			dFdX22 = dFdXs22 + dFdXd22;

		let dFdV00 = dp00 * damp,
			dFdV01 = dp01 * damp,
			dFdV02 = dp02 * damp;
		let dFdV10 = dp10 * damp,
			dFdV11 = dp11 * damp,
			dFdV12 = dp12 * damp;
		let dFdV20 = dp20 * damp,
			dFdV21 = dp21 * damp,
			dFdV22 = dp22 * damp;

		let mAA = s.a * 9,
			mAB = s.iab * 9,
			mBB = s.b * 9,
			mBA = s.iba * 9;

		dFdX[mAA + 0] -= dFdX00;
		dFdX[mAA + 1] -= dFdX01;
		dFdX[mAA + 2] -= dFdX02;
		dFdX[mAA + 3] -= dFdX10;
		dFdX[mAA + 4] -= dFdX11;
		dFdX[mAA + 5] -= dFdX12;
		dFdX[mAA + 6] -= dFdX20;
		dFdX[mAA + 7] -= dFdX21;
		dFdX[mAA + 8] -= dFdX22;

		dFdX[mBB + 0] -= dFdX00;
		dFdX[mBB + 1] -= dFdX01;
		dFdX[mBB + 2] -= dFdX02;
		dFdX[mBB + 3] -= dFdX10;
		dFdX[mBB + 4] -= dFdX11;
		dFdX[mBB + 5] -= dFdX12;
		dFdX[mBB + 6] -= dFdX20;
		dFdX[mBB + 7] -= dFdX21;
		dFdX[mBB + 8] -= dFdX22;

		dFdX[mAB + 0] += dFdX00;
		dFdX[mAB + 1] += dFdX01;
		dFdX[mAB + 2] += dFdX02;
		dFdX[mAB + 3] += dFdX10;
		dFdX[mAB + 4] += dFdX11;
		dFdX[mAB + 5] += dFdX12;
		dFdX[mAB + 6] += dFdX20;
		dFdX[mAB + 7] += dFdX21;
		dFdX[mAB + 8] += dFdX22;

		dFdX[mBA + 0] += dFdX00;
		dFdX[mBA + 1] += dFdX01;
		dFdX[mBA + 2] += dFdX02;
		dFdX[mBA + 3] += dFdX10;
		dFdX[mBA + 4] += dFdX11;
		dFdX[mBA + 5] += dFdX12;
		dFdX[mBA + 6] += dFdX20;
		dFdX[mBA + 7] += dFdX21;
		dFdX[mBA + 8] += dFdX22;

		dFdV[mAA + 0] -= dFdV00;
		dFdV[mAA + 1] -= dFdV01;
		dFdV[mAA + 2] -= dFdV02;
		dFdV[mAA + 3] -= dFdV10;
		dFdV[mAA + 4] -= dFdV11;
		dFdV[mAA + 5] -= dFdV12;
		dFdV[mAA + 6] -= dFdV20;
		dFdV[mAA + 7] -= dFdV21;
		dFdV[mAA + 8] -= dFdV22;

		dFdV[mBB + 0] -= dFdV00;
		dFdV[mBB + 1] -= dFdV01;
		dFdV[mBB + 2] -= dFdV02;
		dFdV[mBB + 3] -= dFdV10;
		dFdV[mBB + 4] -= dFdV11;
		dFdV[mBB + 5] -= dFdV12;
		dFdV[mBB + 6] -= dFdV20;
		dFdV[mBB + 7] -= dFdV21;
		dFdV[mBB + 8] -= dFdV22;

		dFdV[mAB + 0] += dFdV00;
		dFdV[mAB + 1] += dFdV01;
		dFdV[mAB + 2] += dFdV02;
		dFdV[mAB + 3] += dFdV10;
		dFdV[mAB + 4] += dFdV11;
		dFdV[mAB + 5] += dFdV12;
		dFdV[mAB + 6] += dFdV20;
		dFdV[mAB + 7] += dFdV21;
		dFdV[mAB + 8] += dFdV22;

		dFdV[mBA + 0] += dFdV00;
		dFdV[mBA + 1] += dFdV01;
		dFdV[mBA + 2] += dFdV02;
		dFdV[mBA + 3] += dFdV10;
		dFdV[mBA + 4] += dFdV11;
		dFdV[mBA + 5] += dFdV12;
		dFdV[mBA + 6] += dFdV20;
		dFdV[mBA + 7] += dFdV21;
		dFdV[mBA + 8] += dFdV22;
	}

	conjGradFilt(Xv, Am, Bv, Sm) {
		const epsilon = 0.02;
		const loopLim = 100;
		function filter(v, s) {
			for (
				let i = 0, i9 = 0, size = s.size, V = v.data, S = s.data;
				i < size;
				++i, i9 += 9
			) {
				let r = (s.posns[i * 2] * 3) >>> 0;
				let s00 = +S[i9 + 0],
					s01 = +S[i9 + 1],
					s02 = +S[i9 + 2];
				let s10 = +S[i9 + 3],
					s11 = +S[i9 + 4],
					s12 = +S[i9 + 5];
				let s20 = +S[i9 + 6],
					s21 = +S[i9 + 7],
					s22 = +S[i9 + 8];
				let v0 = V[r + 0],
					v1 = V[r + 1],
					v2 = V[r + 2];
				V[r + 0] = v0 * s00 + v1 * s10 + v2 * s20;
				V[r + 1] = v0 * s01 + v1 * s11 + v2 * s21;
				V[r + 2] = v0 * s02 + v1 * s12 + v2 * s22;
			}
		}
		const size = Bv.size;
		const size3 = size * 3;
		let q = this.tmpQ,
			d = this.tmpD,
			tmp = this.tmpT,
			r = this.tmpR;
		let X = Xv.data,
			Q = q.data,
			D = d.data,
			B = Bv.data,
			T = tmp.data,
			R = r.data;

		for (let i = 0; i < size3; ++i) {
			Q[i] = D[i] = T[i] = R[i] = 0.0;
		}

		mul(tmp, Am, Xv);
		for (let i = 0; i < size3; ++i) {
			R[i] = B[i] - T[i];
		}
		filter(r, Sm);
		d.copy(r);
		let s = dot(r, r);

		let sTarg = s * epsilon * epsilon;
		let loops = 0;
		while (s > sTarg && loops++ < loopLim) {
			mul(q, Am, d);
			filter(q, Sm);
			let a = s / dot(d, q);
			for (let i = 0; i < size3; ++i) {
				X[i] += D[i] * a;
			}
			//filterH(X,H)
			if (loops % 50 === 0) {
				// || H.length !== 0) {
				mul(tmp, Am, Xv);
				for (let i = 0; i < size3; ++i) {
					R[i] = B[i] - T[i];
				}
				filter(r, Sm);
			} else {
				for (let i = 0; i < size3; ++i) {
					R[i] -= Q[i] * a;
				}
			}
			let lastS = s;
			s = dot(r, r);
			let sr = s / lastS;
			for (let i = 0; i < size3; ++i) {
				D[i] = R[i] + D[i] * sr;
			}
			filter(d, Sm);
		}
		return loops < loopLim;
	}

	simulate(dt) {
		if (dt <= 0.0) {
			return;
		}
		dt = +dt;
		this.calcForces();
		const dtSqr = dt * dt;

		const size = this.X.size;
		const size3 = (size * 3) >>> 0;

		let B = this.tmpB;
		let dFdXmV = this.tmpdFdXmV;

		this.dV.zero();
		for (
			let i = 0, ii = 0, l = this.S.size, V = this.V.data;
			i < l;
			++i, ii += 2
		) {
			let c = (this.S.posns[ii + 1] * 3) >>> 0;
			V[c + 0] = 0.0;
			V[c + 1] = 0.0;
			V[c + 2] = 0.0;
		}

		this.A.initDiag(1.0);
		for (
			let i = 0,
			l = this.A.size * 9,
			A = this.A.data,
			dFdV = this.dFdV.data,
			dFdX = this.dFdX.data;
			i < l;
			++i
		) {
			A[i] -= dFdV[i] * dt + dFdX[i] * dtSqr;
		}

		mul(dFdXmV, this.dFdX, this.V);

		for (let i = 0, F = this.F.data; i < size3; ++i) {
			B.data[i] = F[i] * dt + dFdXmV.data[i] * dtSqr;
		}

		this.conjGradFilt(this.dV, this.A, B, this.S);

		for (
			let i = 0, X = this.X.data, V = this.V.data, dV = this.dV.data;
			i < size3;
			++i
		) {
			V[i] += dV[i];
		}
		for (
			let i = 0, X = this.X.data, V = this.V.data, dV = this.dV.data;
			i < size3;
			++i
		) {
			X[i] += V[i] * dt;
		}

		for (
			let i = 0, Sp = this.S.posns, sSize = this.S.size, V = this.V.data;
			i < sSize;
			++i
		) {
			let ci = (Sp[i * 2 + 1] * 3) >>> 0;
			V[ci + 0] = V[ci + 1] = V[ci + 2] = 0.0;
		}
		this.awake =
			dot(this.V, this.V) < cloth_var.sleepThreshold
				? this.awake - 1
				: cloth_var.sleepCount;
	}
	populateVertexBuffer(buf) {
		let pos = this.X.data;
		let nor = this.N.data;
		let tex = this.uvs;

		let size = this.X.size;

		for (
			let i = 0, i3 = 0, i2 = 0, i8 = 0;
			i < size;
			++i, i2 += 2, i3 += 3, i8 += 8
		) {
			buf[i8 + 0] = pos[i3 + 0];
			buf[i8 + 1] = pos[i3 + 1];
			buf[i8 + 2] = pos[i3 + 2];
			buf[i8 + 3] = nor[i3 + 0];
			buf[i8 + 4] = nor[i3 + 1];
			buf[i8 + 5] = nor[i3 + 2];
			buf[i8 + 6] = tex[i2 + 0];
			buf[i8 + 7] = tex[i2 + 1];
		}
	}

}

