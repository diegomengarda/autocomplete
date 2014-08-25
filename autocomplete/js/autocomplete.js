// Expose plugin as an AMD module if AMD loader is present:
;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	'use strict'; 
	
	var defaults = {
		'url' 			: '',	
		'width' 		: 'auto',
		'minChars' 		: 2,					
		'maxHeight' 	: 200,
		'params' 		: {},
		'zIndex' 		: 9999,
		'type' 			: 'POST',
		'cache' 		: false,
		
		// CALLBACKS
		onSelectItem: function() {} // function (elemento, data) {}
		
	};
	
    $.fn.autocomplete = function(options) {
		
		var countInstancias = this.length; // total de instâncias do plugin		
		if(countInstancias == 0) return this;
		// suporte para multiplas instâncias
		if(countInstancias > 1){
			this.each(function(){$(this).larueAutocomplete(options)});
			return this;
		}
		
		var autocomplete 	= {}; // cria uma variavel para ser usada no plugin		
		var el 				= this;
		autocomplete.el 	= this; // cria uma referência para o elemento instanciado
		
		var init = function(){			
			autocomplete.settings 		= $.extend({}, defaults, options);
			autocomplete.width 			= (autocomplete.settings.width == 'auto' ? autocomplete.el.outerWidth() : autocomplete.settings.width);
			autocomplete.offsetLeft 	= autocomplete.el.offset().left;
			autocomplete.offsetBottom 	= autocomplete.el.outerHeight() + autocomplete.el.offset().top;
			autocomplete.idref 			= 'id_'+Math.random().toString(36).slice(-8);
			
			setup(); // executa todas modificações no DOM								
		}
		
		var setup = function(){
			autocomplete.el.attr('autocomplete', 'off');
			autocomplete.el.attr('id', autocomplete.idref);
			$('body').append('<div data-id="'+autocomplete.idref+'" class="fn_autocomplete"><ul></ul></div>');
			autocomplete.bloco = $('div[data-id="'+autocomplete.idref+'"]');
			autocomplete.lista = autocomplete.bloco.find('ul');
			autocomplete.bloco.css({ 
				'width': autocomplete.width, 
				'maxHeight': autocomplete.settings.maxHeight, 
				'left': autocomplete.offsetLeft, 
				'top': autocomplete.offsetBottom,
				'zIndex' : autocomplete.settings.zIndex
			});
			
			events();			
		}
		
		var events = function() {			
			autocomplete.el.on('keyup', function () { keyUp($(this)); });
			autocomplete.lista.on('click', 'li', function () { selectItem($(this)); });
			
			function selectItem(obj) {
				autocomplete.el.val(obj.text());
				cleanList();
				return autocomplete.settings.onSelectItem(autocomplete.el, obj.data('data'));
			}
			
		}
		
		function cleanList() {
			autocomplete.lista.html('');
			autocomplete.bloco.hide();
		}
		
		function keyUp(obj) {			
			if (obj.val().length >= autocomplete.settings.minChars) {				
				if (autocomplete.request) {
					autocomplete.request.abort();
					cleanList();
				}					
				autocomplete.settings.params.q = autocomplete.el.val(); // variavel 'q' = value do input
				autocomplete.request = $.ajax({
					type: autocomplete.settings.type,					
					cache: autocomplete.settings.cache,
					url: autocomplete.settings.url,
					data: autocomplete.settings.params,
					dataType: autocomplete.settings.dataType
				}).done(function (data) {
					autocomplete.request.abort();
					if(JSON.stringify(data) != 'null' && JSON.stringify(data) != '[]' && JSON.stringify(data) != '') {
						populateList(data);
					}
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Erro: '+jqXHR.responseText);
				});
			} else {
				cleanList();
			}
		}
		
		function populateList(data) {
			cleanList();
			$.each(data,function(i, val){
				var value = val[0];
				var datas = JSON.stringify(val[1]);
				autocomplete.lista.append('<li data-data=\''+datas+'\'>'+value+'</li>');
			});			
		}
		
		$('body:not(.fn_autocomplete)').click(function(){
			if($('.fn_autocomplete').is(':visible')){
				$('.fn_autocomplete').hide();
			}
		});
		
		init();
				
		return this;
    };
	
}));