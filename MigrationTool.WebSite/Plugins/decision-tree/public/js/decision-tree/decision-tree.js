(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */
$.extend( {

		decision_tree_api: {
                       init: function(id){
                           var decision_tree_html="<div id=\"page-content-decision-tree-" + id + "\"></div>";

                            // inject to 'app' in index.html
                            $("#decision-tree-" + id).append(decision_tree_html);    
                       },
                       
                       get_rest_api: function(){
                           return DecisionTreeRESTAPI;
                       },
                                              
                       set_content: function(content, id){
                            // change page content
                            $("#page-content-decision-tree-" + id).html(content);
                       },
                       
                       append_content: function(content, id){
                            // change page content
                            $("#page-content-decision-tree-" + id).append(content);
                       }
		}
	} );

	$(document).ready( function() {
                // app html
//                var decision_tree_html="<div id=\"page-content-decision-tree\"></div>";
//
//                // inject to 'app' in index.html
//                $("#decision-tree").append(decision_tree_html);      
	});
})( jQuery );
