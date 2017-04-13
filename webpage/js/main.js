	function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function getURLId() {
	var sPageURL = window.location.search.substring(1);
	var sParameterName = sPageURL.split('=');
	if (sParameterName[0] == 'id') {
		var query_id = document.getElementById('title').innerHTML = sParameterName[1];
		
		return query_id;
	}
}

$(document).ready(function() {
	getShow();
});


// this is the id of the form
$("#searchForm").submit(function(e) {
	var url = env_variables.url + 'verify/' + getUrlParameter('id');
	$.ajax({
	  url: url,
	  type: 'POST',
	  success: function (data) {
	  		Materialize.toast('Verification successfully sent!', 4000);
	  },
	  error: function(data) {
	  	console.log(data.responseJSON.error);
    	e.preventDefault(); // avoid to execute the actual submit of the form.
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

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function getShow() {
	var url = env_variables.url + getUrlParameter('id');
	$.ajax({
	  url: url,
	  dataType: "json",
	  success: function (data) {
	  		$('#parent').val(data['parent']);
	  		$('#name').val(data['name']);
	  		$('#season').val(data['season']);
	  		$('#episode').val(data['episode']);
	  		var itemList= JSON.parse(data['video_files']);
	  		for (item in itemList) {
	  			$('#video_files').append('<p>' + itemList[item][0] + '</p>');
	  			$('#video_files').append('<p>' + itemList[item][1] + '</p>');
	  		}

	  		var itemList= JSON.parse(data['subtitles']);
	  		for (item in itemList) {
	  			$('#subtitles').append('<p>' + itemList[item][0] + '</p>');
	  			$('#subtitles').append('<p>' + itemList[item][1] + '</p>');
	  		}

	  		var itemList= JSON.parse(data['trash']);
	  		for (item in itemList) {
	  			$('#trash').append('<p>' + itemList[item] + '</p>');
	  		}
	  		console.log(data);
	  },
	  error: function(data) {
	  	console.log(data.responseJSON.error);
	  }
	});
}