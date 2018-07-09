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
             
        $categories_array = array();
       $categories = get_terms('cws-staff-dept');
       foreach( $categories as $category ){
          $categories_array[$category->name] =  $category->term_id;
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
                    ),  
                       
                    array(
                      "type" => "checkbox",
                      "class" => "",
                      "heading" => __( "Département à afficher", "my-text-domain" ),
                      "param_name" => "department",
                      "value"       => $categories_array,
                      "description" => __( ".", "my-text-domain" ),

                    ),

                        
                         
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
                    'department' => '',
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
                        'ignore_sticky_posts' => false, 
                        'tax_query' => array(
                    array(
                        'taxonomy' => 'cws-staff-dept',
                        'field'    => 'term_id',
                        'terms'    => array( $department ),
                    ),
                ),
        );
        $r = new WP_Query($args);
        // Fill $html var with data

        $style_title = "font-weight: bold;font-size: large;";
        $style_subtitle = "font-style: italic;";
        $arrayValue = array();
        if ($r->have_posts()){ 
            $html .= "<div>";
            if ($r->have_posts()){
                $i = 0;
                while ($r->have_posts()):
                    $r->the_post();
                    $curr_post = $r->posts[$r->current_post];

                    $title = get_the_title();

                    $cws_stored_meta = get_post_meta( $curr_post->ID, 'cws-staff');
                    $occupation = $cws_stored_meta[0]['cws-staff-degree'];
                    $resume = $cws_stored_meta[0]['cws-staff-resume'];

                    $thumbnail = has_post_thumbnail( $post->ID ) ? wp_get_attachment_image_src(get_post_thumbnail_id( $post->ID )) : null;
                    $thumbnail = $thumbnail ? $thumbnail[0] : null;

                    $arrayValue[]["name"] = $title;
                    $index = count($arrayValue) - 1;
                    $arrayValue[$index]["link"] = get_the_permalink();
                    $arrayValue[$index]["occupation"] = $occupation;
                    $arrayValue[$index]["resume"]= $resume;
                    $arrayValue[$index]["image"] = $thumbnail;

                    if($i === 0){

                        $html .="<div class='vc_row wpb_row vc_inner vc_row-fluid'>";
                    }
                    $html .= "<div class='wpb_column vc_column_container vc_col-sm-4'>";
                    $html .= "<a href=". get_the_permalink()."><div class=' phaet_card' onclick='phaet_our_team()'>";
                    
                    
                    
                    
                    $html .= $thumbnail ? "<img class='phaet_pic_card'src='$thumbnail'/> ": "";
                    
                    $html .= "<div class='phaet_container'>";
                    $html .=  $title ? "<div style='".$style_title ."'>" . $title . "</div>" : "";
                    $html .=  $occupation ? "<div style='".$style_subtitle ."'>" . $occupation . "</div>" : "";
                    //$html .=  $resume ? "<div style='".$style_subtitle ."'>" . $resume . "</div>" : "";
                    


                    $html .= "</div> ";// <div class='container'>
                    $html .= "</div></a>";// <div class='wpb_column vc_column_container vc_col-sm-3'>
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

        // $html .=var_dump($arrayValue);
         $html .='<div id="phaet_team">' ;
         foreach ($arrayValue as $key => $value) {
             $html.=$this->printTeam($value);
         }
         $html .='</div>';
        return $html;
         
    } 

    public function coucou(){return "coucou";}
    public function printTeam($informations){
        $html = 
        '
        
            <a href="'.$informations["link"] .'">
                <div class="phaet_card">
                    <img class="phaet_pic_card"src='.$informations["image"].' />
                    <div class="phaet_container">
                        <div style="font-weight: bold;font-size: large;">
                            '.$informations["name"]  .'
                        </div>
                        <div style="font-style: italic">
                            '.$informations["occupation"].'
                        </div>
                        
                    </div>
                </div>
            </a>
        '; 
        //return $informations["name"] . $informations["image"] . $informations["occupation"] . $informations["resume"] . $informations["link"];
        return $html;
    }
     
} // End Element Class
 


// Element Class Init
new vcInfoBox(); 