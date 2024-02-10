uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

mat2 rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    float t = uTime * 0.02;

    mat2 rot0 = rotate(t);
    vec3 p0 = modelPosition.xyz;
    p0.yz = rot0 * p0.yz;

    mat2 rot1 = rotate(t + 10.0);
    vec3 p1 = modelPosition.xyz;
    p1.xz = rot1 * p1.xz;

    mat2 rot2 = rotate(t + 20.0);
    vec3 p2 = modelPosition.xyz;
    p2.xy = rot2 * p2.xy;

    // Varyings
    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;

    vLayer0 = p0;
    vLayer1 = p1;
    vLayer2 = p2;
}
