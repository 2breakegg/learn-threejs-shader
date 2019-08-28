//==vertex
{
    //vertex
    attribute float itime;

    varying float iTime;

    void main() {

        iTime = itime;

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_PointSize = 10. * ( 300.0 / -mvPosition.z );

        gl_Position = projectionMatrix * mvPosition;

    }

    //vertex end
}

//==fragment
{
    //fragment
    varying float iTime;

    void main() {
        vec2 uv = gl_PointCoord;
        vec3 col3 = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
        gl_FragColor = vec4(col3, 1.0);
    }

    //fragment end
}
