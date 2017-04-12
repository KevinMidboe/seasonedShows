
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


// this is the id of the form
$("#searchForm").submit(function(e) {
	var url = env_variables.url + 'verify/' + getURLId();
	$.ajax({
	  url: url,
	  type: 'POST',
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
	var url = env_variables.url + getURLId();
	$.ajax({
	  url: url,
	  dataType: "json",
	  success: function (data) {
	  		$('#parent').val(data['parent']);
	  		$('#name').val(data['name']);
	  		$('#season').val(data['season']);
	  		$('#episode').val(data['episode']);
	  		$('#video_files').val(data['video_files']);
	  		$('#subtitles').val(data['subtitles']);
	  		$('#trash').val(data['trash']);

	  		console.log(data);
	  },
	  error: function() {
	  	console.log('erorr');
	  }
	});
}