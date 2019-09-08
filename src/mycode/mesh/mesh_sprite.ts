import {THREE ,renderer, log, scene, camera, animateFunctions} from "../mylib/init";
import {OrbitControls} from "../../files/jsm/controls/OrbitControls";
import {initShader, shaderType} from "../mylib/initshader";
import shaderStr from "./mesh_sprite.glsl";

let control = new OrbitControls(camera, renderer.domElement);
renderer.setClearColor(new THREE.Color(0x666666));

let mesh: THREE.Mesh[] = new Array();
let sum = 10;
function init() {
    let cube = createCube();
    cube.position.set(0,0,0);
    cube.scale.set(10,0.1,10);
    
    mesh.push(cube);
    scene.add(cube);
    for(var i=0; i<sum; i++){
        let cube = createCube()
        mesh.push(cube);
        scene.add(cube);
    }
}
function createCube(){
    let geometry = new THREE.PlaneBufferGeometry();
    // let geometry = new THREE.BoxBufferGeometry();
    let iTime = new Float32Array( 24 );
    for(var i=0; i<iTime.length; i++){
        iTime[i]=0;
    }
    geometry.addAttribute( "itime", new THREE.BufferAttribute( iTime, 1 ) );

    let material = new THREE.ShaderMaterial( {

        vertexShader: initShader.getShader(shaderStr, shaderType.vertex),
        fragmentShader: initShader.getShader(shaderStr, shaderType.fragment),

        // blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: false,

    } );

    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = 5-Math.random()*10;
    mesh.position.z = 5-Math.random()*10;
    mesh.scale.y = Math.random()*5+1;
    return mesh;
}

init();
animateFunctions.add(() => {
    let time = new Date().getTime() /60 % 10000 ;

    for(var i=0; i<mesh.length;i++){
        let geometry = mesh[i].geometry as THREE.BufferGeometry;
        let itime = geometry.attributes.itime as THREE.BufferAttribute;

        // time = Math.sin(time);
        let arr = itime.array as number[];
        for(var i2=0; i2<arr.length; i2++){
            arr[i2]=time;
        }
        itime.needsUpdate = true;
    }
});
// TODO FILE IS EMPTY
