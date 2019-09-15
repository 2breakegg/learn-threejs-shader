import {THREE,OrbitControls} from "../mylib/init_comtrast_three.modle";
import bloom2_vert from "../glsl/postprocessing/Bloom2.vert";
import bloom2_frag from "../glsl/postprocessing/Bloom2.frag";
import getHighLight_vert from "../glsl/postprocessing/getHighLight.vert";
import getHighLight_frag from "../glsl/postprocessing/getHighLight.frag";
import mixBloom_vert from "../glsl/postprocessing/mixBloom.vert";
import mixBloom_frag from "../glsl/postprocessing/mixBloom.frag";

let scene = new THREE.Scene();
let winWidth = window.innerWidth/2, winHeight = window.innerHeight; 
let camera = new THREE.OrthographicCamera( winWidth/-2, 
    winWidth/2, winHeight/2, winHeight/-2, 1, 10000);
let sceneA:SceneA, hightLightScene: ScenePlane, scenePlanes = Array<ScenePlane>(), mixScene: ScenePlane;
camera.position.z = 1000;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(winWidth,winHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";

let renderer2 = new THREE.WebGLRenderer();
renderer2.setSize(winWidth,winHeight);
document.body.appendChild(renderer2.domElement);
renderer2.domElement.style.position = "fixed";
renderer2.domElement.style.top = "0";
renderer2.domElement.style.right = "0";

// 原场景,原相机
class SceneA{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    group: THREE.Group;
    cubeNum = 1000;
    fbo: THREE.WebGLRenderTarget;
    render: ()=>void;
    createScene(){
        this.group = new THREE.Group();
        // this.cube.add(
            //new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color:0xffff00})));
        // this.group.add(
        //     new THREE.LineSegments(
        //         new THREE.WireframeGeometry(new THREE.BoxGeometry(1,1,1)), 
        //         new THREE.LineBasicMaterial({color: 0xffff00})
        //     ));

        for(let i = 0; i< this.cubeNum; i++){
            this.group.add(this.createCube());
        }
        this.scene.add(this.group);
    };
    createCube(){
        let size = Math.random();
        let color = parseInt(Math.random() * 0xffffff + "");
        let position = new THREE.Vector3(Math.random()*10-5,Math.random()*10-5,Math.random()*10-10);
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(size,size,size), new THREE.MeshBasicMaterial({color:color}));
        mesh .position.set(position.x, position.y, position.z);
        return mesh;
    };
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, winWidth/winHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.createScene();

        var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
        this.fbo = new THREE.WebGLRenderTarget( winWidth, winHeight, renderTargetParameters );

        this.render = function(){
            // this.cube.rotation.x += 0.01;
            // this.cube.rotation.y += 0.01;

            renderer.setRenderTarget( this.fbo );
            renderer.clear();
            renderer.render( this.scene, this.camera );

            renderer2.render( this.scene, this.camera );
        }
    }
}
// 进行多次泛光,模糊操作用的场景, 
// 由于需要水平模糊和数值模糊, 在数组scenePlanes 中 下标偶数为水平模糊, 下标奇数垂直模糊
class ScenePlane{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    plane: THREE.Mesh;
    fbo: THREE.WebGLRenderTarget;
    render: ()=>void;
    /**
     * @param {THREE.WebGLRenderTarget} shaderMaterial
     * @param {boolean} isLast : boolean 判断是否是最后一次渲染, 最后次渲染要渲染到屏幕上
     */
    constructor(shaderMaterial: THREE.ShaderMaterial,  isLast?: boolean){ 
        isLast = isLast ? true : false;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( winWidth/-2, 
            winWidth/2, winHeight/2, winHeight/-2, 1, 10000);
        this.camera.position.z = 5;
        this.plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(winWidth, winHeight), 
            shaderMaterial
        );

        this.scene.add(this.plane);

        var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
        this.fbo = new THREE.WebGLRenderTarget( winWidth, winHeight, renderTargetParameters );

        this.render = function(){
            if(isLast){
                renderer.setRenderTarget( null );
            }else{
                renderer.setRenderTarget( this.fbo );
            }
            
            renderer.clear();
            renderer.render( this.scene, this.camera );
        }
    }
}

let getHighLightShaderMaterial = function(otherFbo: THREE.WebGLRenderTarget){ 
    return new THREE.ShaderMaterial({
        uniforms: {
            "tDiffuse": { value: otherFbo.texture },// as aa,
            "_Threshold": {value: 0.5},
        },
        vertexShader: getHighLight_vert,
        fragmentShader: getHighLight_frag,
        transparent: true
    })
}
/**
 * 
 * @param { THREE.WebGLRenderTarget } otherFbo 
 * @param { boolean } direction 
 */
let bloomShaderMaterial = function(otherFbo: THREE.WebGLRenderTarget, direction : boolean){ 
    return new THREE.ShaderMaterial({
        uniforms: {
            "tDiffuse": { value: otherFbo.texture },
            "_MainTex_TexelSize":    { value: 
                direction ? new THREE.Vector4(1/winWidth, 0, 0., 0.) : new THREE.Vector4(0, 1/winHeight, 0., 0.) },
            "_BlurSize":   { value: 1.0 },
        },
        vertexShader: bloom2_vert,
        fragmentShader: bloom2_frag,
    })
}
let mixShaderMaterial = function(sourceFbo: THREE.WebGLRenderTarget, bloomFbo: THREE.WebGLRenderTarget){ 
    return new THREE.ShaderMaterial({
        uniforms: {
            "tDiffuse": { value: sourceFbo.texture },
            "tDiffuse2": { value: bloomFbo.texture },
        },
        vertexShader: mixBloom_vert,
        fragmentShader: mixBloom_frag,
    })
}
function init(){
    let renderNum = 20; // 渲染次数
    let fbo: THREE.WebGLRenderTarget; // 类似于迭代器, 存储上一次渲染到哪个 fbo了
    sceneA = new SceneA();
    // hightLightScene = new ScenePlane(getHighLightShaderMaterial(sceneA.fbo));
    hightLightScene = new ScenePlane(getHighLightShaderMaterial(sceneA.fbo));
    fbo = hightLightScene.fbo;
    for(var i = 0; i <= renderNum; i++){
        let direction = (i % 2 == 0); 
        let bloomScene = new ScenePlane(bloomShaderMaterial(fbo, direction));
        fbo = bloomScene.fbo;
        scenePlanes.push(bloomScene);
    }
    mixScene = new ScenePlane(mixShaderMaterial(sceneA.fbo, fbo), true); // 混合原图和高光模糊图

    new OrbitControls(sceneA.camera, renderer.domElement);
}

function animate(){
    requestAnimationFrame(animate);
    sceneA.render();
    hightLightScene.render();
    for(let i = 0; i < scenePlanes.length; i++){
        scenePlanes[i].render();
    }
    mixScene.render();
}

init();
animate();