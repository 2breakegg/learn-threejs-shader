import {THREE, renderer, log, scene, camera, animateFunctions, OrbitControls} from "../mylib/init";
// import * as THREE from "three";
import {initShader, shaderType} from "../mylib/initshader";
import shaderStr from "./meshlight_diffusePixelLevelMat.glsl";
// import shaderVertex from "./Phong.vert";
// import shaderFragment from "./Phong.frag";

let control = new OrbitControls(camera, renderer.domElement);

let mesh: THREE.Mesh;
let light;
let shaderVertex = initShader.getShader(shaderStr, shaderType.vertex);
let shaderFragment = initShader.getShader(shaderStr, shaderType.fragment);
function init() {

    // =============写shader的球
    var uniforms  = THREE.UniformsUtils.merge( [
        THREE.UniformsLib[ "common" ],
        THREE.UniformsLib[ "specularmap" ],
        THREE.UniformsLib[ "envmap" ],
        THREE.UniformsLib[ "aomap" ],
        THREE.UniformsLib[ "lightmap" ],
        THREE.UniformsLib[ "emissivemap" ],
        THREE.UniformsLib[ "bumpmap" ],
        THREE.UniformsLib[ "normalmap" ],
        THREE.UniformsLib[ "displacementmap" ],
        THREE.UniformsLib[ "roughnessmap" ],
        THREE.UniformsLib[ "metalnessmap" ],
        THREE.UniformsLib[ "gradientmap" ],
        THREE.UniformsLib[ "fog" ],
        THREE.UniformsLib[ "lights" ],
        THREE.UniformsLib[ "points" ],
    ] );
    mesh = new THREE.Mesh( new THREE.SphereBufferGeometry(), new THREE.ShaderMaterial( {
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
    light.position.set(2,2,2);
    scene.add( light );
    var targetObject = new THREE.Object3D();
    targetObject.position.set(1,1,1);
    scene.add(targetObject);
    light.target = targetObject;

    // window.targetObject = targetObject;
    // window.light=light;
    window.camera=camera;
}

init();
animateFunctions.add(() => {

});
// TODO FILE IS EMPTY
