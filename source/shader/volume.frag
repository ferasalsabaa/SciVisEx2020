#version 150
#extension GL_ARB_explicit_attrib_location : require

#define TASK 10
#define ENABLE_LIGHTNING 0


in vec3 ray_entry_position;

layout(location = 0) out vec4 FragColor;

uniform mat4 Modelview;

uniform sampler3D volume_texture;
uniform sampler2D transfer_func_texture;

uniform vec3    camera_location;
uniform float   sampling_distance;
uniform float   iso_value;
uniform float   iso_value_2;
uniform vec3    max_bounds;
uniform ivec3   volume_dimensions;

uniform vec3    light_position;
uniform vec3    light_ambient_color;
uniform vec3    light_diffuse_color;
uniform vec3    light_specular_color;
uniform float   light_ref_coef;


bool
inside_volume_bounds(const in vec3 sampling_position)
{
    return (   all(greaterThanEqual(sampling_position, vec3(0.0)))
            && all(lessThanEqual(sampling_position, max_bounds)));
}


float
sample_data_volume(vec3 in_sampling_pos)
{
    vec3 obj_to_tex = vec3(1.0) / max_bounds;
    return texture(volume_texture, in_sampling_pos * obj_to_tex).r;

}

void main()
{
    /// One step trough the volume
    vec3 ray_increment      = normalize(ray_entry_position - camera_location) * sampling_distance;
    /// Position in Volume
    vec3 sampling_pos       = ray_entry_position + ray_increment; // test, increment just to be sure we are in the volume

    /// Init color of fragment
    vec4 out_col = vec4(0.0, 0.0, 0.0, 0.0);

    /// check if we are inside volume
    bool inside_volume = inside_volume_bounds(sampling_pos);
    
    if (!inside_volume)
        discard;


#if TASK == 0 
// example - thresholded projection
// any rays where a sample found with value > a fixed threshold are coloured


    const float example_threshold = 0.33f;
    // the traversal loop,
    // termination when the sampling position is outside volume boundary
    while (inside_volume) 
    {      
        // get sample
        float s = sample_data_volume(sampling_pos);

        // compare sample value with threshold
        if (s > example_threshold){

            // apply the transfer function to retrieve color and opacity
            vec4 color = texture(transfer_func_texture, vec2(s, s));
            out_col = color;
            out_col = vec4(1,1,1,1);

            // stop moving ray through the volume (early ray termination)
            break;
        }
                
           
        // increment the ray sampling position
        sampling_pos  += ray_increment;

        // update the loop termination condition
        inside_volume  = inside_volume_bounds(sampling_pos);
    }


#endif 
    
#if TASK == 11 // Task 1.1: X-Ray

    // the traversal loop,
    // termination when the sampling position is outside volume boundary
    while (inside_volume)
    {      
        // get sample
        float s = sample_data_volume(sampling_pos);

        // dummy code
        out_col = vec4(1.0,0.0,0.0,1.0);

        // increment the ray sampling position
        sampling_pos  += ray_increment;

        // update the loop termination condition
        inside_volume  = inside_volume_bounds(sampling_pos);
    }
#endif

#if TASK == 12 // Task 1.2: Angiogram

    // the traversal loop,
    // termination when the sampling position is outside volume boundary
    while (inside_volume)
    {      
        // get sample
        float s = sample_data_volume(sampling_pos);

        // dummy code
        out_col = vec4(0.0,1.0,0.0,1.0);

        // increment the ray sampling position
        sampling_pos  += ray_increment;

        // update the loop termination condition
        inside_volume  = inside_volume_bounds(sampling_pos);
    }
#endif

#if TASK == 13 // Task 1.3: First-Hit Iso-Surface Ray Traversal

    // the traversal loop,
    // termination when the sampling position is outside volume boundary
    while (inside_volume)
    {      
        // get sample
        float s = sample_data_volume(sampling_pos);

        // dummy code
        out_col = vec4(0.0,0.0,1.0,1.0);


#if ENABLE_LIGHTNING == 1 // Task 1.5: Add illumination to iso-surface
        IMPLEMENT;
#endif


        // increment the ray sampling position
        sampling_pos  += ray_increment;

        // update the loop termination condition
        inside_volume  = inside_volume_bounds(sampling_pos);
    }
#endif

    
#if TASK == 21 // Task 2.1: Front-to-back Compositing
    
    // the traversal loop,
    // termination when the sampling position is outside volume boundarys
    while (inside_volume)
    {
        // get sample
        float s = sample_data_volume(sampling_pos);
     
        // dummy code
        out_col = vec4(0.0,1.0,1.0,1.0);

#if ENABLE_LIGHTNING == 1 // Task 2.3: Add illumination to front-to-back compositing
        IMPLEMENT;
#endif

        // increment the ray sampling position
        sampling_pos += ray_increment;


        // update the loop termination condition
        inside_volume = inside_volume_bounds(sampling_pos);
    }
#endif 


#if TASK == 24 // Task 2.4: Multiple Iso-surface Compositing
    
    // the traversal loop,
    // termination when the sampling position is outside volume boundarys
    while (inside_volume)
    {
        // get sample
        float s = sample_data_volume(sampling_pos);
     
        // dummy code
        out_col = vec4(1.0,1.0,0.0,1.0);

        // increment the ray sampling position
        sampling_pos += ray_increment;


        // update the loop termination condition
        inside_volume = inside_volume_bounds(sampling_pos);
    }
#endif

#if TASK == 25 // Task 2.5: Adaptive Sampling & Opacity Correction
    
    // the traversal loop,
    // termination when the sampling position is outside volume boundarys
    while (inside_volume)
    {
        // get sample
        float s = sample_data_volume(sampling_pos);
     
        // dummy code
        out_col = vec4(1.0,0.0,1.0,1.0);

        // increment the ray sampling position
        sampling_pos += ray_increment;


        // update the loop termination condition
        inside_volume = inside_volume_bounds(sampling_pos);
    }
#endif 

    // return the calculated color value
    FragColor = out_col;
}

