<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 * @author     Your Name <email@example.com>
 */
class Decision_Tree_Admin {
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

    private $settings_page = 'decision-tree-settings';
    private $settings_key_general = 'decision-tree-settings-general';
    private $plugin_settings_tabs = array();

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $decision_tree       The name of this plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct( $decision_tree, $version ) {
        $this->decision_tree = $decision_tree;
        $this->version = $version;
    }

    /**
     * Register the stylesheets for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_styles() {
        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Plugin_Name_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Plugin_Name_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_style( $this->decision_tree, plugin_dir_url( __FILE__ ) . 'css/decision-tree-admin.css', array(), $this->version, 'all' );

    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts() {
        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Plugin_Name_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Plugin_Name_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_script( $this->decision_tree, plugin_dir_url( __FILE__ ) . 'js/decision-tree-admin.js', array( 'jquery' ), $this->version, false );
    }

    /**
     * Load the plugin text domain for translation.
     *
     * @since    1.0.0
     */
    public function plugins_loaded() {
        add_action( 'admin_init', array( $this, 'admin_init' ) );
        add_action( 'admin_menu', array( $this, 'admin_menu' ) );

        add_filter( 'decision-tree-setting-is-enabled', array( $this, 'setting_is_enabled' ), 1, 3 );
        add_filter( 'decision-tree-setting-get', array( $this, 'setting_get' ), 1, 3 );
    }

    public function admin_init() {
        $this->register_general_settings();
    }

    public function admin_menu() {
        add_options_page( esc_html__( 'Decision_Tree', 'decision_tree' ), esc_html__( 'Decision_Tree', 'decision_tree' ), 'manage_options', $this->settings_page, array( $this, 'options_page' ), 30 );
    }

    private function register_general_settings() {
        $key = $this->settings_key_general;
        $this->plugin_settings_tabs[ $key ] = esc_html__( 'Host de servicios Rest', 'decision_tree' );

        register_setting( $key, $key );

        $section = 'rest-api';

         add_settings_field( 'add-rest-host-server', esc_html__( 'Añadir host de servicios Rest', 'decision_tree' ), array( $this, 'settings_yes_no' ), $key, $section,
                array( 'key' => $key, 'name' => 'add-revision-count', ) );
    }

    public function setting_is_enabled( $enabled, $key, $setting ) {
        return '1' === $this->setting_get( '0', $key, $setting );
    }


    public function setting_get( $value, $key, $setting ) {
        $args = wp_parse_args( get_option( $key ),
                array(
                        $setting => $value,
                )
        );

        return $args[$setting];
    }

    public function settings_yes_no( $args ) {
        $args = wp_parse_args( $args,
                array(
                        'name' => '',
                        'key' => '',
                        'after' => '',
                )
        );

        $name = $args['name'];
        $key = $args['key'];

        $option = get_option( $key );
        $value = isset( $option[$name] ) ? esc_attr( $option[$name] ) : '';

        if ( empty( $value ) )
                $value = '0';

        $name = esc_attr( $name );
        $key = esc_attr( $key );

        echo '<div>';
        echo "<label><input id='{$name}_1' name='{$key}[{$name}]'  type='radio' value='1' " . ( '1' === $value ? " checked=\"checked\"" : "" ) . "/>" . esc_html__( 'Yes', 'decision_tree' ) . "</label> ";
        echo "<label><input id='{$name}_0' name='{$key}[{$name}]'  type='radio' value='0' " . ( '0' === $value ? " checked=\"checked\"" : "" ) . "/>" . esc_html__( 'No', 'decision_tree' ) . "</label> ";
        echo '</div>';

        if ( !empty( $args['after'] ) )
                echo '<div>' . esc_html( $args['after'] ) . '</div>';
    }

    public function options_page() {
        $tab = $this->current_tab(); ?>
        <div class="wrap">
                <?php $this->plugin_options_tabs(); ?>
                <form method="post" action="options.php" class="options-form">
                        <?php settings_fields( $tab ); ?>
                        <?php do_settings_sections( $tab ); ?>
                        <?php submit_button( esc_html__( 'Save Settings', 'decision_tree' ), 'primary', 'submit', true ); ?>
                </form>
        </div>
        <?php

        $settings_updated = filter_input( INPUT_GET, 'settings-updated', FILTER_SANITIZE_STRING );
        if ( ! empty( $settings_updated ) ) {
                flush_rewrite_rules( );
        }
    }

    private function current_tab() {
        $current_tab = filter_input( INPUT_GET, 'tab', FILTER_SANITIZE_STRING );
        return empty( $current_tab ) ? $this->settings_key_general : $current_tab;
    }


    private function plugin_options_tabs() {
        $current_tab = $this->current_tab();
        echo '<h2>' . esc_html__( 'Parámetros Decision Tree', 'decision_tree' ) . '</h2><h2 class="nav-tab-wrapper">';
        foreach ( $this->plugin_settings_tabs as $tab_key => $tab_caption ) {
                $active = $current_tab == $tab_key ? 'nav-tab-active' : '';

                $url = add_query_arg( array(
                                'page' => rawurlencode( $this->settings_page ),
                                'tab' => rawurlencode( $tab_key ),
                        ),
                        admin_url( 'options-general.php' )
                );

                echo '<a class="nav-tab ' . $active . '" href="' . esc_url( $url ) . '">' . esc_html( $tab_caption ) . '</a>';
        }
        echo '</h2>';
    }
}
