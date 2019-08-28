

(function(undefined) {
    "use strict"
    var _global;
    var TextTool = {
        initTextCanvas:function(options){
            var settings
            if(typeof options === 'undefined'){
                console.log('没有传入任何从参数 字是白色的');
                settings = {
                    canvasW : 1000,
                    canvasH : 1000,
                    text:'测试文字',
                    fontColor: 'black',
                    font:'40px 微软雅黑'
                }
            }else{
                settings = {
                    canvasW : options.canvasWidth || 256,
                    canvasH : options.canvasHeight || 256,
                    text: options.text || '测试文字',
                    fontColor: options.color || 'white',
                    font:options.font || '40px 微软雅黑'
                }
            }
            var canvas = document.createElement('canvas')
            canvas.width = settings.canvasW
            canvas.height = settings.canvasH
            var ctx = canvas.getContext('2d')

            ctx.font = settings.font
            ctx.fillStyle = settings.fontColor
            ctx.textAlign = 'center'
            ctx.fillText(settings.text,settings.canvasW/2,settings.canvasH/2);

            return canvas;

        },
        initTextSprite:function(canvas){
            var spriteMaterial = new THREE.SpriteMaterial({
                map:new THREE.CanvasTexture(canvas),
                depthWrite: false,
                depthTest:false,
                // transparent: true,
            })
            var TextSprite = new  THREE.Sprite(spriteMaterial)
            return TextSprite
        }
        // initTextSprite:function(canvas){
        //     // ============================== 修改 start
        //     // var spriteMaterial = new THREE.SpriteMaterial({
        //     //     map:new THREE.CanvasTexture(canvas),
        //     //     // depthTest: false,
        //     //     transparent: false,
        //     // })
        //     var spriteMaterial = new THREE.ShaderMaterial({
        //         uniforms:{
        //             textTexture:{value: new THREE.CanvasTexture(canvas)}
        //         },

        //         vertexShader: document.getElementById( 'vertexshader' ).textContent,
        //         fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        //         // vertexShader: initShader.getShader(shaderStr, shaderType.vertex),
        //         // fragmentShader: initShader.getShader(shaderStr, shaderType.fragment),

        //         // blending: THREE.AdditiveBlending,
        //         // depthTest: false,
        //         depthWrite: false,
        //         transparent: true,
        //     })
        //     var geometry = new THREE.PlaneGeometry();
        //     var mesh = new THREE.Mesh(geometry,spriteMaterial);
        //     return mesh;
        //     // ============================== 修改 end
        //     var TextSprite = new  THREE.Sprite(spriteMaterial)
        //     return TextSprite
        // }
    }
    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = TextTool;
    } else if (typeof define === "function" && define.amd) {
        define(function() { return TextTool;});
    } else {
        !('TextTool' in _global) && (_global.TextTool = TextTool);
    }
}());

function ScaleGridHelper(size, divisions, color) {
    this.size = size || new THREE.Vector2(10, 10);
    this.divisions = divisions || new THREE.Vector2(10, 10);
    this.color = new THREE.Color(color !== undefined ? color : 0xffffff);

    var step = new THREE.Vector2();
    step.copy(size).divide(divisions);

    var color = new THREE.Color(0xFFFFFF);

    var step = new THREE.Vector2();
    step.copy(size).divide(divisions);

    var vertices = [], colors = [];
j = 0
    for (let i = 0,  k = -size.y / 2; i < divisions.y; ++i, k += step.y){
        vertices.push(- size.x / 2, 0, k, size.x / 2, 0, k);

        color.toArray(colors, j); j += 3;
        color.toArray(colors, j); j += 3;
        color.toArray(colors, j); j += 3;
        color.toArray(colors, j); j += 3;
    }

    for (let i = 0,  k = -size.x / 2; i < divisions.x; ++i, k += step.x){
        vertices.push(k, 0, - size.y / 2, k, 0, size.y / 2);

        // color.toArray(colors, j); j += 3;
        // color.toArray(colors, j); j += 3;
        // color.toArray(colors, j); j += 3;
        // color.toArray(colors, j); j += 3;
    }

    var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

	var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

	THREE.LineSegments.call( this, geometry, material );
}

function initGrid(meter, width, height) {
  let interval = meter || 0.25;
  width = width || 5;
  height = height || 5;
  var grid = new ScaleGridHelper(
    new THREE.Vector2(width, height),
    new THREE.Vector2(width / interval, height / interval),
  );
  grid.material.transparent = true;
  grid.material.opacity = 0.3;
  grid.material.depthWrite = false;
  grid.visible = true;
  return grid;
}

ScaleGridHelper.prototype = Object.assign(Object.create(THREE.LineSegments.prototype),{
	constructor: ScaleGridHelper,

	copy: function ( source ) {

		THREE.LineSegments.prototype.copy.call( this, source );

		this.geometry.copy( source.geometry );
		this.material.copy( source.material );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	}
})

var camera, controls, scene, renderer;
init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( -6, 3, 0 );
  // controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI / 2;
  // world
  var size = 10;
var divisions = 10;

  var interval = 0.1;
  let gridHori = initGrid(interval, 100, 100);
  gridHori.position.set(0, 0.001, 0);
  scene.add(gridHori);
  console.log(gridHori);
  
  let canvasText = TextTool.initTextCanvas({
    text: 'FUCK',
    font: '100px 微软雅黑',
  });
  let textSprite = TextTool.initTextSprite(canvasText);
  scene.add(textSprite);
  
  let textSprite2 = textSprite.clone();
  textSprite2.position.set( 2, 2, 0 );
  scene.add(textSprite2);
  // lights
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );
  var light = new THREE.DirectionalLight( 0x002288 );
  light.position.set( - 1, - 1, - 1 );
  scene.add( light );
  var light = new THREE.AmbientLight( 0x222222 );
  scene.add( light );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  requestAnimationFrame( animate );
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();
}
function render() {
  renderer.render( scene, camera );
}