function f() {
    var request = new XMLHttpRequest();
    console.log(document.getElementById("name").value);
    var test = document.getElementById("name").value;
    var url = "https://ressources.data.sncf.com/api/records/1.0/search/?dataset=liste-des-gares&q=" + test + "&facet=fret&facet=voyageurs&facet=code_ligne&facet=departement";
    request.open('GET', url, true);


    request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response)
        console.log(data.records[0]);
        var test = data.records[0];

        console.log(test.geometry.coordinates)
        var c1 = test.geometry.coordinates[0];
        var c2 = test.geometry.coordinates[1];
        var element = document.getElementById("text");
        element.innerHTML = "gare  = " + data.records[0].fields.libelle + " " + c1 + " \n" + c2;

    }


    request.send()
}