;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {
	'use strict';
	
	var defaults = {
		'url' 				: '',	
		'width' 			: 'auto',
		'minChars' 			: 2,					
		'maxHeight' 		: 200,
		'params' 			: {},
		'dataType' 			: 'json',
		'zIndex' 			: 9999,
		'type' 				: 'POST',
		'timeout'       	: 10000,
		'cache' 			: false,
		'intervalTimer'		: 300, // tempo de intervalo ao digitar
		
		// CALLBACKS
		onSelectItem: function() {} // function (elemento, data) {}		
	};
	
    $.fn.autocomplete = function(options) {
		
		var countInstancias = this.length; // total de instÃ¢ncias do plugin		
		if(countInstancias == 0) return this;
		// suporte para multiplas instÃ¢ncias
		if(countInstancias > 1){
			this.each(function(){$(this).autocomplete(options)});
			return this;
		}
		
		var autocomplete 	    = {};   // cria uma variavel para ser usada no plugin		
		var el 				    = this; // elemento instanciado
		autocomplete.el 	    = this; // cria uma referência para o elemento instanciado para ser acessado dentro das funções
		autocomplete.identTimer;		// identificador do timer

		autocomplete.keys = {
            ESC:    27,
            TAB:    9,
            RETURN: 13,
            UP:     38,
            DOWN:   40
        };
		
		var init = function(){			
			autocomplete.settings 		= $.extend({}, defaults, options);
			autocomplete.offsetLeft 	= autocomplete.el.offset().left;
			autocomplete.offsetBottom 	= autocomplete.el.outerHeight();
			autocomplete.height 		= autocomplete.el.outerHeight();
			autocomplete.width 			= (autocomplete.settings.width == 'auto' ? (autocomplete.el.outerWidth()+autocomplete.height) : autocomplete.settings.width);
			autocomplete.classref 		= 'class_'+Math.random().toString(36).slice(-8);			
			autocomplete.indexSelected	= -1;
			setup(); // executa todas modificações no DOM
		}
		
		var setup = function(){
			console.log(autocomplete.width);
			autocomplete.el.attr('autocomplete', 'off');
			autocomplete.el.addClass(autocomplete.classref);
			autocomplete.el.wrap('<div class="fn_autocomplete '+autocomplete.classref+'" />');
			autocomplete.el.css('padding-right', autocomplete.height);
			autocomplete.bloco = $('div.'+autocomplete.classref);
			autocomplete.bloco.width(autocomplete.width);
			autocomplete.bloco.append('<div class="fn_indicator"><span class="fn_icon fn_icon_search"></span></div><ul></ul>');
			autocomplete.indicator = autocomplete.bloco.find('.fn_indicator');
			autocomplete.indicator.css({ 
				'width': autocomplete.height+'px', 
				'height': autocomplete.height+'px'
			});
			autocomplete.lista = autocomplete.bloco.find('ul');
			autocomplete.countItens = -1;
			autocomplete.lista.css({ 
				'width': autocomplete.width, 
				'maxHeight': autocomplete.settings.maxHeight,
				'top': autocomplete.offsetBottom,
				'zIndex' : autocomplete.settings.zIndex
			});			
			events();			
		}
		
		var events = function() {			
			autocomplete.el.on('keyup', function (event) { keyUp($(this), event); });
			autocomplete.el.on('keypress', function (event) { keyPress(event); });
			autocomplete.el.on('keydown', function (event) { keyDown(event); });
			autocomplete.lista.on('click', 'li', function () { selectItem($(this).index()); });            
		}

		var setPositionList = function() {
			autocomplete.offsetBottom = autocomplete.height;
			autocomplete.lista.css({
				'top': autocomplete.offsetBottom
			});
		}
		
		var cleanList = function() {
			autocomplete.lista.find('li').removeClass('active');
			autocomplete.lista.html('').hide();
			autocomplete.indexSelected = -1;
		}

		var startLoader = function() {
			autocomplete.indicator.find('span').removeClass('fn_icon_search').addClass('fn_icon_spinner fn_animated');
		}

		var stopLoader = function() {			
			autocomplete.indicator.find('span').removeClass('fn_icon_spinner fn_animated').addClass('fn_icon_search');
		}
		
		var keyUp = function(obj, e) {
			var code = e.keyCode || e.which;
			var index = parseInt(autocomplete.indexSelected);

			switch (code) {
                case autocomplete.keys.ESC:
                    cleanList();
                    break;
				
				case autocomplete.keys.TAB:
                    if (index >= 0)
                    	selectItem(index);
                    return;

                case autocomplete.keys.RETURN:
                	if (index >= 0 )
                    	selectItem(index);					
                    return;

                case autocomplete.keys.UP:
                	if ((index-1) >= 0)
                    	setItemActive(index-1);
                    break;

                case autocomplete.keys.DOWN:
                	if ((index+1) >= 0 && (index+1) < autocomplete.countItens)
                    	setItemActive(index+1);
                    break;

				default:
					if (obj.val().length >= autocomplete.settings.minChars) {
						clearTimeout(autocomplete.identTimer);
		                autocomplete.identTimer = setTimeout(ajaxRequest, autocomplete.settings.intervalTimer);
					} else {
						cleanList();
					}
                    return;
            }
            e.stopImmediatePropagation();
            e.preventDefault();
		}
		
		var keyPress = function(e) {
			var code = e.keyCode || e.which;
			if(code == autocomplete.keys.RETURN)
				e.preventDefault();
		}
		
		var keyDown = function(e) {
			var code = e.keyCode || e.which;
			var index = parseInt(autocomplete.indexSelected);
			if (code == autocomplete.keys.TAB) {
				if (index >= 0)
                    selectItem(index); 
			} 
		}

		var ajaxRequest = function() {
			if (autocomplete.request) {
				autocomplete.request.abort();
				//cleanList();
			}
			startLoader();
			autocomplete.settings.params.q = autocomplete.el.val(); // variavel 'q' = value do input
			autocomplete.request = $.ajax({
				type: autocomplete.settings.type,					
				cache: autocomplete.settings.cache,
				url: autocomplete.settings.url,
				data: autocomplete.settings.params,
				dataType: autocomplete.settings.dataType,
				timeout: autocomplete.settings.timeout,
			}).done(function (data) {
				autocomplete.request.abort();
				if(JSON.stringify(data) != 'null' && JSON.stringify(data) != '[]' && JSON.stringify(data) != '') {
					populateList(data);
					autocomplete.lista.show();
				}
			    stopLoader();
			}).fail(function (jqXHR, textStatus, errorThrown) {
			    stopLoader();
				console.log('Erro: '+textStatus);
			});
		}

		var selectItem = function(index) {
			var obj = autocomplete.lista.find('li:eq('+index+')');
			autocomplete.el.val(obj.text());			
			cleanList();
			return autocomplete.settings.onSelectItem(autocomplete.el, obj.data('data'));
		}

		var setItemActive = function(index) {
			autocomplete.lista.find('li').removeClass('active');
			autocomplete.lista.find('li:eq('+index+')').addClass('active');
			autocomplete.indexSelected = index;
		}
		
		var populateList = function(data) {
			cleanList();
			setPositionList();
			$.each(data,function(i, val){
				var value = val['item'];
				var datas = JSON.stringify(val['dados']);
				autocomplete.lista.append('<li data-data=\''+datas+'\'>'+value+'</li>');
			});
			autocomplete.lista.show();
			autocomplete.countItens = autocomplete.lista.find('li').length;
			setItemActive(0);
		}

		$('html:not(.fn_autocomplete)').click(function(){
			if($('.fn_autocomplete ul').is(':visible')){
				$('.fn_autocomplete ul').hide();
				cleanList();
			}
		});
		
		init();
				
		return this;
    };
	
}));