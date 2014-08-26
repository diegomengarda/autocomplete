#Autocomplete 1.0
##Plugin em jQuery de auto-sugestões para campos de texto

###Autor
Diego Mengarda / <a href="http://www.twitter.com/diegomengarda">@diegomengarda</a>

###Licença
Lançado sob a licença MIT - http://opensource.org/licenses/MIT

##Instalação

###Passo 1: Incluir arquivos necessários

```html
<!-- Biblioteca jQuery (jQuery CDN) -->
<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
<!-- bxSlider Javascript file -->
<script src="autocomplete/js/autocomplete-min.js"></script>
<!-- bxSlider CSS file -->
<link href="autocomplete/css/autocomplete.css" rel="stylesheet" />
```

###Passo 2: A marcação HTML

```html
<input type="text" class="autocomplete" name="cidade">
```

###Passo 3: Chamar o Autocomplete

```javascript
$(function(){
	$('.autocomplete').autocomplete({		
		url : 'ajax.php',
		onSelectItem : function(elemento, dados){
		  	elemento.val(dados[0]);
			elemento.data('uf', dados[1]);
		}		
	});
});
```

####Resposta do ajax.php em formato json

```javascript
[
  [
    "Porto Alegre",
    [
      20,
      "RS"
    ]
  ],
  [
    "Uruguaiana",
    [
      89,
      "RS"
    ]
  ]
]
```

##Configurações

###Geral

**url**
URL do arquivo no servidor
```
default: ''
options: String 
```

**width**
Width da lista de sugestões
```
default: 'auto'
options: String ('400', '300', '100')
```

**minChars**
Width da lista de sugestões
```
default: 2
options: Inteiro
```

**maxHeight**
Height máximo da lista de sugestões
```
default: 200
options: Inteiro
```

**params**
Parametros enviados para o arquivo do servidor
```
default: {}
options: Objeto
```

**zIndex**
z-index CSS da lista de sugestões
```
default: 9999
options: Inteiro
```

**type**
Método de envio dos dados para o servidor
```
default: 'POST'
options: String ('POST', 'GET')
```

**cache**
Armanzenar retornos iguais no javascript
```
default: false
options: Boleano (true, false')
```

###Retornos (Callbacks)

**onSelectItem**
Ação ao selecionar um ítem da lista de sugestões
```
default: function(){}
options: function(elemento, dados){ // seu código aqui }
arguments:
  elemento: caixa de texto que o autocomplete foi chamado
  dados: retorno do servidor em formato de array
```
