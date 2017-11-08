/* This server, unlike our previous ones, uses the express framework */
var express = require('express');
var formidable = require('formidable');  // we upload images in forms
// this is good for parsing forms and reading in the images

// make a new express server object
var app = express();
var fileName;
var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile);  // new object, old DB


// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
// An example query URL is "138.68.25.50:???/query?img=hula"
app.get('/query', function (request, response){
    
    console.log("query");
    query = request.url.split("?")[1]; // get query string
	
 
    if (query) {
	answer(query, response);
    } else {
	sendCode(400,response,'query not recognized');
    }
});

// Case 3: upload images
// Responds to any POST request
app.post('/', function (request, response){
    var form = new formidable.IncomingForm();
    form.parse(request); // figures out what files are in form
   // callback for when a file begins to be processed
    form.on('fileBegin', function (name, file){
	// put it in /public
	console.log(file);
	fileName = file.name;
	file.path = __dirname + '/public/' + file.name;
	console.log("uploading ",file.name,name);



    });

    // callback for when file is fully recieved
    form.on('end', function (){
	var request = require('request');
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var str = "";
	var resp;
	requestObject = {
		"requests": [{
      			"image": {"source": {"imageUri": "http://138.68.25.50:12374/"+fileName}},
      			"features": [{ "type": "LABEL_DETECTION" }]
    		}]
	}

	// URL containing the API key 
	url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyALoG5kWvDYGbcHLjaRh0QP1IttGTSqUyg';


	function annotateImage() {
		request(
		    { // HTTP header stuff
			url: url,
			method: "POST",
			headers: {"content-type": "application/json"},
			// stringifies object and puts into HTTP request body as JSON 
			json: requestObject,
		    },
		    // callback function for API request
		    APIcallback
		);
   	 }
	// live callback function
	function APIcallback(err, APIresponse, body) {
	    	if ((err) || (APIresponse.statusCode != 200)) {
			console.log("Got API error"); 
	    	} else {
			APIresponseJSON = body.responses[0];
			console.log(APIresponseJSON);
		//	resp = JSON.stringify(APIresponseJSON);
			for(var i =0; i<APIresponseJSON.labelAnnotations.length; i++){
				str = str + "," +APIresponseJSON.labelAnnotations[i].description; 
			}
			console.log(str);
			sendCode(201,response,APIresponseJSON);  // respond to browser
		}
	console.log("starting DB Operations");     
   	db.run('INSERT OR REPLACE INTO photoLabels VALUES (?, ?, 0)',[fileName,str],errorCallback);

	function errorCallback(err) {
        	if (err) {
	    		console.log("error: ",err,"\n");
        	} 
    	}
 
}

	annotateImage();
	console.log('success');
    });


});

// You know what this is, right? 
app.listen(12374);

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
    response.status(code);
    response.send(message);
}
    
// Stuff for dummy query answering
// We'll replace this with a real database someday! 

function answer(query, response) {
	
	console.log("answering the query");
	//var kvpair = query.split("=")[i];
	var eqPos = query.lastIndexOf("=");
        var kvpair = query.slice(eqPos+1,query.length);
	console.log("type of op: "+kvpair);
	if(kvpair == "dumpDB"){
	    	//Dump whole database 
    		console.log("dumping database");
    		db.all('SELECT * FROM photoLabels',dataCallback);
		
		function dataCallback(err, tableData) {
       			if (err) {
	    			console.log("error: ",err,"\n");
        		} else {
	    			console.log("got: ",tableData,"\n");
        			console.log("about to send");
				response.status(200);
				response.type("text/json");
				response.send(tableData);
				console.log("sent");
			}   
    		}
	}else if( kvpair == "add"){
		var restStr= query.split("&");
		console.log(restStr);
		var imgName = restStr[0].split("=")[1];
		console.log(imgName);
		var label = restStr[1].split("=")[1];
		console.log(label);
		db.get('SELECT labels FROM photoLabels WHERE fileName =?',[imgName], getTagCallBack);
                function getTagCallBack(err, data){
		    if (err) {
			console.log("error: ",err,"\n");
		    }else{
			db.run('UPDATE photoLabels SET labels = ? WHERE fileName =?', [data.labels+","+label, imgName], updateCallback);
		    }
		}
                function updateCallback(err){
			if(err){
				console.log("error: ",err,"\n");
			}else{
				response.status(200);
				response.type("text/plain");
				response.send("added label "+label+" to "+imgName);
			}
		}
	}else if(kvpair == 'delete'){
		var restStr= query.split("&");
		console.log(restStr);
		var imgName = restStr[0].split("=")[1];
		console.log(imgName);
		var label = restStr[1].split("=")[1];
		console.log(label);
		db.get('SELECT labels FROM photoLabels WHERE fileName = ?', [imgName],tagCallback);
		
		function tagCallback(err,data){
			if(err){
				console.log("error: ",err,"\n");
			}else{
				var compStr=""; 
				var fullStr = data.labels;
				var strObj = fullStr.split(",");
				console.log("strObj array: " + strObj);
				for(var i= 0; i <strObj.length; i++){
					if(label === strObj[i]){
						console.log("label at i: "+label);
						console.log("strObj at i: "+ strObj[i]);	
						strObj[i] = "";
					}
				}
				console.log("updated strObj " + strObj);
				if(strObj.length>=1){
					for(var i = 0; i <strObj.length; i++){
						console.log(strObj[i]);
						compStr = compStr.concat(strObj[i]);
						compStr = compStr.concat(",");
					}
				}
				console.log("completeStrung: "+ compStr);
			
				//str = str.replace(", "+label, "");
				db.run('UPDATE photoLabels SET labels = ? WHERE fileName =?', [compStr,imgName], updateTagCallback);
			}
		}
		function updateTagCallback(err){
			if(err){
				console.log("error: ",err,"\n");
			}else{
				response.status(200);
				response.type("type/text");
				response.send("deletion DONE!!");
			}
		}
		

	}else if(kvpair == 'filter'){
		//console.log(query);
	//	var tag = query.split("&")[0].split("=")[1];
		//console.log(tag);
		db.all('SELECT * FROM photoLabels',getCountFunc);
		function getCountFunc(err,data){
			if(err){
				console.log("error: ",err,"\n");
			}else{
				response.status(200);
				response.type("text/json");
				response.send(data);
			}
		}
	}else if(kvpair == "setFav"){
		var restQuery = query.split("&");
		var imgName = restQuery[0].split("=")[1];
		var favVal = restQuery[1].split("=")[1];
		db.run('UPDATE photoLabels SET favorite = ? WHERE fileName =?', [favVal,imgName], updateTagCallback);
		function updateTagCallback(err){
			if(err){
				console.log("error: ",err,"\n");
			}else{
				response.status(200);
				response.type("type/text");
				response.send("favorite modified");
			}
		}
	}
	else{
		sendCode(400,response,"requested photo not found");
	}

}
