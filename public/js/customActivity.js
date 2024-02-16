var payload = {};
var eventDefinitionKey;
var mid;
var journeyIDReal;
var journeyTokens;
var journeyEndpoints;
var eventJourneyName;
var eventJourneyDataExtensionId;
var eventJourneyCategoryFullPath;
var journeyDataObject;
var journeyEventDefinitionModel
var inArguments = [];
var inArgumentSchema = [];
var t = "";
var creditRemaining = "0";
var templatesArray = [];
var templateSelected;
var editor;
var responsecodeblock;
var environmentsArray = [];

define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
	
	editor = CodeMirror.fromTextArea(document.getElementById('jsonBody'), {mode: "application/ld+json",lineNumbers: true, theme: 'base16-dark', scrollbarStyle:"overlay", lineWrapping: true});
	
	connection.trigger('requestEndpoints');
	connection.on('requestedEndpoints', function(endpoints) {
		
		journeyEndpoints = endpoints;
	});
	
	connection.trigger('requestTokens');
	connection.on('requestedTokens', function(tokens) { 
			try
			{
				journeyTokens = tokens;
	
				mid = journeyTokens.MID;
				if (mid) {
					document.getElementById('midStatus').classList.remove('alert-primary');
					document.getElementById('midStatus').classList.add('alert-success');
					document.getElementById('midStatusWait').style.display = 'none';
					document.getElementById('Layer_1').style.display = 'block';
				} else {
					mid = "unknown";
					console.log('mid not detected');
				}
			}
			catch(err){
				mid = "unknown";
			}
			
			
			try
			{


					var settings = {
					  "url": "https://sfmc-custom-activity-math-ceea0ed6a000.herokuapp.com/getjourneyid/",
					  "method": "POST",
					  "timeout": 0,
					  "contentType": "application/json",
					  "processData": false,
					  "data": JSON.stringify({
						"url": ""+journeyEndpoints.fuelapiRestHost,
						"token": ""+journeyTokens.fuel2token,
						"journeyName":""+eventJourneyName
					  })
					};

					$.ajax(settings).done(function (response) {		
					 	//console.log(JSON.stringify(response));
						try
						{
							journeyIDReal = response.journeyid;
							document.getElementById('journeyStatus').classList.remove('alert-primary');
							document.getElementById('journeyStatus').classList.add('alert-success');
							document.getElementById('journeyIdStatusWait').style.display = 'none';
							document.getElementById('Layer_2').style.display = 'block';
						}
						catch(err) {

						}
					});

			}
			catch(err){
				journeyIDReal = "unknown";
				alert("Salve sua jornada antes");
			}
			
		
			
	
	});
	
	
	function AssignEnvironmentVariables(){
				for (var index = 0; index < environmentsArray.length; ++index) {
				try {
				
					var html = '<button class="dropdown-item" value="'+environmentsArray[index]._id+'" onclick="SelectEnvironment(this)" type="button">'+environmentsArray[index].name+'</button>';
					$('#EnvironmentsList').append(html);
				}
				catch(err) {}			
		 }
	}

	async function TestAPI() {
		var postURL = document.getElementById("jsonURL").value;
        const postData = editor.getValue();
        const options = {
            method: document.getElementById("methodType").value,
            headers: {
                "Content-Type": "application/json"
            },
        };
        
        if(document.getElementsByName('headerkey[]').length>0){
			for (var index = 0; index < document.getElementsByName('headerkey[]').length; ++index) {
				if(document.getElementsByName('headerkey[]')[index].value != "" && document.getElementsByName('headerkey[]')[index].value != null){
					var headerKey = document.getElementsByName('headerkey[]')[index].value;
            		var headerValue = document.getElementsByName('headervalue[]')[index].value;
            		options.headers[headerKey] = headerValue;
				}
			}
		}

		if(!postURL || !postData) {
			$.notify("Preencha o campo de URL e Body para realizar testes", "error");
		} else if(isJsonString(postData) == false) {
			$.notify("JSON inválido", "error");
		} else {
			try {
				var settings = {
					"url": "/apihandler",
					"method": "POST",
					"timeout": 0,
					"contentType": "application/json",
					"processData": false,
					"data": JSON.stringify({
					  "url": postURL,
					  "payload": postData,
					  "headers": options.headers,
					  "method": options.method
					})
				  };

				document.getElementById("testHeader").style.display = "flex";
				document.getElementById("loadResponse").style.display = "block";
				if (responsecodeblock) {
					responsecodeblock.getWrapperElement().style.display = "none";
				}
				$("#test-status").remove();

				  $.ajax(settings)
				  	.done(function (response) {	
					   //console.log(JSON.stringify(response));
					   document.getElementById("loadResponse").style.display = "none";
					   responsecodeblock = CodeMirror.fromTextArea(document.getElementById('jsonTestResponse'), {mode: "application/ld+json",lineNumbers: true, theme: 'base16-dark', readOnly:true, scrollbarStyle:"overlay", lineWrapping: true});
					   if (response.status < 400) {
						var htmlextra = '<button id="test-status" type="button" class="btn btn-success" style="cursor:default; font-size:12px; padding:2px 10px; margin-left:10px; pointer-events: none">Code: ' + response.status + '</button>';
					   } else if (response.status) {
						var htmlextra = '<button id="test-status" type="button" class="btn btn-danger" style="cursor:default; font-size:12px; padding:2px 10px; margin-left:10px; pointer-events: none">Code: ' + response.status + '</button>';
					   } else {
						var htmlextra = '<button id="test-status" type="button" class="btn btn-danger" style="cursor:default; font-size:12px; padding:2px 10px; margin-left:10px; pointer-events: none">Error</button>';
					   }
						$('.title_response').append(htmlextra);
					   //console.log('response:',response.data);
					   responsecodeblock.setValue(JSON.stringify(response.data,null,' '));
					   return;
				  	})
					.fail(function (error) {
						document.getElementById("loadResponse").style.display = "none";
						responsecodeblock = CodeMirror.fromTextArea(document.getElementById('jsonTestResponse'), {mode: "application/ld+json",lineNumbers: true, theme: 'base16-dark', readOnly:true, scrollbarStyle:"overlay", lineWrapping: true});
						if(error.code === 'ECONNABORTED') {
							var htmlextra = '<button id="test-status" type="button" class="btn btn-danger" style="cursor:default; font-size:12px; padding:2px 10px; margin-left:10px; pointer-events: none">Timed Out</button>';
		 					$('.title_response').append(htmlextra);
							responsecodeblock.setValue(JSON.stringify(error, null, ' '));
							return;
						} else if(error.code === 'ERR_NETWORK') {
							var htmlextra = '<button id="test-status" type="button" class="btn btn-danger" style="cursor:default; font-size:12px; padding:2px 10px; margin-left:10px; pointer-events: none">Invalid URL</button>';
		 					$('.title_response').append(htmlextra);
							responsecodeblock.setValue(JSON.stringify(error, null, ' '));
							return;
						} else if (error) {
							var htmlextra = '<button id="test-status" type="button" class="btn btn-danger" style="cursor:default; font-size:12px; padding:2px 10px; margin-left:10px; pointer-events: none">Code: ' + error.status + '</button>';
		 					$('.title_response').append(htmlextra);
							 responsecodeblock.setValue(JSON.stringify(error, null, ' '));
							 return;
						}
					});

			}
			catch(err){
				//journeyIDReal = "unknown";
				/*alert("Please save your journey first before using the postman activity to ensure best experience.");*/
			}


			document.getElementById("testHeader").style.display = "flex";
			document.getElementById("loadResponse").style.display = "block";
			if (responsecodeblock) {
				responsecodeblock.getWrapperElement().style.display = "none";
			}
			$("#test-status").remove();
			
		}

		function isJsonString(str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		}
	}
	
	
	
	connection.trigger('requestSchema');
	connection.on('requestedSchema', 
	function (data) {
	
		journeyDataObject = data;
		
		 for (var index = 0; index < data.schema.length; ++index) {
				try {
					try
					{
					if(data.schema[index].key.includes("Interaction."))
					{
						var n = data.schema[index].key.lastIndexOf('.');
						var keyValueName = data.schema[index].key.substring(n + 1);

						inArguments.push({[keyValueName]:data.schema[index].type});
						inArgumentSchema.push({
							[keyValueName]:{
								"dataType":data.schema[index].type,
								"direction":"out",
								"access":"visible",
								"isNullable": true}});	
					}
					}catch(err) {}
					
						var html = '<li style="cursor:pointer;" onclick="OnAttributeClicked(this)" class="list-group-item attributes-list">\{\{'+data.schema[index].key.replaceAll(data.schema[index].name+'', '"'+data.schema[index].name+'"')+'\}\}<strong></strong></li>';
					$('#Data_Extension_Attributes').append(html);
				}
				catch(err) {}
		 }
		 var htmlextra = '<li style="cursor:pointer;" onclick="OnAttributeClicked(this)" class="list-group-item attributes-list">\{\{Context.DefinitionInstanceId\}\}<strong></strong></li>';
		 $('#Data_Extension_Attributes').append(htmlextra);
		 htmlextra = '<li style="cursor:pointer;" onclick="OnAttributeClicked(this)" class="list-group-item attributes-list">GETDATE()<strong></strong></li>';
		 $('#Data_Extension_Attributes').append(htmlextra);
		 htmlextra = '<li style="cursor:pointer;" onclick="OnAttributeClicked(this)" class="list-group-item attributes-list">GUID()<strong></strong></li>';
		 $('#Data_Extension_Attributes').append(htmlextra);
	});
	
	


    $(window).ready(onRender);
	
	connection.trigger('requestTriggerEventDefinition');
	connection.on('requestedTriggerEventDefinition',
	function(eventDefinitionModel) {
		
		if(eventDefinitionModel){
			journeyEventDefinitionModel= eventDefinitionModel;
			eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
			eventJourneyName = eventDefinitionModel.name;
			eventJourneyDataExtensionId = eventDefinitionModel.dataExtensionId;
			eventJourneyCategoryFullPath = eventDefinitionModel.categoryFullPath;
			document.getElementById('schemaInfo').value =JSON.stringify(eventDefinitionModel);
		}

	});
	
	

	 
	
	 function onRender() {

   //startup sequence
    connection.trigger('ready');
	
		 
	
        $('#ResetButton').click(function(data) {
		  SetDefaultConfig(); 
        });

		$('#TestButton').click(function(data) {
			TestAPI(); 
		  });
		
	 }
	 


	
	connection.on('initActivity', function(data){
		  debugger;



		 
		try{

		journeyDataObject = JSON.parse(data.arguments.execute.journeyDataObject);
		
		for (var index = 0; index < journeyDataObject.schema.length; ++index) {
				try {
					var dataValueNameToReplace = '\\"'+journeyDataObject.schema[index].name+'\\"';
					var dataValueName = '"'+journeyDataObject.schema[index].name+'"'
					
					data.arguments.execute.body = data.arguments.execute.body.replaceAll(dataValueName, dataValueNameToReplace);
				}
				catch(err) {}
		 }
		 	 debugger;

	   		//A few config.json defaults to set back to original value
		data.arguments.execute.body = data.arguments.execute.body.replaceAll('\\"url\\":', '"url":');

		var startOutPos = data.arguments.execute.body.indexOf('"outArgumentCode": [');
		var endOutPos = data.arguments.execute.body.indexOf('url":');
		var outArgsText = data.arguments.execute.body.substr(startOutPos, (endOutPos-startOutPos));
		var fixedOutArgsText = outArgsText.replaceAll('\\"', '"');
		data.arguments.execute.body = data.arguments.execute.body.replaceAll(outArgsText, fixedOutArgsText);
		
		}
		 catch(err) {}
		 
	

		 try
		 {
		var tmpOut= JSON.parse(data.arguments.execute.body);
		var tmpOutArgs =tmpOut.outArgumentCode;
			var jsonBodyTmp = JSON.parse(data.arguments.execute.body);
			jsonBodyTmp.outArgumentCode = tmpOutArgs;	 
			data.arguments.execute.body = JSON.stringify(jsonBodyTmp,null,2);
		 }
		 catch(err) {}
		
		document.getElementById('configuration').value = JSON.stringify(data,null,2);
		var configuration = JSON.parse(document.getElementById('configuration').value);

		var jsonBody = JSON.parse(data.arguments.execute.body); //JSON.parse(configuration['arguments'].execute.body);
	    
	   
		if(jsonBody.methodType != "" && jsonBody.methodType != undefined && jsonBody.methodType != null)
		{
			document.getElementById('methodType').value = jsonBody.methodType;
		}
		
		editor.getDoc().setValue(jsonBody.data);	
		
		document.getElementById('jsonURL').value =jsonBody.url;
		
		try
		{
		var dataTypeRadio = document.getElementsByName('DataTypeRadioDefault');
	
		for (var i = 0, length = dataTypeRadio.length; i < length; i++) {
		  if (dataTypeRadio[i].value == jsonBody.mediaType) {
			  document.getElementById(dataTypeRadio[i].id).checked = true;	
			break;
		  }
		}
		}
		catch{}
		
		try{
		var arrHeaderObj =jsonBody.headers;
		
		if(arrHeaderObj.length>0){
			for (var index = 0; index < arrHeaderObj.length; ++index) {
				try {
					
					
					    var html = '';
							html += '<div id="inputHeadersFormRow">';
							html += '<div class="form-group input-group my-2"><span class="input-group-text alert-info" title="Variable Name"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M9.6,14L12,7.7L14.4,14M11,5L5.5,19H7.7L8.8,16H15L16.1,19H18.3L13,5H11Z"></path></svg></span>';
							html += '<input type="text" name="headerkey[]" value="'+arrHeaderObj[index].key+'" class="form-control" placeholder="KEY" autocomplete="off">';
							html += '<span class="input-group-text alert-info" title="Variable Value"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"></path></svg></span>';
							html += '<input type="text" name="headervalue[]" value="'+arrHeaderObj[index].value+'" class="form-control" placeholder="VALUE" autocomplete="off">';
							html += '<button id="removeHeaderRow" type="button" class="btn btn-outline-danger"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 6V5C17 3.89543 16.1046 3 15 3H9C7.89543 3 7 3.89543 7 5V6H4C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8H5V19C5 20.6569 6.34315 22 8 22H16C17.6569 22 19 20.6569 19 19V8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H17ZM15 5H9V6H15V5ZM17 8H7V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V8Z" fill="currentColor"></path></svg></button>';
							html += '</div></div>';

					$('#newHeaderRow').append(html);
				
				}
				catch(err) {}
			}
		}
		}
		catch(err) {}
		

		try
		{
		
		var arrResponseObj =configuration['arguments'].execute.outArguments;
		var arrResponseCode =jsonBody.outArgumentCode;
		if(configuration['arguments'].execute.outArguments.length>0){
			for (var index = 0; index < configuration['arguments'].execute.outArguments.length; ++index) {
				try {
	
					var html = '';
					html += '<div id="inputResponseFormRow">';
					html += '<div class="form-group input-group my-2"><span class="input-group-text alert-info" title="Variable Name"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M9.6,14L12,7.7L14.4,14M11,5L5.5,19H7.7L8.8,16H15L16.1,19H18.3L13,5H11Z"></path></svg></span>';
					html += '<input type="text" name="responsekey[]" value="'+Object.keys(arrResponseObj[index]).toString()+'" class="form-control" placeholder="KEY" autocomplete="off">';
					html += '<span class="input-group-text alert-info" title="Variable Value"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M4 13C2.89 13 2 13.89 2 15V19C2 20.11 2.89 21 4 21H8C9.11 21 10 20.11 10 19V15C10 13.89 9.11 13 8 13M8.2 14.5L9.26 15.55L5.27 19.5L2.74 16.95L3.81 15.9L5.28 17.39M4 3C2.89 3 2 3.89 2 5V9C2 10.11 2.89 11 4 11H8C9.11 11 10 10.11 10 9V5C10 3.89 9.11 3 8 3M4 5H8V9H4M12 5H22V7H12M12 19V17H22V19M12 11H22V13H12Z" /></svg></span>';
					html += '<select name="responsevalue[]" value="'+Object.values(arrResponseObj[index]).toString()+'" class="form-control" placeholder="VALUE" autocomplete="off"><option value="'+Object.values(arrResponseObj[index]).toString()+'">'+Object.values(arrResponseObj[index]).toString()+'</option><option value="Text">Text</option><option value="Number">Number</option><option value="Date">Date</option><option value="Boolean">Boolean</option><option value="Email Address">Email Address</option><option value="Phone">Phone</option></select>';
					try
					{   
							html += '<input type="text" name="responseCode[]" class="form-control" title="parentattribute.returnchildattribute=>childattribute=value" value="'+arrResponseCode[index].value+'" style="width:20%" placeholder="CODE/OPTIONAL" autocomplete="off">';
					}
					catch
					{
							html += '<input type="text" name="responseCode[]" class="form-control" title="parentattribute.returnchildattribute=>childattribute=value" style="width:20%" placeholder="CODE/OPTIONAL" autocomplete="off">';
					}
					html += '<button id="removeResponseRow" type="button" class="btn btn-outline-danger"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 6V5C17 3.89543 16.1046 3 15 3H9C7.89543 3 7 3.89543 7 5V6H4C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8H5V19C5 20.6569 6.34315 22 8 22H16C17.6569 22 19 20.6569 19 19V8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H17ZM15 5H9V6H15V5ZM17 8H7V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V8Z" fill="currentColor"></path></svg></button>';
					html += '</div></div>';
					

					$('#newResponseRow').append(html);				
				}
				catch(err) {
						var erromsg = err.message;
					
				}
			}
		}
		}
		catch(err) {}
		
		
		setTimeout(() => { editor.refresh();  }, 1000);
	
	});
	
	function WaitTimeout() {
		return null;
	}
	
	
	connection.on('clickedNext', function(){
	
		var configuration = JSON.parse(document.getElementById('configuration').value);
		
	    var jsonBody = JSON.parse(configuration['arguments'].execute.body);
		try {
			jsonBody.methodType = document.getElementById('methodType').value;
		}
		catch(err) {}
	
		try {			
			jsonBody.data = editor.getDoc().getValue();
		}
		catch(err) {}
	
		try {
			jsonBody.url =  document.getElementById('jsonURL').value;
		}
		catch(err) {}
		
		try
		{
		
			if(inArguments.length >0){
				configuration['arguments'].execute.inArguments = JSON.parse(JSON.stringify(inArguments));
			}
			if(inArgumentSchema.length >0){
				configuration['schema'].arguments.execute.inArguments = JSON.parse(JSON.stringify(inArgumentSchema));
			}
		}
		catch(err) {}
		
		
		configuration['arguments'].execute.headers = [];	
		jsonBody.headers = [];
		if(document.getElementsByName('headerkey[]').length>0){
			for (var index = 0; index < document.getElementsByName('headerkey[]').length; ++index) {
				if(document.getElementsByName('headerkey[]')[index].value != "" && document.getElementsByName('headerkey[]')[index].value != null){
					jsonBody.headers.push({
						"key":""+document.getElementsByName('headerkey[]')[index].value,
						"value":""+document.getElementsByName('headervalue[]')[index].value});
				}
			}
		}
		
		var dataTypeRadio = document.getElementsByName('DataTypeRadioDefault');

		for (var i = 0, length = dataTypeRadio.length; i < length; i++) {
		  if (dataTypeRadio[i].checked) {
			jsonBody.mediaType = dataTypeRadio[i].value;	
			break;
		  }
		}
		
	
		if(journeyIDReal == null || journeyIDReal == undefined){
			try
			{

				var settings = {
					"url": "/getjourneyid/",
					"method": "POST",
					"timeout": 0,
					"contentType": "application/json",
					"processData": false,
					"data": JSON.stringify({
					  "url": ""+journeyEndpoints.fuelapiRestHost,
					  "token": ""+journeyTokens.fuel2token,
					  "journeyName":""+eventJourneyName
					})
				  };

				  $.ajax(settings).done(function (response) {		
					   //console.log(JSON.stringify(response));
					  try
					  {
						  journeyIDReal = response.journeyid;
						  document.getElementById('journeyStatus').classList.remove('alert-primary');
						  document.getElementById('journeyStatus').classList.add('alert-success');
						  document.getElementById('journeyIdStatusWait').style.display = 'none';
						  document.getElementById('Layer_2').style.display = 'block';
					  }
					  catch(err) {

					  }
				  });

			}
			catch(err){
				journeyIDReal = "unknown";
				/*alert("Please save your journey first before using the postman activity to ensure best experience.");*/
			}
			
		}
		if(journeyIDReal == null || journeyIDReal == undefined || journeyIDReal == "" ){
			var thisValue = setTimeout(WaitTimeout, 2000); 
		}
		if(journeyIDReal == null || journeyIDReal == undefined || journeyIDReal == ""){
			var thisValue = setTimeout(WaitTimeout, 2000); 
		}
		if(journeyIDReal == null || journeyIDReal == undefined || journeyIDReal == ""){
			var thisValue =  setTimeout(WaitTimeout, 2000); 
		}
		if(journeyIDReal == null || journeyIDReal == undefined || journeyIDReal == ""){
			var thisValue =  setTimeout(WaitTimeout, 2000); 
		}
		if(journeyIDReal == null || journeyIDReal == undefined || journeyIDReal == ""){
			var thisValue =  setTimeout(WaitTimeout, 2000); 
		}
		
		
		if(mid ==null || mid == undefined || mid == ""){
		try
			{
				journeyTokens = tokens;
	
				mid = journeyTokens.MID;
				if (mid) {
					document.getElementById('midStatus').classList.remove('alert-primary');
					document.getElementById('midStatus').classList.add('alert-success');
					document.getElementById('midStatusWait').style.display = 'none';
					document.getElementById('Layer_1').style.display = 'block';
				} else {
					mid = "unknown";
					console.log('mid not detected');
				}
			}
			catch(err){
				mid = "unknown";
				/*alert("Please save your journey first before using the postman activity to ensure best experience.");*/
			}
		}
		if(mid == null || mid == undefined || mid == "" ){
			var thisValue = setTimeout(WaitTimeout, 2000); 
		}
		if(mid == null || mid == undefined || mid == ""){
			var thisValue = setTimeout(WaitTimeout, 2000); 
		}
		if(mid == null || mid == undefined || mid == ""){
			var thisValue =  setTimeout(WaitTimeout, 2000); 
		}
		if(mid == null || mid == undefined || mid == ""){
			var thisValue =  setTimeout(WaitTimeout, 2000); 
		}
		if(mid == null || mid == undefined || mid == ""){
			var thisValue =  setTimeout(WaitTimeout, 2000); 
		}
		
		jsonBody.t = t;
		jsonBody.journeyName = eventJourneyName;
		jsonBody.journeyIDReal = journeyIDReal;
		jsonBody.mid = mid;
		jsonBody.subscriberKey = "{{Contact.Key}}";
		jsonBody.additional = "";
		jsonBody.journeyVersionNumber = "{{Context.VersionNumber}}";
		
			debugger;
		try
		{
		jsonBody.logData = document.getElementById("LogData").checked;
		
		}
		catch{}

		configuration['arguments'].execute.journeyDataObject = JSON.stringify(journeyDataObject,null,2); 

		configuration['arguments'].execute.outArguments = [];
		configuration['schema'].arguments.execute.outArguments = [];
		jsonBody.outArgumentCode = [];
		if(document.getElementsByName('responsekey[]').length>0){
			for (var indexResponse = 0; indexResponse < document.getElementsByName('responsekey[]').length; ++indexResponse) 
			{
				if(document.getElementsByName('responsekey[]')[indexResponse].value != "" && document.getElementsByName('responsekey[]')[indexResponse].value != null)
				{
						
						configuration['arguments'].execute.outArguments.push({[document.getElementsByName('responsekey[]')[indexResponse].value]:document.getElementsByName('responsevalue[]')[indexResponse].value});
						configuration['schema'].arguments.execute.outArguments.push({
							[document.getElementsByName('responsekey[]')[indexResponse].value]:{
								"dataType":document.getElementsByName('responsevalue[]')[indexResponse].value,
								"direction":"out",
								"access":"visible",
								"isNullable": true}});
				
					jsonBody.outArgumentCode.push({
						"key":""+document.getElementsByName('responsekey[]')[indexResponse].value,
						"value":""+document.getElementsByName('responseCode[]')[indexResponse].value});
				
				}
			}
		}

		
		configuration['arguments'].execute.body =JSON.stringify(jsonBody,null,2);
			 for (var index = 0; index < journeyDataObject.schema.length; ++index) {
				try {
					var dataValueName = '\\"'+journeyDataObject.schema[index].name+'\\"';
					var dataValueNameToReplace = '"'+journeyDataObject.schema[index].name+'"'
					var inputToTransform = journeyDataObject.schema[index].key.replaceAll(journeyDataObject.schema[index].name+'', '\\"'+journeyDataObject.schema[index].name+'\\"');
					var inputVaueTransformed = journeyDataObject.schema[index].key.replaceAll(journeyDataObject.schema[index].name+'', '"'+journeyDataObject.schema[index].name+'"');
					configuration['arguments'].execute.body = configuration['arguments'].execute.body.replaceAll(inputToTransform, inputVaueTransformed);
				}
				catch(err) {}
		 }
		 
		if(document.getElementById('methodType').value==undefined || document.getElementById('methodType').value=="Method Type" || document.getElementById('methodType').value==""|| document.getElementById('jsonURL').value==undefined || document.getElementById('jsonURL').value==""){
			configuration['metaData'].isConfigured = false;
		}
		else{
			configuration['metaData'].isConfigured = true;
		}
	
		connection.trigger('updateActivity',configuration);
	});
	

	
	function SetDefaultConfig()
	{

		document.getElementById('jsonURL').value = "";
		document.getElementById('methodType').value = "";

		editor.getDoc().setValue('');
		responsecodeblock.getDoc().setValue('');
		responsecodeblock.getWrapperElement().style.display = "none";
		document.getElementById("testHeader").style.display = "none";
		editor.refresh();
		responsecodeblock.refresh();
		
		configuration['arguments'].execute.body = "";
		configuration['arguments'].execute.verb = "";
		configuration['arguments'].execute.url = "";
		configuration['arguments'].execute.header = "";
		document.getElementById('configuration').value =JSON.stringify( configuration,null,2);
	}
	
	String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
	};
	
});
