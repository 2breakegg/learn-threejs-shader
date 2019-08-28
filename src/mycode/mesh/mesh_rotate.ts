import {renderer, log, scene, camera, animateFunctions} from "../mylib/init";
import * as THREE from "three";
import {OrbitControls} from "../jsm/controls/OrbitControls";
import {initShader, shaderType} from "../mylib/initshader";
import shaderStr from "./mesh_rotate.glsl";

let control = new OrbitControls(camera, renderer.domElement);

let mesh: THREE.Mesh;
function init() {
    let positions = new Float32Array( 3 );
    let geometry = new THREE.PlaneBufferGeometry();
    let iTime = new Float32Array( 4 );
    iTime[0] = 0.2;
    iTime[1] = 0.2;
    iTime[2] = 0.2;
    iTime[3] = 0.2;
    geometry.addAttribute( "itime", new THREE.BufferAttribute( iTime, 1 ) );

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
    let time = new Date().getTime() /60 % 360;

    let geometry = mesh.geometry as THREE.BufferGeometry;
    let itime = geometry.attributes.itime as THREE.BufferAttribute;

    // time = Math.sin(time);
    let arr = itime.array as number[];
    arr[ 0 ] =  time ;
    arr[ 1 ] =  time ;
    arr[ 2 ] =  time ;
    arr[ 3 ] =  time ;
    itime.needsUpdate = true;
});
// TODO FILE IS EMPTY
