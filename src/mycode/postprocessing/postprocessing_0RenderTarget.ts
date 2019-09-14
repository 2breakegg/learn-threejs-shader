// class
import {THREE,OrbitControls} from "../mylib/init_comtrast_three.modle";

let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera( window.innerWidth/-2, 
    window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 10000);
let renderer = new THREE.WebGLRenderer();
let sceneA:SceneA;

renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.z = 1000;
document.body.appendChild(renderer.domElement);
// SceneA 场景1 
// 包括 scene, 物品, camera, WebGLRenderTarget (简称:fbo), 渲染方法(render)
class SceneA{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    cube: THREE.Group;
    fbo: THREE.WebGLRenderTarget;
    render: ()=>void;
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, 1., 0.1, 1000);
        this.camera.position.z = 5;
        this.cube = new THREE.Group();
        this.cube.add(
            new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color:0xff0000})));
        this.cube.add(
            new THREE.LineSegments(
                new THREE.WireframeGeometry(new THREE.BoxGeometry(1,1,1)), 
                new THREE.LineBasicMaterial({color: 0xffff00})
            ));

        this.scene.add(this.cube);

        var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
        this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

        this.render = function(){
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;

            renderer.setClearColor(new THREE.Color(0xffffff));
            renderer.setRenderTarget( this.fbo );
            renderer.clear();
            renderer.render( this.scene, this.camera );
        }
    }
}

function init(){
    sceneA = new SceneA();
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(100,100,100), 
        new THREE.MeshBasicMaterial({color:0xffffff,map:sceneA.fbo.texture})
    );

    scene.add(cube);

    let control = new OrbitControls(camera, renderer.domElement);
}

function animate(){
    requestAnimationFrame(animate);

    sceneA.render();
    renderer.setRenderTarget( null );
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.clear();
    renderer.render(scene, camera);
}

init();
animate();