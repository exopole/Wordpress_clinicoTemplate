var dept_data = [];

function cws_shortcode_init() {
	var $=jQuery;
	var dept_select = $('select#cws-mb-dept\\[\\]');
	var dept_open = $('select#cws-mb-deptopen\\[\\]');
	var dept_len = dept_open.length;

	$(document).ready(function() {
		if (dept_open.length) {
			for (var i=0; i < dept_open[0].length; i++) {
				var el = new Object();
				el.id = dept_open[0].options[i].value;
				el.text = dept_open[0].options[i].text;
				dept_data.push(el);
				delete el;
			}
		}

		$("#TB_window select[id^=cws-mb]").each( function() {
			var lastchars = this.name.substr(-3);
			if ('-fa' === lastchars) {
				$(this).select2({
					formatResult: fa_format,
					formatSelection: fa_format,
					triggerChange: true,
					allowClear: true,
					escapeMarkup: function(m) { return m; }
				});
			}
			else {
				$(this).select2();
			}
		});

		$("#TB_window input[data-default-color]").each(function(){
			$(this).wpColorPicker();
		});

		dept_select.on('select2-removing', function(e) {
			for (var i = 0; i < dept_open[0].length; i++) {
				if (dept_open[0].options[i].value == e.val)
				{
					dept_open[0].options[i].selected = false;
					var data_arr = dept_open.select2("data");
					for (var j=0; j<data_arr.length; j++) {
						if (data_arr[j].id == e.val) {
							data_arr.splice(j, 1); // because of first empty value
							break;
						}
					}
					dept_open.select2("data", data_arr);
					dept_open[0].remove(i);
					break;
				}
			}
			// now check if dept_select is about to become empty and
			// fill dept_open withh all the data in this case
			var selected_count = 0;
			for (i = 0; i < dept_select[0].length; i++) {
				selected_count += dept_select[0].options[i].selected ? 1 : 0;
			}
			if (selected_count == 1) {
				// load with inital data
				for (i = 0; i < dept_data.length; i++) {
					var opt = document.createElement('option');
					opt.value = dept_data[i].id;
					opt.innerHTML = dept_data[i].text;
					dept_open[0].appendChild(opt);
				}
			}
		});

		dept_select.on('select2-selecting', function(e) {
			var selected_count = 0;
			for (i = 0; i < dept_select[0].length; i++) {
				selected_count += dept_select[0].options[i].selected ? 1 : 0;
			}
			if (!selected_count) {
				//dept_open.select2("data", null);
				dept_open.empty();
			}
			var opt = document.createElement('option');
			opt.value = e.object.id;
			opt.innerHTML = e.object.text;
			dept_open[0].appendChild(opt);
		});

		$("#TB_window select[id^=cws-mb]").each( function() {
			var lastchars = this.name.substr(-3);
			if (!jQuery(this).hasClass('select2-offscreen')) {
				if ('-fa' === lastchars) {
					$(this).select2({
						formatResult: fa_format,
						formatSelection: fa_format,
						triggerChange: true,
						allowClear: true,
						escapeMarkup: function(m) { return m; }
					});
				}	else {
					$(this).select2();
				}
			}
		});

		$("#TB_window input[data-default-color]").each(function(){
			$(this).wpColorPicker();
		});

	});

	function fa_format (icon) {
		if ( icon.hasOwnProperty( 'id' ) && icon.id.length > 0 ) {
			return "<span><i class='" + icon.id + "'></i>" + "&nbsp;&nbsp;" + icon.text.toUpperCase() + "</span>";
		} else {
			return icon.text;
		}
	}

	if ($("#cws-mb-fa").length) {
		$(document).ready(function() {
			var sel = "";
			var fa_options = new DOMParser().parseFromString(window.cwsfa, "text/html");
			$("#cws-mb-fa").append( fa_options.documentElement.textContent );
		});
	}

	$('#cws_insert_button').click( function() {
		var code_start='';
		var code_end='';

		var type = $('#cws-shortcode-type').val();
		var selection = decodeURIComponent( $('#cws-shortcode-selection').val() );

		switch (type) {
			case 'services':
				var atts = {};
				atts['filter'] = $('#cws-mb-dept\\[\\]').val();
				atts['open'] = $('#cws-mb-deptopen\\[\\]').val();
				code_start = '[services' + print_shortcode_atts(atts) + ' /]';
				break
			case 'quote':
				var atts = {};
				atts['photo'] = $('#img-cws-mb-photo').attr("src");
				atts['author'] = $('#cws-mb-author').val();
				var text = $('#cws-mb-text').val();
				code_start = "";
				if (text.length){
					code_start += '[quote ' + print_shortcode_atts( atts ) + ']' + text + '[/quote]';
				}
			break
			case 'embed':
				var atts = {};
				var url = $('#cws-mb-url').val();
				atts['width'] = $('#cws-mb-width').val();
				atts['height'] = $('#cws-mb-height').val();
				code_start = '[embed ' + print_shortcode_atts( atts ) + ']' + url + '[/embed]';
			break
			case 'progress':
				var atts = {};
				atts['title'] = $('#cws-mb-title').val();
				atts['progress'] = $('#cws-mb-progress').val();
				atts['color'] = $('#cws-mb-color').val();
				var shortcode_atts = print_shortcode_atts( atts );
				code_start = shortcode_atts.length ? '[progress ' + shortcode_atts + ' /]' : '';
			break
			case 'milestone':
				var atts = {};
				atts['fa'] = $('#cws-mb-fa').val();
				atts['number'] = $('#cws-mb-number').val();
				var text = $('#cws-mb-text').val()
				var shortcode_atts = print_shortcode_atts( atts );
				code_start = shortcode_atts.length ? '[milestone ' + shortcode_atts + ' ]' + text + '[/milestone]' : '';
			break
			case 'alert':
				var text = $('#cws-mb-text').val();
				var title = $('#cws-mb-title').val();
				var type = $('#cws-mb-type').val();
				var grey_skin = $('input[name=cws-mb-grey_skin').is(":checked") ? " grey_skin=1" : "";
				code_start = '[alert type="' + type + '" title="' + title + '"' + grey_skin + ' ]' + text + '[/alert]';
			break
			case 'fa':
				var fa = $('#cws-mb-fa').val();
				if (!fa) break;
				var size = $('#cws-mb-size').val();
				var custom = $('[name="cws-mb-custom_color"]').is(":checked");
				var color = $('#cws-mb-color').val();
				var bg_color = $('#cws-mb-bg_color').val();
				var border_color = $('#cws-mb-border_color').val();
				var custom_color_args = custom ? " custom_color=1 color=" + color + " bg_color=" + bg_color + " border_color=" + border_color : '';
				code_start = '[fa code="' + fa + '" size=' + size + custom_color_args + ' /]';
			break
			case 'featured_fa':
				var fa = $('#cws-mb-fa').val();
				if (!fa) break;
				var atts = {};
				atts['code'] = fa;
				atts['size'] = $('#cws-mb-size').val();
				atts['type'] = $('input[name="cws-mb-type"]:checked').val();
				atts['float'] = $('input[name="cws-mb-float"]:checked').val();
				var custom = $('[name="cws-mb-custom_color"]').is(":checked");
				var color = $('#cws-mb-color').val();
				var bg_color = $('#cws-mb-bg_color').val();
				if (custom)	{
					atts = jQuery.extend(atts, {custom_color:'1', color: color, bg_color: bg_color});
				}
				code_start = '[featured_fa ' + print_shortcode_atts(atts) + ' /]';
			break
			case 'mark':
				var atts = {};
				atts['color'] = $('#cws-mb-color').val();
				atts['bg_color'] = $('#cws-mb-bgcolor').val();
				code_start = '[mark ' + print_shortcode_atts(atts) + ' ]' + selection + '[/mark]';
			break
			case 'price-table':
				var atts = {};
				atts['order'] = $('input[name=cws-mb-order]:checked').val();
				atts['cat'] = $('#cws-mb-cat').val();
				atts['orderby'] = $('#cws-mb-orderby').val();
				atts['posts'] = $('#cws-mb-posts').val();
				atts['columns'] = $('#cws-mb-columns').val();
				code_start = '[price-table ' + print_shortcode_atts( atts ) + ' /]';
			break
			case 'ourteam':
				var atts = {};
				atts['title'] = $('#cws-mb-title').val();
				atts['cats'] = '';
				atts['usefilter'] = $('input[name=cws-mb-filtering]').is(':checked') ? '1' : '';
				var fcats = $('#cws-mb-cat\\[\\]').val()
				if (undefined !== fcats && null !== fcats) {
					atts['cats'] = $('#cws-mb-cat\\[\\]').val();
				}
				atts['mode'] = $('input[name=cws-mb-mode]:checked').val();
				code_start = '[ourteam ' + print_shortcode_atts(atts) + ' /]';
			break
			case 'portfolio':
				var atts = {};
				atts['cols'] = $('#cws-mb-cols').val();
				atts['cats'] = '';
				var fcats = $('#cws-mb-cat\\[\\]').val()
				if (undefined !== fcats && null !== fcats) {
					atts['cats'] = $('#cws-mb-cat\\[\\]').val();
				}
				atts['usecarousel'] = $('input[name=cws-mb-usecarousel]').is(':checked') ? '1' : '';
				atts['title'] = $('input[name=cws-mb-title]').val();
				atts['usefilter'] = $('input[name=cws-mb-filtering]').is(':checked') ? '1' : '';
				atts['postspp'] = $('#cws-mb-posts').val();
				code_start = "[portfolio " + print_shortcode_atts(atts) + " /]";
			break
			case 'tweets':
				var title = $('#cws-mb-title').val();
				var num = $('#cws-mb-num').val();
				var num_vis = $('#cws-mb-num_vis').val();
				code_start = '[twitter tweets=' + num + ' visible=' + num_vis + ' title="' + title + '"/]';
			break
			case 'cws_cta':
				var atts = {};
				atts['icon'] = $('#cws-mb-fa').val();
				atts['title'] = $('#cws-mb-title').val();
				atts['button_text'] = $('#cws-mb-button_text').val();
				atts['link'] = $('#cws-mb-link').val();
				var text = $('#cws-mb-text').val();
				code_start = '[cws_cta ' + print_shortcode_atts( atts ) + ']' + text + '[/cws_cta]';
			break
			case 'cws_button':
				var type = $('#cws-mb-type').val();
				var size = $('#cws-mb-size').val();
				var text = $('#cws-mb-text').val();
				var link = $('#cws-mb-link').val();
				var custom_color = $('[name=\'cws-mb-custom_color\']').is(':checked');
				var button_color = $('#cws-mb-button_color').val();
				var text_color = $('#cws-mb-text_color').val();
				var border_color = $('#cws-mb-border_color').val();
				code_start = '[cws_button type=' + type + ' size=' + size + ' link=' + link + ' ';
				if (custom_color){
					code_start += 'custom_color=1 button_color=' + button_color + ' text_color=' + text_color + ' border_color=' + border_color + ' '
				}
				code_start += ']' + text + '[/cws_button]'
			break
			case 'shortcode_blog':
				var atts = {};
				atts['title'] = $('#cws-mb-title').val();
				atts['post_count'] = $('#cws-mb-post_count').val();
				atts['columns'] = $('#cws-mb-columns').val();
				atts['cats'] = '';
				var fcats = $('#cws-mb-cat\\[\\]').val()
				if (undefined !== fcats && null !== fcats) {
					atts['cats'] = $('#cws-mb-cat\\[\\]').val();
				}
				code_start += "[shortcode_blog " + print_shortcode_atts( atts ) + " /]";
			break
			case 'shortcode_carousel':
				var title = $('#cws-mb-title').val();
				var autop_speed = $('#cws-mb-autop_speed').val();
				var autop = $('input[name=cws-mb-autop').is(":checked") ? " autoplay=1 autop_speed=" + autop_speed : "";
				code_start += "[shortcode_carousel" + ( title ? " title='" + title + "'" : "") + autop + "]" + selection + "[/shortcode_carousel]"
			break
		}
		if(window.tinyMCE) {
			window.tinyMCE.activeEditor.selection.setContent(code_start + code_end);
			if ( jQuery(this).is_cws_tb_modal() ){
				jQuery(this).cws_tb_modal_close();
			}
			else{
				tb_remove();
			}
		}

		return false;
	});
}

function print_shortcode_atts(atts){
	out = "";
	jQuery.each( atts, function ( index, value ){
		out += print_shortcode_attr( index, value );
	});
	return out;
}

function print_shortcode_attr (name,value){
	if (value) return " " + name + "='" + value + "'";
	else return "";
}
