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
                $.decision_tree_api.init(id);
                
                $.read_decision_tree.get_decision_tree(id);                  
            },           
            
            bind_event_question_choice: function() {        
                $('.question-choice').click( function() {                   
                    var decisionTreeId = $(this).attr('data-decision-tree-id');
                    
                    // Get DecisionTree
                    var decisionTree = Enumerable.from($.read_decision_tree.DecisionTrees).firstOrDefault(d => d.id === parseInt(decisionTreeId));     
                    
                    if(decisionTree !== undefined && decisionTree !== null){
                        var gotoItemId = $(this).attr('data-goto-id');
                         
                        var item = Enumerable.from(decisionTree.items).firstOrDefault(i => i.id === parseInt(gotoItemId));                    
                        if(item !== null && item !== 'undefined'){
                            showItem(item, decisionTreeId);
                        }
                    }                   
                });
            },       
            
            bind_event_restart_decision_tree: function() {                   
                $('.link-restart-decision-tree').click( function() {
                    var decisionTreeId = $(this).attr('data-decision-tree-id');
                    
                    // Get DecisionTree
                    var decisionTree = Enumerable.from($.read_decision_tree.DecisionTrees).firstOrDefault(d => d.id === parseInt(decisionTreeId));  
                    
                    if(decisionTree !== undefined && decisionTree !== null){
                        showDecisionTree(decisionTree);  
                    }                                  
                });                         
            },

            get_decision_tree: function(id) {  
                var spinner = $('.spinner');
                spinner.preloader();
                
                var self = this;
                $.ajax( {
                    url: $.decision_tree_api.get_rest_api().ajax_url,
                    data: { 
                        action: $.decision_tree_api.get_rest_api().actions.get_decision_tree,
                        id: id
                    },
                    type: 'GET',
                    context: this
                }).done( function(response) {
                    spinner.preloader('remove');
                    
                    var idRef = id;
                    var decisionTree = $.parseJSON(response);
                    
                    if(decisionTree === null){
                        $.decision_tree_api.set_content("<span>El árbol de decisión no se encuentra disponible</span>", idRef);
                        
                        return;
                    }
                    
                    $.read_decision_tree.DecisionTrees.push(decisionTree);
                    
                    showDecisionTree(decisionTree);
                });
            },
            
            DecisionTrees: []
        }    
    }); 
    
    function callbackClosure(i, callback) {
        return function() {
          return callback(i);
        }
    }
    
    function showDecisionTree(decisionTree){       
        $.decision_tree_api.set_content(getHtmlDecisionTree(decisionTree), decisionTree.id);

        // Bind event questio choice
        $.read_decision_tree.bind_event_question_choice();
    }
       
    function getHtmlDecisionTree(decisionTree){
        var decision_tree_html = "";

        var question = Enumerable.from(decisionTree.items).
                firstOrDefault(i => i.$type === 'question');
        
        if(question){
            decision_tree_html += getHtmlItem(question);
        }  
        
        return decision_tree_html;  
    };
    
    function showItem(item, decisionTreeId){
        // set html item content
        $.decision_tree_api.set_content(getHtmlItem(item, decisionTreeId), decisionTreeId);
        
        // Bind event questio choice
        $.read_decision_tree.bind_event_question_choice();

        // Bind event restart decision tree
        $.read_decision_tree.bind_event_restart_decision_tree();
    }
    
    function getHtmlQuestion(question){
        var question_html = "";
            
        question_html += "<div class=\"container text-center\">"
                    + "<div class=\"row\">";

        //$.each(question.choices, function(index, choice) { 
        $.each(question.choices.sort(function(a, b) {return a.order > b.order;}), function(index, choice) {                       
            question_html += 
                    "<div class=\"d-grid gap-2 col\">" + 
                        "<button type=\"button\" class=\"btn btn-primary btn-lg question-choice\" \n\
                            data-goto-id=\"" + choice.gotoItemId + "\" data-decision-tree-id=\"" + question.decisionTreeId + "\">" + choice.text  +
                        "</button>"
                    + "</div>";
        });
            
        question_html += 
                "</div>"
            + "</div>";
                
        return question_html;
    };
    
    function getHtmlItem(item, decisionTreeId){
        var item_html = "";
        
        // Text
        item_html += "<div class=\"" + (item.$type === 'question' ? 'question accent' : 'item') + "\">" + item.text + "</div>";
        
        // SubText
        if(item.subText){
            item_html += "<div class=\"subtext\">" + item.subText + "</div>";
        }
                
        if(item.$type === 'question'){            
            item_html += getHtmlQuestion(item);
        }
        else{
            item_html += getHtmlAnswer(item);
        }
        
        if(item.order > 0){
            item_html += "<div class=\"btn-group pull-left\" role=\"group\" aria-label=\"...\"><a class=\"link-restart-decision-tree\" href=\"javascript:void(0)\" data-decision-tree-id=\"" + decisionTreeId + "\">Volver a iniciar cuestionario</a></div></br>";
        }
        return item_html;  
    };
    
    function getHtmlAnswer(answer){
        var answer_html = "";
        if(answer.textLink){
            answer_html += "<a target=\"_blank\" href=\"" + answer.textLink + "\">" + answer.textLink + "</a></br>";
        }
        
        if(answer.info){
            answer_html += "<span class=\"info\">(" + answer.info + ")</span></br></br>";
        }
        
        return answer_html;
    };

})( jQuery );

function WrapperDecisionTree(api) {
  this.api = api;
}

var wrapper_decision_tree = new WrapperDecisionTree($.read_decision_tree);


