<?php 
/*
Element Description: Print staff member
*/
 
// Element Class 
class vcInfoBox extends WPBakeryShortCode {
     
    // Element Init
    function __construct() {
        add_action( 'init', array( $this, 'vc_staff_Phaet_mapping' ) );
        add_shortcode( 'vc_staff_Phaet', array( $this, 'vc_staff_Phaet_html' ) );
    }
     
    // Element Mapping
    public function vc_staff_Phaet_mapping() {
         
         // Stop all if VC is not enabled
        if ( !defined( 'WPB_VC_VERSION' ) ) {
                return;
        }
             
        // Map the block with vc_map()
        vc_map( 
      
            array(
                'name' => __('VC Staff Phaet', 'text-domain'),
                'base' => 'vc_staff_Phaet',
                'description' => __('Another simple VC box', 'text-domain'), 
                'category' => __('My Custom Elements', 'text-domain'),   
                'icon' => get_template_directory_uri().'/assets/img/vc-icon.png',            
                'params' => array(   
                          
                    array(
                        'type' => 'textfield',
                        'holder' => 'h3',
                        'class' => 'title-class',
                        'heading' => __( 'Title', 'text-domain' ),
                        'param_name' => 'title',
                        'value' => __( 'Default value', 'text-domain' ),
                        'description' => __( 'Box Title', 'text-domain' ),
                        'admin_label' => false,
                        'weight' => 0,
                        'group' => 'Custom Group',
                    ),  
                      
                    array(
                        'type' => 'textarea',
                        'holder' => 'div',
                        'class' => 'text-class',
                        'heading' => __( 'Text', 'text-domain' ),
                        'param_name' => 'text',
                        'value' => __( 'Default value', 'text-domain' ),
                        'description' => __( 'Box Text', 'text-domain' ),
                        'admin_label' => false,
                        'weight' => 0,
                        'group' => 'Custom Group',
                    )                   
                         
                )
            )
        );                                              
        
    } 
    
     
    // Element HTML
    public function vc_staff_Phaet_html( $atts ) {
         
        //.. the Code is in the next steps ..//
          // Params extraction
        extract(
            shortcode_atts(
                array(
                    'title'   => '',
                    'text' => '',
                ), 
                $atts
            )
        );
         /*$html = '
        <div class="vc-infobox-wrap">
         
            <h2 class="vc-infobox-title">' . $title . '</h2>
             
            <div class="vc-infobox-text">' . $text . '</div>
         
        </div>


        ';  
*/
         $args = array('post_type' => 'staff',
                        'post_status' => 'publish',
                        'ignore_sticky_posts' => false);

        $r = new WP_Query($args);
        // Fill $html var with data

        $style_title = "font-weight: bold;font-size: large;";
        $style_subtitle = "font-style: italic;";
            

        if ($r->have_posts()){ 
            $html .= "<div>";
            if ($r->have_posts()){
                $i = 0;
                while ($r->have_posts()):
                    
                    if($i === 0){

                        $html .="<div class='vc_row wpb_row vc_inner vc_row-fluid'>";
                    }
                    $html .= "<div class='wpb_column vc_column_container vc_col-sm-4'>";
                    $html .= "<div class=' phaet_card'>";
                    $r->the_post();
                    $curr_post = $r->posts[$r->current_post];
                    $cws_stored_meta = get_post_meta( $curr_post->ID, 'cws-staff');
                    $occupation = $cws_stored_meta[0]['cws-staff-degree'];

                    $thumbnail = has_post_thumbnail( $post->ID ) ? wp_get_attachment_image_src(get_post_thumbnail_id( $post->ID )) : null;
                    $thumbnail = $thumbnail ? $thumbnail[0] : null;
                    $html .= $thumbnail ? "<img class='phaet_pic_card'src='$thumbnail'/> ": "";
                    
                    $title = get_the_title();
                    $html .= "<div class='phaet_container'>";
                    $html .=  $title ? "<div style='".$style_title ."'>" . $title . "</div>" : "";
                    $html .=  $occupation ? "<div style='".$style_subtitle ."'>" . $occupation . "</div>" : "";
                    
                    if(get_post() != ''){
                         $html .=" <a href='" . get_the_permalink() . "' class='more'></a>";
                    }


                    $html .= "</div>";// <div class='container'>
                    $html .= "</div>";// <div class='wpb_column vc_column_container vc_col-sm-3'>
                    $html .= "</div>"; //<div class='vc_column-inner '>

                    $i++;
                    if($i === 3){
                        $i = 0;
                        $html .= "</div>"; //<div class='vc_row wpb_row vc_inner vc_row-fluid'>
                    }
                endwhile;
            }
            if($i !== 0){
                $html .= "</div>"; //<div class='vc_row wpb_row vc_inner vc_row-fluid'>
            }
            $html .= "</div>";

         }
         
        return $html;
         
    } 
     
} // End Element Class
 
// Element Class Init
new vcInfoBox(); 