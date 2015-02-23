#Autocomplete 1.1
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
		onSelectItem : function(elemento, dados){
		  	elemento.attr('data-idcidade', dados.idcidade);
        elemento.attr('data-uf', dados.uf);
		}		
	});
});
```

####Resposta do ajax.php em formato json

```javascript
[
  {
    "item": "Porto Alegre",
    "dados": {
      "idcidade": 20,
      "uf": "RS"
    }
  },
  {
    "item": "Uruguaiana",
    "dados": {
      "idcidade": 35,
      "uf": "RS"
    }
  },
  {
    "item": "Pelotas",
    "dados": {
      "idcidade": 12,
      "uf": "RS"
    }
  },
  {
    "item": "Alegrete",
    "dados": {
      "idcidade": 100,
      "uf": "RS"
    }
  },
  {
    "item": "Livramento",
    "dados": {
      "idcidade": 150,
      "uf": "RS"
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

**intervalTimer**
Tempo de espera do script para buscar os resultados após o usuário iniciar a digitação
```
default: 300
options: Inteiro
```

###Retornos (Callbacks)

**onSelectItem**
Ação ao selecionar um ítem da lista de sugestões
```
default: function(){}
options: function(elemento, dados){ // seu código aqui }
arguments:
  elemento: caixa de texto que o autocomplete foi chamado
  dados: retorno do servidor em formato de objeto
```
