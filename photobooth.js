var upload = 0;
var filter = 0;
var formData = new FormData();
var selectedFile;
var picCount = 1;


function uploadExpand(){
    var uploadbox = document.getElementById("upload1");
    if(upload === 0){
        uploadbox.style.display = "block";
        upload = 1;
    }else{
        uploadbox.style.display = "none";
        upload = 0;
    }
    
}

function filterExpand(){
   var filterbox = document.getElementById("filter1");
    if(filter === 0){
        filterbox.style.display = "block";
       filter = 1;
   }else{
       filterbox.style.display = "none";
       filter = 0;
   }
    
}

function closeCalled(){
    var uploadbox = document.getElementById("upload1");
    uploadbox.style.display = "none";
    upload = 0;
}

function clickedOn(idName){
    var changeTags = idName.nextElementSibling;
    var addFave = idName.nextElementSibling.nextElementSibling;
    if(changeTags.style.display != "block"){
        changeTags.style.display = "block";
        addFave.style.display = "block";
    }else{
        changeTags.style.display = "none";
        addFave.style.display = "none";
    }
}

//This is the button action method for "Change Tags"
function changeTags(currentElement){
    //console.log(currentElement);
    var itsParent = currentElement.parentElement;
    //console.log(itsParent);
    var itsUncle = itsParent.nextElementSibling;
    //console.log(itsUncle.children[0]);
	if(itsUncle.hasChildNodes()){
    var button = itsUncle.lastElementChild;
    var button2 = button.lastElementChild;
    if(button2.style.display != "inline-block"){
        for(var i = 0; i< 20; i++){
            var elementCurrent = itsUncle.children[i];
            if(elementCurrent != null){
                elementCurrent.style.display = "inline-block";
            }
        }
        button2.style.display = "inline-block";
    }else{
        for(var i = 0; i< 20; i++){
            var elementCurrent = itsUncle.children[i];
            if(elementCurrent != null && elementCurrent.nodeName != "P"){
                elementCurrent.style.display = "none";
            }
        }
        button2.style.display = "none";
    }
}else{

	var dChild = document.createElement("DIV");
	dChild.setAttribute('class','input');

	var input = document.createElement("INPUT");
	input.setAttribute('type','text');

	dChild.appendChild(input);

	var button = document.createElement("BUTTON");
	button.setAttribute('onclick','addTag(this)');
	button.innerHTML = "Add";
	dChild.appendChild(button);
	itsUncle.append(dChild);	

}

}
//this function deletes the tags
function takeOutTag(currentElement){
    var button = currentElement.name;
    var para = currentElement.nextSibling;
    var tagName = para.textContent;
    currentElement.remove();
    var imageName = para.parentElement.previousElementSibling.style.backgroundImage;
    para.remove();
    var len = imageName.length - 2;
    var cropImg = imageName.slice(5,len);
    var url = "http://138.68.25.50:12374/query?img="+cropImg+"&label="+tagName+"&op=delete";
    var tagReq = new XMLHttpRequest();
    tagReq.open("GET", url);  
    tagReq.onload = function() {
	// the response, in case we want to look at it
	console.log(tagReq.responseText);

 }
    tagReq.send();
	     
    	 
		

}

function addTag(currentElement){
    var parent = currentElement.parentElement.parentElement;
    console.log(parent);
    var btn = document.createElement("BUTTON");
    var para = document.createElement("P");
    btn.setAttribute('onclick','takeOutTag(this)');
    btn.innerHTML = "&#10006";
    btn.style.display = "inline-block";
    var tagName = currentElement.previousElementSibling.value;
    para.innerHTML = tagName;
    console.log(tagName);
    parent.insertBefore(btn,parent.lastChild);
    parent.insertBefore(para,parent.lastChild);
   
 
	
   // btn.insertBefore(uncle.firstChild,uncle);
   //var parentName  = parent.previousElementSibling;
   var imageName = parent.previousElementSibling.style.backgroundImage;
   //console.log(imageName); 
   var len = imageName.length - 2;
   var cropImg = imageName.slice(5,len);
    var url = "http://138.68.25.50:12374/query?img="+cropImg+"&label="+tagName+"&op=add";
    var tagReq = new XMLHttpRequest();
    tagReq.open("GET", url);  
    tagReq.onload = function() {
	// the response, in case we want to look at it
	console.log(tagReq.responseText);

 	}
    tagReq.send();
		

}

function uploadThisFile(currentObj){
    document.getElementById('myFile').click();
}


function putPicture(current,fileName,tags,fav){
    	var parentIs = current.parentElement.parentElement.nextElementSibling.firstElementChild;
//  	console.log(parentIs);
    
	var fatherDiv = document.createElement("DIV");
	fatherDiv.classList.add('pic');
//	console.log(fatherDiv);
	
	var sonDiv = document.createElement("DIV");
	sonDiv.id = "picture"+picCount;
	fatherDiv.appendChild(sonDiv);
//	console.log(fatherDiv);

	sonDiv.classList.add('pik');
	
	//create 1st button
	var but1 = document.createElement("BUTTON");
	but1.setAttribute ('onclick', 'clickedOn(this)');
	but1.id = "button";
	but1.innerHTML = "&#8942;";
	sonDiv.appendChild(but1);

	//creating the second button
	var but2 = document.createElement("BUTTON");
	but2.setAttribute('onclick', 'changeTags(this)');
	but2.setAttribute('class','button111');
	but2.innerHTML = "&#10005;";
	sonDiv.appendChild(but2);	

	//creating fav button
	var but3 = document.createElement("BUTTON");
	but3.setAttribute('class','button111');
	but3.setAttribute('onclick','calledFavorites(this)');
	if(fav == 1){
		but3.innerHTML = "&#11088";
		but3.style.fontSize = "27px";

	}else{
		but3.innerHTML = "&#9733";
	}
	sonDiv.appendChild(but3);

	//creating second Div
	var daughterDiv = document.createElement("DIV");
	daughterDiv.setAttribute('class','tag');
	fatherDiv.appendChild(daughterDiv);
	
	parentIs.appendChild(fatherDiv);

	var pic = document.getElementById("picture"+picCount);
	picCount++;
	pic.style.opacity = "0.7";
	pic.style.backgroundImage = "url("+fileName+")";
	pic.style.backgroundSize = "100% 100%";
	pic.style.backgroundRepeat = "no-repeat";
	pic.style.opacity = "1.0";   
	
	if(tags.length >= 1){
	var tags = tags.split(",");
	console.log(tags);
		for(var i= 0; i < tags.length; i++){
			if(tags[i] != ""){	
				var str = tags[i];
				if(str.includes("%20")){
					str = str.replace("%20"," ");	
				}
				var but = document.createElement("BUTTON");
				but.setAttribute('onclick', 'takeOutTag(this)');
				but.innerHTML = "&#10006";
				daughterDiv.appendChild(but);

				var pTag = document.createElement("P");
				pTag.innerHTML = str;
				daughterDiv.appendChild(pTag);
			}
		}
	}
	var dChild = document.createElement("DIV");
	dChild.setAttribute('class','input');

	var input = document.createElement("INPUT");
	input.setAttribute('type','text');

	dChild.appendChild(input);

	var button = document.createElement("BUTTON");
	button.setAttribute('onclick','addTag(this)');
	button.innerHTML = "Add";
	dChild.appendChild(button);
	daughterDiv.appendChild(dChild);
	
}


//A function to upload files
// uploads an image within a form object.  This currently seems
// to be the easiest way to send a big binary file. 
function uploadFile() {
    
    //console.log("in this function");
    // where we find the file handle
    selectedFile = document.getElementById('myFile').files[0];
     
    // stick the file into the form
    formData.append("userfile", selectedFile);
    console.log(selectedFile.name);
    
    
    var select = document.getElementById('myFile');
    var pTag = select.nextElementSibling;
    var name = selectedFile.name;
    console.log(pTag);
    pTag.innerHTML = name;

}

function clickedUpload(current){
    var url = "http://138.68.25.50:12374";
    // more or less a standard http request
    var oReq = new XMLHttpRequest();
    // POST requests contain data in the body
    // the "true" is the default for the third param, so 
    // it is often omitted; it means do the upload 
    // asynchornously, that is, using a callback instead
    // of blocking until the operation is completed. 
    oReq.open("POST", url, true);  
    var fileName = selectedFile.name;
    selectedFile.name = "";
    oReq.onload = function() {
	// the response, in case we want to look at it
	console.log(oReq.responseText);
    	console.log("getting para");
    	var para = current.previousElementSibling;
    	para.innerHTML = "no file chosen"
    	var inp = para.previousElementSibling;
	console.log(inp.value);    
	inp.value = null;
    	console.log("Logging name");
    	console.log(fileName);	
	var dataArray = JSON.parse(this.responseText);
	console.log(dataArray);
	var tags = "";
	for(var i = 0; i <dataArray.labelAnnotations.length; i++){
		tags = tags + ","+ dataArray.labelAnnotations[i].description;
	}

	putPicture(current,fileName,tags);	

 }
    oReq.send(formData);
		

}

function dumpDataBase(){
	var aReq = new XMLHttpRequest();
	var url = "http://138.68.25.50:12374/query?op=dumpDB";
	
	aReq.open("GET",url);

	aReq.onload = function respCallback(){
		var dataArray = JSON.parse(this.responseText);
		console.log(dataArray);
	//	addPhotosToDOM(dataArray)
		console.log("Success");
		for(var i = 0; i < dataArray.length; i++){
			var fileName = dataArray[i].fileName;
			var tags = dataArray[i].labels;
			var fav = dataArray[i].favorite;	
			var current = document.getElementById("fileSelector");
			putPicture(current,fileName,tags,fav);
			console.log(fileName);
		}
	}
//	aReq.onload(respCallback);
	aReq.send();
}

function clickedOnFilter(current){
	var pSibling = current.previousElementSibling.previousElementSibling;
	console.log(pSibling);
	var textVal = pSibling.value;
	console.log(textVal);

	console.log(current.nodeName);

	var fReq = new XMLHttpRequest();
	var url =  "http://138.68.25.50:12374/query?tag="+textVal+"&op=filter";

	fReq.open('GET',url);

	fReq.onload = function respCallback(){
		var dataArray = JSON.parse(this.responseText);
		console.log(dataArray);
		console.log(picCount);
		var elm = document.getElementById("inPictures");
		while (elm.hasChildNodes()) {
 			 elm.removeChild(elm.lastChild);
		}
	
		picCount =1;

		for(var i = 0; i < dataArray.length; i++){
			var labels = dataArray[i].labels.split(",");
			var fileName = dataArray[i].fileName;
			console.log(fileName);
			var tags = dataArray[i].labels;
			var curr = document.getElementById("fileSelector");
			console.log("logging stuff");
			console.log(current.innerHTML);
			
			if(current.innerHTML == "enter"){
				for(var j = 0; j<labels.length; j++){
					var str = labels[j];
					if(str.includes("%20")){
						str = str.replace("%20"," ");	
					}

					if(textVal.toLowerCase() == str.toLowerCase()){
						putPicture(curr,fileName,tags,fav);
					}
				}	
			}else if(current.innerHTML == "☆"){
				console.log("in favorites");
				var fav = dataArray[i].favorite;
				if(fav == 1){
					console.log("putting favorites");
					putPicture(curr,fileName,tags,fav);
				}
			}
		}
	}
	fReq.send();
}

function calledFavorites(current){
//	console.log(current.innerHTML);
	var imgName = current.parentElement.style.backgroundImage;
	var len = imgName.length - 2;
        var imgName = imgName.slice(5,len);
	var fReq = new XMLHttpRequest();

	if(current.innerHTML == "★"){
		current.innerHTML = "&#11088";
		current.style.fontSize = "27px";
		var url = "http://138.68.25.50:12374/query?img="+imgName+"&fav=1&op=setFav";
 	}else{
		current.innerHTML = "&#9733";
		var url = "http://138.68.25.50:12374/query?img="+imgName+"&fav=0&op=setFav";
	}
	fReq.open("GET", url);  
   	fReq.onload = function() {
		// the response, in case we want to look at it
		console.log(fReq.responseText);
	}		
    	fReq.send();
}

function clearFilter(current){
	var elm = document.getElementById("inPictures");
	while (elm.hasChildNodes()) {
 		 elm.removeChild(elm.lastChild);
	}
	picCount =1;
	dumpDataBase();	

}
