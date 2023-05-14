<?php

class Decision_Tree_Ajax {    
    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $decision_tree;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;

    /**
     * Array de endpoints
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $endpoints;

    /**
     * Prefijo para los endpoints
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $prefix;

    /**
     * Opciones de configuración para el servicio rest
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $rest_api_options;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $plugin_name       The name of the plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct( $decision_tree, $version ) {
        $this->decision_tree = $decision_tree;
        $this->version = $version;

        $this->endpoints = array(
            'get_decision_tree' => "decision-tree/%s"
        );

        $this->prefix = "api";

        $this->rest_api_options = get_option('decision_tree_rest_api_options');
    }

     /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts() {
        wp_localize_script( $this->decision_tree  . '-decision-tree', 'DecisionTreeRESTAPI', array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'actions' => array(
                        'get_decision_tree' => "get_decision_tree" 
                     )
        ));
    }

    public function plugins_loaded() {            
         // Decision Tree      
        add_action('wp_ajax_nopriv_get_decision_tree', array($this, 'get_decision_tree'));
        add_action('wp_ajax_get_decision_tree', array($this, 'get_decision_tree'));
    }

    // <editor-fold defaultstate="collapsed" desc="Public Ajax Methods">    
    public function get_decision_tree() {     
        // get parameters
        $id = filter_input(INPUT_GET, "id");

         // Service Url
        $url = $this->rest_api_options["server_name"] . "/" . $this->prefix . '/' . sprintf($this->endpoints["get_decision_tree"], $id);

        // Llamada al servicio 
         $result = $this->process_service($url, 'GET'); 

        // Devolver resultado
        print_r(json_encode($result, JSON_UNESCAPED_SLASHES));

        die();  
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Private Methods">        
    private function process_service($url, $method) {            
        if ( is_wp_error( $response ) ) {
            throw new Exception('Petición fallida. ' . $response->get_error_messages());
        } else {
             $headers = array(
                //'Authorization' => 'Bearer ' . $response['access_token'], // Use verbose mode in cURL to determine the format you want for this header
                'Accept'        => 'application/json;ver=1.0',
                'Content-Type'  => 'application/json; charset=UTF-8'
            );
            $request = array(
                'headers' => $headers,
                'method'  => $method,
                'timeout' => 200
            );

            if( $method == 'GET'){
                $result = wp_remote_request( $url, $request );
            }
            else if ( $method == 'POST'){
                $result = wp_remote_post( $url, $request );
            }
            else{
                $result = wp_remote_request( $url, $request );
            }

            if ( is_wp_error( $result ) ) {
                throw new Exception('Petición fallida. ' . $result->get_error_messages());
            } 

            $response_code = $result['response']['code']; // Sucesfull codes 200 - 299
            if ($response_code < 200 || $response_code > 299) {
                throw new Exception('Petición fallida. ' . $result->get_error_messages());
            }

            /* Decode JSON. */
            return json_decode($result['body'], true);                
        }
    }
    // </editor-fold>
}

