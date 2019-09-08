//==vertex
{
    //vertex    
    attribute float size;
    attribute vec3 customColor;

    varying vec4 objPos;
    varying vec4 modelPos;

    void main() {

        mat4 t = mat4(  
            cos(1.57), 0., sin(1.57), 0.,
            0., 1., 0., 0.,
            -sin(1.57), 0., cos(1.57), 0.,
            0., 0., 0., 1.
        );

        t = mat4(  
            1., 0., 0., 0.,
            0., 1., 0., 0.,
            0., 0., 1., 0.,
            modelViewMatrix[3].x, modelViewMatrix[3].y, modelViewMatrix[3].z, 1.
        );


        vec4 mvPosition = t * vec4( position*2., 1.0 );

        //gl_PointSize = size * ( 300.0 / -mvPosition.z );

        objPos = vec4(position,1.);
        modelPos = modelMatrix * objPos;

        gl_Position = projectionMatrix * mvPosition;

    }
    //vertex end
}


//==fragment
{
    //fragment

    uniform vec3 color;
    // uniform sampler2D textTexture;

    varying vec4 objPos;
    varying vec4 modelPos;

    void main() {
        vec2 uv = (objPos.xy+.5);

        // gl_FragColor = texture2D( textTexture, uv );
        // gl_FragColor=vec4(1.,1.,1.,2.)*.5 + gl_FragColor;
        float a = dot(gl_FragColor , vec4(0.299,0.587,0.114,0.));
        // gl_FragColor= vec4(gl_FragColor.xyz,a)*0.5;
        gl_FragColor= vec4(uv.xyx,0.5);
    }
    //fragment end
}
