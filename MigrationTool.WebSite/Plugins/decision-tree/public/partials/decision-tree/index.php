<?php
    extract(shortcode_atts(array('id' => ''), $atts));
?>

<!-- our app will be injected here -->
<div id="decision-tree-<?php echo $id ?>"></div>
    
<!-- Inicializar pantalla -->
<script type="text/javascript">
    $(document).ready(function(){                
        // Inicializar pantalla
        wrapper_decision_tree.api.init(<?php echo $id ?>);
    }); 
</script>