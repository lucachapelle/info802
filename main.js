
var http = require('http');
var fs = require('fs');
var convert = require('xml-js');
const fetch = require("node-fetch");


var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');

    // Quand le serveur reçoit un signal de type "message" du client
    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
    });
});

io.sockets.on('connection', function (socket) {
    var res ;
    socket.on('calcul', function (args) {
        //console.log('test' + args);

        s(args);

    });


    socket.on('trouveGarre', function (args) {
        //console.log('test' + args);

        f(args);

    });
});


server.listen(4000);


async function f(args) {
    var test = await trouveGare2(args.nom1);
    var test2 = await trouveGare2(args.nom2);

    res =[test,test2];
    io.sockets.emit('listeGarre',res );
}

async function trouveGare(args) {
    console.log(args);
    var request = new XMLHttpRequest();
    var url = "https://ressources.data.sncf.com/api/records/1.0/search/?dataset=liste-des-gares&q=" + args + "&facet=fret&facet=voyageurs&facet=code_ligne&facet=departement";
    const reponse = await fetch(url);
    const data = await reponse.json();
    //console.log(data);
    // Begin accessing JSON data here
   // console.log(data.records[0]);
    var test = data.records[0];

    console.log(test.fields.libelle);
    var c1 = test.geometry.coordinates[0];
    var c2 = test.geometry.coordinates[1];
    //var element = document.getElementById("text");
    //io.sockets.emit('gare', test.geometry);

    res = {cord1: c2, cord2: c1};
    return res;
}

async function trouveGare2(args) {
    console.log(args);
    var jsonObj = {};

        const Http = new XMLHttpRequest();
  //  auth = new HttpHeaders().set('Authorization', 'bba52e6a-a1b0-4c90-b821-8314a87b3b7c');

        const url='https://ressources.data.sncf.com/api/records/1.0/search//?dataset=referentiel-gares-voyageurs&q=' + args + '&rows=100&refine.pltf_segmentdrg_libelle=a';
    //const response = await fetch(url);
  /*  let response = await fetch(url, {
        headers: {
            Authentication: '7bb4bc61-ac35-4b63-87d1-f800ec389b7d'
        }
    });
    console.log(fetch(url, {
        headers: {
            Authentication: '7bb4bc61-ac35-4b63-87d1-f800ec389b7d'
        }
    }));*/
    const reponse = await fetch(url);

   // console.log(reponse);
    const data = await reponse.json();
    //console.log(data.places);
    //console.log(data.records);
    tab = data.records;
   // console.log(tab.length);
    //console.log(tab[1]);
    //console.log(tab[0]);
    for (let i = 0; i < tab.length; i++) {
    element = tab[i];
        try {
          //console.log(element.fields.gare_ut_libelle + " coord"  + element.geometry.coordinates);
            jsonObj[element.fields.gare_ut_libelle] = element.geometry.coordinates;
        }
        catch(error) {
            console.log("pas de coordonnées");

        }
    }
    //console.log(jsonObj);

    return jsonObj;
}


function s(args) {
    var url = 'http://localhost:8080/TrouveTonTrain_war_exploded/services/HelloWorld?wsdl';

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, true);
    const sr =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:exam="http://example/">' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <exam:distance_2_towns>' +
        '         <arg0>' + args[0] + '</arg0>' +
        '         <arg1>' + args[1] + '</arg1>' +
        '         <arg2>' + args[2] + '</arg2>' +
        '         <arg3>' + args[3] + '</arg3>' +
        '      </exam:distance_2_towns>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';
    xmlhttp.onreadystatechange =  () => {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                const xml = xmlhttp.responseText;
                io.sockets.emit('req', xml);

            }

        }
    }
    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
    /*soap.createClient(url, function(err, client) {
        var arg = {x1 : 4, x2 : 5};
        client.sayHelloWorldFrom(arg,function(err, result) {
            console.log(arg);
            console.log(result);
            io.sockets.emit('req',result.return );

        });


    });*/

}
