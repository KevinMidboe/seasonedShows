function getURLId() {
	var sPageURL = window.location.search.substring(1);
	var sParameterName = sPageURL.split('=');
	if (sParameterName[0] == 'id') {
		console.log(sParameterName[1]);
		var query_id = document.getElementById('title').innerHTML = sParameterName[1];
		
		return query_id;
	}
}

$(document).ready(function() {
	getShow();
});


function objectifyForm(formArray) {//serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}

// this is the id of the form
$("#searchForm").submit(function(e) {
	var formJsonObj = objectifyForm($("#searchForm").serializeArray());

	formJsonObj['verified'] = 1;
	formJsonObj['id'] = getURLId();
	console.log(formJsonObj);

	var url = 'https://apollo.kevinmidboe.com/api/seasoned';
	$.ajax({
	  url: url,
	  dataType: 'json',
	  type: 'POST',
	  data: JSON.stringify(formJsonObj),
	  success: function (data) {
	  		Materialize.toast('Verification successfully sent!', 4000);
	  },
	  error: function() {
	  	console.log('erorr');
	  }
	});
    e.preventDefault(); // avoid to execute the actual submit of the form.
});


function foo(id) {
	var el = $(id);
	if (el.attr('contenteditable') == 'true'){
		el.attr('contenteditable', 'false');
	} else {
		el.attr('contenteditable', 'true')
	}
}

function getShow() {
	var url = 'https://apollo.kevinmidboe.com/api/seasoned?id=' + getURLId();
	$.ajax({
	  url: url,
	  dataType: "json",
	  success: function (data) {
	  		var episode = data['episode'];
	  		$('#parent').val(episode['parent']);
	  		$('#name').val(episode['name']);
	  		$('#season').val(episode['season']);
	  		$('#episode').val(episode['episode']);
	  		$('#video_files').val(episode['video_files']);
	  		$('#subtitles').val(episode['subtitles']);
	  		$('#trash').val(episode['trash']);

	  		console.log(episode);
	  },
	  error: function() {
	  	console.log('erorr');
	  }
	});
}