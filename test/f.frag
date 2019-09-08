float SmoothLine(float distance, float fraction) {
    float SmoothCenter = 0.5;
    vec2 deltaXY = vec2(dFdx(distance), dFdy(distance));
    float delta = sqrt(dot(deltaXY, deltaXY));
    float smoothWidth = delta * 2.0;
    float centerDistance = abs(SmoothCenter - distance);
    float t = clamp(1.0 - centerDistance / smoothWidth, 0.0, 1.0);
    t = fraction < SmoothCenter ? t : 0.0;
    return t * t * (3.0 - 2.0 * t);
}
void main() {
    float v = texture2D(u_imgTexture, v_textCoord).x;
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

    float vFraction = fract(v * 10.0);
    float vLineDistance = 1.0 - 2.0 * abs(vFraction - 0.5);
    vLineDistance *= vLineDistance * vLineDistance;
    float alpha = SmoothLine(vLineDistance, vFraction);

    if (alpha < 0.5) {
        color = vec4(0.0, 0.0, 0.0, 0.0);
    }
    gl_FragColor = color * color.a;
}
