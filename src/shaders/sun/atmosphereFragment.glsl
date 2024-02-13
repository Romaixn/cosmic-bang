uniform vec3 uAtmosphereColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
 vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Fresnel
    float fresnel = dot(viewDirection, normal);
    fresnel = pow(fresnel, 2.0);

    // Atmosphere
    vec3 atmosphereColor = vec3(uAtmosphereColor);
    color += atmosphereColor;

    // Alpha
    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.0, 0.8, edgeAlpha);

    // Final color
    gl_FragColor = vec4(clamp(color * fresnel, 0.0, 1.0), edgeAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
