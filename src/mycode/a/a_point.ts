import {THREE ,renderer, log, scene, camera, animateFunctions} from "../mylib/init";
import {OrbitControls} from "../../files/jsm/controls/OrbitControls";
import {initShader, shaderType} from "../mylib/initshader";
import shaderStr from "./a_point.glsl";

let control = new OrbitControls(camera, renderer.domElement);

let sphere: THREE.Points;
function init() {

    let amount = 1;

    let positions = new Float32Array( amount * 3 );

    let iTime = new Float32Array( 1 );

    let vertex = new THREE.Vector3();

    vertex.toArray( positions, 0 );

    iTime[0] = 0.2;

    let geometry = new THREE.BufferGeometry();
    geometry.addAttribute( "position", new THREE.BufferAttribute( positions, 3 ) );

    geometry.addAttribute( "itime", new THREE.BufferAttribute( iTime, 1 ) );


    let material = new THREE.ShaderMaterial( {

        vertexShader: initShader.getShader(shaderStr, shaderType.vertex),
        fragmentShader: initShader.getShader(shaderStr, shaderType.fragment),

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,

    } );

    //

    sphere = new THREE.Points( geometry, material );
    scene.add( sphere );

}

init();
animateFunctions.add(() => {
    let time = new Date().getTime() / 1000;
    // sphere.rotation.z = 0.01 * time;

    let geometry = sphere.geometry as THREE.BufferGeometry;
    let itime = geometry.attributes.itime as THREE.BufferAttribute;

    time = Math.sin(time);
    let arr = itime.array as number[];
    arr[ 0 ] =  time ;
    // .array[ 0 ]
    itime.needsUpdate = true;
});
// TODO FILE IS EMPTY
