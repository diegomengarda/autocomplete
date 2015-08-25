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
		'url' 			    : '',	
		'width' 		    : 'auto',
		'minChars' 		    : 2,					
		'listMaxHeight' 	: 200,
		'params' 		    : {},
		'dataType' 		    : 'json',
		'zIndex' 		    : 9999,
		'type' 			    : 'POST',
		'timeout'           : 10000,
		'cache' 		    : false,
		'debug' 		    : false,
		
		// CALLBACKS
		onSelectItem: function() {} // function (elemento, data) {}
	};
	
    $.fn.autocomplete = function(options) {
		
		var countInstancias = this.length; // total de instâncias do plugin		
		if(countInstancias == 0) return this;
		// suporte para multiplas instâncias
		if(countInstancias > 1){
		    this.each(function(){$(this).autocomplete(options)});
			return this;
		}
		
		var autocomplete 	    = {};   // cria uma variavel para ser usada no plugin		
		var el 				    = this; // elemento instanciado
		autocomplete.el 	    = this; // cria uma referência para o elemento instanciado para ser acessado dentro das funções
		var identTimer;                 // identificador do timer
        var intervaloTimer      = 200;  // tempo de intervalo ao digitar

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
			autocomplete.width 			= (autocomplete.settings.width == 'auto' ? (autocomplete.el.outerWidth()+autocomplete.height) : autocomplete.settings.outerWidth)-10;
			autocomplete.classref 		= 'class_'+Math.random().toString(36).slice(-8);			
			autocomplete.indexSelected	= -1;
			setup(); // executa todas modificações no DOM
		}
		
		var setup = function(){
			autocomplete.el.attr('autocomplete', 'off');
			autocomplete.el.addClass(autocomplete.classref);
			autocomplete.el.wrap('<div class="fn_autocomplete '+autocomplete.classref+'" />');
			autocomplete.el.css('padding-right', autocomplete.height);
			autocomplete.bloco = $('div.'+autocomplete.classref);
			autocomplete.bloco.width(autocomplete.width);
			autocomplete.bloco.append('<div class="indicator"><span class="icon icon-search"></span></div><ul></ul>');
			autocomplete.indicator = autocomplete.bloco.find('.indicator');
			autocomplete.indicator.css({ 
				'width': autocomplete.height+'px', 
				'height': autocomplete.height+'px'
			});
			autocomplete.lista = autocomplete.bloco.find('ul');
			autocomplete.countItens = -1;
			autocomplete.lista.css({ 
				'maxHeight': autocomplete.settings.listMaxHeight,
				'top': autocomplete.offsetBottom,
				'zIndex' : autocomplete.settings.zIndex
			});	
			events();			
		}
		
		var events = function() {			
			autocomplete.el.on('keyup', function (event) {
			    var $this = $(this);
			    clearTimeout(identTimer);
                identTimer = setTimeout(function() {
                    keyUp($this, event);
                }, intervaloTimer);			    
			});
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
			autocomplete.indicator.find('span').removeClass('icon-search').addClass('icon-spinner animated');
		}
		var stopLoader = function() {
		    autocomplete.indicator.find('span').removeClass('animated icon-spinner').addClass('icon-search');
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
						ajaxRequest();
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
				cleanList();
			}
			startLoader();
			autocomplete.settings.params.q = autocomplete.el.val(); // variável 'q' = value do input
			autocomplete.request = $.ajax({
				type: autocomplete.settings.type,					
				cache: autocomplete.settings.cache,
				url: autocomplete.settings.url,
				data: autocomplete.settings.params,
				dataType: autocomplete.settings.dataType,
				timeout: autocomplete.settings.timeout
			}).done(function (data) {
				autocomplete.request.abort();
				if(JSON.stringify(data) != 'null' && JSON.stringify(data) != '[]' && JSON.stringify(data) != '') {
					populateList(data);
					autocomplete.lista.show();
				}
			    stopLoader();
			}).fail(function (jqXHR, textStatus, errorThrown) {
			    stopLoader();
			    if(autocomplete.settings.debug) {
					console.log('Erro: '+jqXHR.responseText);
			    }
			});
		}

		var selectItem = function(index) {
			var obj = autocomplete.lista.find('li:eq('+index+')');
			autocomplete.el.val(obj.data('value'));
			cleanList();
			return autocomplete.settings.onSelectItem(autocomplete.el, obj.data('parameters'));
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
				var value = val['value'];
				var parameters = JSON.stringify(val['parameters']);
				var resultado = value.toUpperCase();
				var search = autocomplete.el.val().toUpperCase();
				if(resultado.indexOf(search) != -1) {
				    autocomplete.lista.append('<li data-value=\''+value+'\' data-parameters=\''+parameters+'\'>'+resultado.replace(search, "<u><strong>"+search+"</strong></u>")+'</li>');
				} else {
				    autocomplete.lista.append('<li data-value=\''+value+'\' data-parameters=\''+parameters+'\'>'+resultado.replace(/(<([^>]+)>)/ig,"")+'</li>');
				}
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