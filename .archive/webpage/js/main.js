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
	  		Materialize.toast('Episode successfully verified and moved!', 4000);
	  },
	  error: function(data) {
	  	Materialize.toast(data.responseJSON.error, 4000);
	  	console.log(data.responseJSON.error);
    	e.preventDefault(); // avoid to execute the actual submit of the form.
	  }
	});
    e.preventDefault(); // avoid to execute the actual submit of the form.
});


function foo(id) {
	console.log(id[0]);
	var el = $(id[0]);
	// if (el.attr('contenteditable') == 'true'){
	// 	el.attr('contenteditable', 'false');
	// } else {
	// 	el.attr('contenteditable', 'true')
	// }
	el.attr('contenteditable', 'true');
}

function getShow() {
	var url = env_variables.url + getUrlParameter('id');
	$.ajax({
	  url: url,
	  dataType: "json",
	  success: function (data) {
	  		$('#parent').append('<br><span>' + data['parent'] + '</span>');
	  		if (data['verified']) {
	  			$('#verified').append('<img src="images/verified.svg">');
	  		}
	  		$('#name').append('<p>' + data['name'] + '</p>');
	  		$('#season').append('<p>' + data['season'] + '</p>');
	  		$('#episode').append('<p>' + data['episode'] + '</p>');
	  		var itemList= JSON.parse(data['video_files']);
	  		for (item in itemList) {
	  			$('#video_files').append('<p>' + itemList[item][0] + '</p>');
	  			$('#video_files').append('<p onclick="foo($(this));">' + itemList[item][1] + '</p>');
	  		}

	  		var itemList= JSON.parse(data['subtitles']);
	  		for (item in itemList) {
	  			$('#subtitles').append('<p>' + itemList[item][0] + '</p>');
	  			$('#subtitles').append('<p onclick="foo($(this));">' + itemList[item][1] + '</p>');
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