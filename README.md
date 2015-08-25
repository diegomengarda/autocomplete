#Autocomplete 1.2
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
<!-- autocomplete Javascript -->
<script src="autocomplete/js/autocomplete-min.js"></script>
<!-- autocomplete CSS -->
<link href="autocomplete/css/autocomplete-min.css" rel="stylesheet" />
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
		onSelectItem : function(el, parameters){
		  	el.attr('data-code', parameters.code);
		}		
	});
});
```

####Resposta do ajax.php em formato json

```javascript
[
    {
        "value": "Blobfish",
        "parameters":
        {
            "code": 12
        }
    },
    {
        "value": "Ajolote",
        "parameters":
        {
            "code": 2
        }
    },
    {
        "value": "Lumpfish",
        "parameters":
        {
            "code": 28
        }
    },
    {
        "value": "Tiburón Prehistórico",
        "parameters":
        {
            "code": 32
        }
    },
    {
        "value": "Aye Aye",
        "parameters":
        {
            "code": 46
        }
    },
    {
        "value": "Pulpo Dumbo",
        "parameters":
        {
            "code": 17
        }
    }
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

**listMaxHeight**
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

**timeout**
Timeout para interromper a requisição
```
default: 10000
options: Inteiro
```

**cache**
Armanzenar retornos iguais no javascript
```
default: false
options: Boleano (true, false)
```

**debug**
Ativar erros do request de pesquisa
```
default: false
options: Boleano (true, false)
```


###Retornos (Callbacks)

**onSelectItem**
Ação ao selecionar um ítem da lista de sugestões
```
default: function(){}
options: function(el, parameters){ // seu código aqui }
arguments:
  el: Elemento caixa de texto que o autocomplete foi chamado
  parameters: parâmetros extras formato de objeto json
```
