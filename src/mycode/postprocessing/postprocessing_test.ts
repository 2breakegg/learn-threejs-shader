// import {THREE, renderer, log, scene, camera, animateFunctions, OrbitControls} from "../mylib/init";
// import * as THREE from "../../files/three/src/Three";
import * as THREE from "../../files/three/build/three.module";
import {initShader, shaderType} from "../mylib/initshader";
import { EffectComposer } from '../../files/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../files/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../../files/three/examples/jsm/postprocessing/ShaderPass.js';

import { RGBShiftShader } from '../../files/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from "../../files/three/examples/jsm/shaders/DotScreenShader";

import flower_png from './flower.png';

//let control = new OrbitControls(camera, renderer.domElement);

let camera:THREE.PerspectiveCamera, scene:THREE.Scene, renderer:THREE.WebGLRenderer, composer: EffectComposer;
let object:THREE.Object3D, light:THREE.DirectionalLight;

init();
animate();
function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    object = new THREE.Object3D();
    scene.add( object );

    var geometry = new THREE.SphereBufferGeometry( 1, 4, 4 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

    for ( var i = 0; i < 100; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
        mesh.position.multiplyScalar( Math.random() * 400 );
        mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
        object.add( mesh );

    }

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    // postprocessing

    composer = new EffectComposer( renderer );
    composer.addPass( new RenderPass( scene, camera ) );

    var effect = new ShaderPass( DotScreenShader );
    effect.uniforms[ 'scale' ].value = 1.5;
    composer.addPass( effect );

    var effect = new ShaderPass( RGBShiftShader );
    effect.uniforms[ 'amount' ].value = 0.015;
    composer.addPass( effect );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    object.rotation.x += 0.001;
    object.rotation.y += 0.001;

    renderer.render(scene,camera);
    composer.render();

}

declare global {
    interface Window {
        scene: any;
        camera: any;
        renderer: any;
        composer: any;
    }
}

window.scene = scene;
window.camera = camera;
window.renderer = renderer;
window.composer = composer;

// animateFunctions.add(() => {

// });
// TODO FILE IS EMPTY
