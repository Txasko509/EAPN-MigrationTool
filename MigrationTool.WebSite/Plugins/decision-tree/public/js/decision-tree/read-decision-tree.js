/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function($) {
    
    'use strict';
    
    $.extend( {  
        read_decision_tree: {  
            init: function(id) {                
                $.read_decision_tree.get_decision_tree(id);                  
            },           
            
            bind_event_question_choice: function() {        
                $('.question-choice').click( function() {
                    var gotoItemId = $(this).attr('data-goto-id');
                    
                    var item = Enumerable.from($.decision_tree_api.DecisionTree.items).firstOrDefault(i => i.id === parseInt(gotoItemId));                    
                    if(item !== null && item !== 'undefined'){
                        showItem(item);
                    }
                });
            },       
            
            bind_event_restart_decision_tree: function() {                   
                $('.link-restart-decision-tree').click( function() {
                    showDecisionTree($.decision_tree_api.DecisionTree);                
                });                         
            },

            get_decision_tree: function(id) {  
                $.ajax( {
                    url: $.decision_tree_api.get_rest_api().ajax_url,
                    data: { 
                        action: $.decision_tree_api.get_rest_api().actions.get_decision_tree,
                        id: id
                    },
                    type: 'GET'
                }).done( function ( response ) {
                    var decisionTree = $.parseJSON(response);

                    $.decision_tree_api.DecisionTree = decisionTree;
                    
                    showDecisionTree(decisionTree);
                });
            },
            
            DecisionTree: {}
        }    
    });     
    
    function showDecisionTree(decisionTree){        
        $.decision_tree_api.set_content(getHtmlDecisionTree(decisionTree));

        // Bind event questio choice
        $.read_decision_tree.bind_event_question_choice();
    }
       
    function getHtmlDecisionTree(decisionTree){
        var decision_tree_html = "";
        
        var question = Enumerable.from(decisionTree.items).
                firstOrDefault(i => i.$type === 'question');
        
        if(question){
            decision_tree_html += "<h2 class=\"question\">" + question.text + "</h2>";
            
            decision_tree_html += "<div class=\"container text-center\">"
                        + "<div class=\"row\">" 
            
            $.each(question.choices, function(index, choice) {                
                decision_tree_html += 
                        "<div class=\"d-grid gap-2 col\">"
                            + "<button type=\"button\" class=\"btn btn-primary btn-lg question-choice\" data-goto-id=\"" + choice.gotoItemId + "\">" + choice.text  +"</button>"
                        + "</div>";
                       
                    
//                    "<div class=\"radio\">" 
//                        + "<label>"    
//                            + "<input class=\"question-choice\" data-goto-id=\"" + choice.gotoItemId + "\" type=\"radio\" name=\"" + "question-" + question.id + "\" value=\"" + choice.id + "\">"
//                            + choice.text   
//                        + "</label>"
//                    + "</div>";
                                        
            });
            
            decision_tree_html += 
                    "</div>"
                "</div>";
        }  
        
        return decision_tree_html;  
    };
    
    function showItem(item){
        // set html item content
        $.decision_tree_api.set_content(getHtmlItem(item));

        // Bind event restart decision tree
        $.read_decision_tree.bind_event_restart_decision_tree();
    }
    
    function getHtmlItem(item){
        var item_html = "";
        
        item_html += "<p class=\"item\">" + item.text + "</p>";
        
        item_html += "<div class=\"btn-group pull-left\" role=\"group\" aria-label=\"...\"><a class=\"link-restart-decision-tree\" href=\"javascript:void(0)\">Volver a iniciar questionario</a></div></br>";

        return item_html;  
    };

})( jQuery );

function WrapperDecisionTree(api) {
  this.api = api;
}

var wrapper_decision_tree = new WrapperDecisionTree($.read_decision_tree);


