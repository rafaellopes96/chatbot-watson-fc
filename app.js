var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');
var app = express();
var contexid = "";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var conversation_id = "";
var w_conversation = watson.conversation({
    url: 'https://gateway.watsonplatform.net/conversation/api',
    username: process.env.CONVERSATION_USERNAME || '273741a6-a02c-41c1-8a05-6b4cc1f5d1cc',
    password: process.env.CONVERSATION_PASSWORD || 'B4bAMAxcYVuu',
    version: 'v1',
    version_date: '2016-07-11'
});
var workspace = process.env.WORKSPACE_ID || 'workspaceId';

app.get('/', function (req, res) {
	res.send('Chatbot Watson for Messenger.');
})

app.get('/politica', function (req, res) {
	res.send('<h2>Política de privacidade para <a href=\'http://chatbot-watson-fc.mybluemix.net/\'>Chatbot Watson FC</a></h2><p>Todas as suas informações pessoais recolhidas, serão usadas para o ajudar a tornar a sua visita no nosso site o mais produtiva e agradável possível.</p><p>A garantia da confidencialidade dos dados pessoais dos utilizadores do nosso site é importante para o Chatbot Watson FC.</p><p>Todas as informações pessoais relativas a membros, assinantes, clientes ou visitantes que usem o Chatbot Watson FC serão tratadas em concordância com a Lei da Proteção de Dados Pessoais de 26 de outubro de 1998 (Lei n.º 67/98).</p><p>A informação pessoal recolhida pode incluir o seu nome, e-mail, número de telefone e/ou telemóvel, morada, data de nascimento e/ou outros.</p><p>O uso do Chatbot Watson FC pressupõe a aceitação deste Acordo de privacidade. A equipa do Chatbot Watson FC reserva-se ao direito de alterar este acordo sem aviso prévio. Deste modo, recomendamos que consulte a nossa política de privacidade com regularidade de forma a estar sempre atualizado.</p><h2>Os anúncios</h2><p>Tal como outros websites, coletamos e utilizamos informação contida nos anúncios. A informação contida nos anúncios, inclui o seu endereço IP (Internet Protocol), o seu ISP (Internet Service Provider, como o Sapo, Clix, ou outro), o browser que utilizou ao visitar o nosso website (como o Internet Explorer ou o Firefox), o tempo da sua visita e que páginas visitou dentro do nosso website.</p><h2>Ligações a Sites de terceiros</h2><p>O Chatbot Watson FC possui ligações para outros sites, os quais, a nosso ver, podem conter informações / ferramentas úteis para os nossos visitantes. A nossa política de privacidade não é aplicada a sites de terceiros, pelo que, caso visite outro site a partir do nosso deverá ler a politica de privacidade do mesmo.</p><p>Não nos responsabilizamos pela política de privacidade ou conteúdo presente nesses mesmos sites.</p>')
})

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'EAACtS5HesysBAJDXJYzRIc7IBRyHg7uuJIBeTWBBsZAcbKQwEZCh5Mdx2m2jZC8a8eQBhb6BmeH2aPZCQ6vP6GQHUMCp9eiN230yErR8ICqZAjEuYHZAhzoVM7ZAyHA5mME1kJe7SmH6t5rwZBhJZCdqGNY2mAtuWCapkANuDZB1o27AZDZD') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Erro de validação no token.');
});

app.post('/webhook/', function (req, res) {
	var text = null;
	
    messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {	
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;

        if (event.message && event.message.text) {
			text = event.message.text;
		}else if (event.postback && !text) {
			text = event.postback.payload;
		}else{
			break;
		}
		
		var params = {
			input: text,
			// context: {"conversation_id": conversation_id}
			context:contexid
		}

		var payload = {
			workspace_id: "d4703e1c-464c-4a13-a458-7e401f80e0d2"
		};

		
		if (params) {
			if (params.input) {
				params.input = params.input.replace("\n","");
				payload.input = { "text": params.input };
			}
			if (params.context) {
				payload.context = params.context;
			}
		}
		
		callWatson(payload, sender);
    }
    res.sendStatus(200);
});

function callWatson(payload, sender) {
	w_conversation.message(payload, function (err, convResults) {
		console.log(convResults);
		contexid = convResults.context;
		
		
        if (err) {
            return responseToRequest.send("Erro.");
        }
		
		if(convResults.context != null)
    	   conversation_id = convResults.context.conversation_id;
        if(convResults != null && convResults.output != null){
			var i = 0;
			while(i < convResults.output.text.length){
				sendMessage(sender, convResults.output.text[i++]);
			}
		}
            
    });
}

function sendMessage(sender, text_) {
	text_ = text_.substring(0, 319);
	messageData1 = { text: text_ };	
	
	console.log(messageData1);
	console.log(messageData1.text);
	
	if(messageData1.text === "Olá, você quer viajar?"){
		console.log("Deu certo!");
	}
	
	messageData2 = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "Card Teste 1",
				    "subtitle": "1º Elemento",
				    "image_url": "http://1.bp.blogspot.com/-sFhEBRhVscI/TpkAUfkrH3I/AAAAAAAAAEc/Pq4OHod0MJI/s1600/teste1.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://www.messenger.com",
					    "title": "web url"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Esta é a mensagem do primeiro Card",
				    }],
			    }, {
				    "title": "Card Teste 2",
				    "subtitle": "2º Elemento",
				    "image_url": "https://thumbs.dreamstime.com/z/teste-palavra-no-teclado-22545850.jpg",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Mensagem do segundo Card aqui",
				    }],
			    }]
		    }
	    }
    }
	
	console.log("Aqui é a mensagem do Watson: " + messageData1);
	console.log("Aqui é a mensagem botão: " + messageData2);
	
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData1,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
    
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData2,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

var token = "EAACtS5HesysBAJDXJYzRIc7IBRyHg7uuJIBeTWBBsZAcbKQwEZCh5Mdx2m2jZC8a8eQBhb6BmeH2aPZCQ6vP6GQHUMCp9eiN230yErR8ICqZAjEuYHZAhzoVM7ZAyHA5mME1kJe7SmH6t5rwZBhJZCdqGNY2mAtuWCapkANuDZB1o27AZDZD";
var host = process.env.VCAP_APP_HOST || 'localhost';
var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port, host);