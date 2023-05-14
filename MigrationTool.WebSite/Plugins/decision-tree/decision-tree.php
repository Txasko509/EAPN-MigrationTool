<?php
/*
Plugin Name: Decision Tree
Plugin URI:
Description: Crea un plugin para dar soporte a la visualización de árboles de decisión
Version: 1.0
Author: Inycom
Author URI: 
License: GPLv2
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'DECISION_TREE_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-decision-tree-activator.php
 */
function activate_decision_tree() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-decision-tree-activator.php';
    Decision_Tree_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-decision-tree-deactivator.php
 */
function deactivate_decision_tree() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-decision-tree-deactivator.php';
    Decision_Tree_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_decision_tree' );
register_deactivation_hook( __FILE__, 'deactivate_decision_tree' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-decision-tree.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_decision_tree() {
    $plugin = new Decision_Tree();
    $plugin->run();
}

run_decision_tree();
