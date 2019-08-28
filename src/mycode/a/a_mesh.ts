import {renderer, log, scene, camera, animateFunctions} from "../mylib/init";
import * as THREE from "three";
import {OrbitControls} from "../jsm/controls/OrbitControls";
import {initShader, shaderType} from "../mylib/initshader";
import shaderStr from "./a_mesh.glsl";

let control = new OrbitControls(camera, renderer.domElement);

let mesh: THREE.Mesh;
function init() {
    let positions = new Float32Array( 3 );
    let geometry = new THREE.PlaneBufferGeometry();
    //geometry.addAttribute( "position", new THREE.BufferAttribute( positions, 3 ) );

    let material = new THREE.ShaderMaterial( {

        vertexShader: initShader.getShader(shaderStr, shaderType.vertex),
        fragmentShader: initShader.getShader(shaderStr, shaderType.fragment),

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,

    } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.x;
    scene.add( mesh );

}

init();
animateFunctions.add(() => {

});
// TODO FILE IS EMPTY
