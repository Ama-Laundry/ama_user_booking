/**
 * 4. NEW: REST API Enrichment for Laundry Orders
 * This function embeds the full Post Object data for 'service_id' and 'slot_id'
 * directly into the 'laundry_order' REST API response.
 * This eliminates the need for multiple API calls from the frontend.
 */
function custom_rest_api_acf_fields($response, $post, $request) {
    // Check if the post has ACF fields
    if (function_exists('get_fields')) {
        $acf_fields = get_fields($post->ID);
        
        if (!empty($acf_fields)) {
            // Add the entire ACF array to the response
            $response->data['acf'] = $acf_fields;

            // Enriches the response with details from related Post Objects
            if (isset($response->data['acf']['service_id']) && !empty($response->data['acf']['service_id'])) {
                $service_objects = $response->data['acf']['service_id'];
                $enriched_services = [];
                if (is_array($service_objects)) {
                    foreach ($service_objects as $service_post_object) {
                        $enriched_services[] = [
                            'ID' => $service_post_object->ID,
                            'post_title' => $service_post_object->post_title,
                            'acf' => get_fields($service_post_object->ID)
                        ];
                    }
                }
                $response->data['acf']['service_id'] = $enriched_services;
            }

            if (isset($response->data['acf']['slot_id']) && !empty($response->data['acf']['slot_id'])) {
                $slot_post_object = $response->data['acf']['slot_id'];
                $response->data['acf']['slot_id'] = [
                    'ID' => $slot_post_object->ID,
                    'post_title' => $slot_post_object->post_title,
                    'acf' => get_fields($slot_post_object->ID)
                ];
            }
        }
    }

    return $response;
}
// Attach the function to the REST API hook for the 'laundry_order' post type
add_filter('rest_prepare_laundry_order', 'custom_rest_api_acf_fields', 10, 3);