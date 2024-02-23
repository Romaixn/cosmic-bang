
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel
    float fresnel = 1.0 - dot(viewDirection, normal);
    fresnel = pow(fresnel, 6.0);
    vec3 color = vec3(fresnel);

    // Final color
    gl_FragColor = vec4(vec3(1.0), fresnel);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
