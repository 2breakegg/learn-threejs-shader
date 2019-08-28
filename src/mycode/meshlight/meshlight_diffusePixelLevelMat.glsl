//==vertex
{
    //vertex
    attribute float itime;


    varying vec3 normal2;
    varying vec4 col;
    void main() {
        normal2 = vec3( modelViewMatrix *  vec4(normal, 1.));
        col=vec4(1.,1.,1.,1.);
        vec3 pos = position;

        vec4 mvPosition = modelViewMatrix * vec4( pos , 1.0 );

        gl_Position = projectionMatrix * mvPosition ;

        // 设置颜色
        col=vec4(pos.x+0.5,-pos.x+0.5,0.,1.);
    }

    //vertex end
}

//==fragment
{
    //fragment
    varying vec4 col;
    varying vec3 normal2;
    varying vec3 vViewPosition;

    struct IncidentLight {
        vec3 color;
        vec3 direction;
        bool visible;
    };
    struct ReflectedLight {
        vec3 directDiffuse;
        vec3 directSpecular;
        vec3 indirectDiffuse;
        vec3 indirectSpecular;
    };
    struct GeometricContext {
        vec3 position;
        vec3 normal;
        vec3 viewDir;
    };
    struct DirectionalLight {
		vec3 direction;
		vec3 color;
		int shadow;
		float shadowBias;
		float shadowRadius;
		vec2 shadowMapSize;
	};

    uniform DirectionalLight directionalLights[ 1 ];
    void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		directLight.color = directionalLight.color;
		directLight.direction = directionalLight.direction;
		directLight.visible = true;
	}

    void main() {
        // GeometricContext geometry;
        // geometry.position = - vViewPosition;
        // geometry.normal = normal;
        // geometry.viewDir = normalize( vViewPosition );

        IncidentLight directLight;
        DirectionalLight directionalLight;
	
		directionalLight = directionalLights[ 0 ];
        // getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
        // normal2
        float brightness = dot(directionalLight.direction,normal2);
        // gl_FragColor = vec4( brightness*directionalLight.color,1. );
        gl_FragColor = vec4( normal2*directionalLight.color,1. );
    }
    //fragment end
}
