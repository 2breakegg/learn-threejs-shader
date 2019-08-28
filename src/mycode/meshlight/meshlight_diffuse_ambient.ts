import {renderer, log, scene, camera, animateFunctions} from "../mylib/init";
import * as THREE from "three";
import {OrbitControls} from "../jsm/controls/OrbitControls";
import {initShader, shaderType} from "../mylib/initshader";
import shaderStr from "./meshlight_diffusePixelLevelMat.glsl";
import shaderVertex from "./meshlight_diffuse_ambient.vert";
import shaderFragment from "./meshlight_diffuse_ambient.frag";

let control = new OrbitControls(camera, renderer.domElement);

let mesh: THREE.Mesh;
let light;
// let shaderVertex = initShader.getShader(shaderStr, shaderType.vertex);
// let shaderFragment = initShader.getShader(shaderStr, shaderType.fragment);
function init() {

    // =============写shader的球
    var uniforms  = THREE.UniformsUtils.merge( [
        THREE.UniformsLib[ "common" ],
        THREE.UniformsLib[ "normalmap" ],
        THREE.UniformsLib[ "lights" ],
        THREE.UniformsLib[ "points" ],
    ] );
    mesh = new THREE.Mesh( new THREE.SphereBufferGeometry(1,20,20), new THREE.RawShaderMaterial( {
        uniforms: uniforms,

        vertexShader: shaderVertex,
        fragmentShader: shaderFragment,

        lights: true
        // blending: THREE.AdditiveBlending,
        // depthTest: true,
        // transparent: true,
    } ) );
    scene.add( mesh );

    // ===============MeshPhongMaterial的球
    let sphere = new THREE.Mesh(new THREE.CylinderBufferGeometry(),new THREE.MeshLambertMaterial({
        color:0xffffff
    }))
    sphere.position.set(0,2,0);
    scene.add( sphere );

    // =====================坐标线
    let axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // =======================光
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(3,2,1);
    scene.add( light );
    var targetObject = new THREE.Object3D();
    targetObject.position.set(0,0,0);
    scene.add(targetObject);
    light.target = targetObject;

    uniforms.directionalLight = {
        value:{
            color:light.color,
            direction:light.position
        }
    }
    uniforms.color = {
        value: new THREE.Color(0x339900)
    }
    uniforms.ambient = {
        value: new THREE.Vector3(0.1,0.1,0.1)
    }

    // light.position
    // light.color
    // uniforms.

    window.camera=camera;
    window.uniforms=uniforms;
}

init();
animateFunctions.add(() => {

});
// TODO FILE IS EMPTY
