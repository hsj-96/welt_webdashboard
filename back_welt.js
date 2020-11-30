$(function(){
	var date = '2019-06-20';
	var time = '18:00:00';
	var user_id = '1nhBflpO9ehPOndqzldvHWB3ILS2'
	var category = 0; // 0 : step, 1 : waist, 2 : calory
	//getUserData(user_id,date,time);
	//getUserCondition(user_id, date);
	//getRankingData(user_id, category, date);

	//getTimeIntervalData(user_id, date, time);
	
})


function getUserData(user_id, date, time){
	let ret_data;
	$.ajax({
		url:"php/userData.php",
		async: false,
		type : "GET",
		dataType:"json",
		data : {"user_id":user_id, "date":date, "time":time},
		success:function(data){
			//console.log(data);
			console.log('getUserData success');
			ret_data = data;
		},
		error: function(request, status, error) { 
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
	return ret_data;
}

function getUserCondition(user_id, date){
	let ret_data;
	$.ajax({
		url:"php/userCondition.php",
		async: false,
		type : "GET",
		dataType:"json",
		data : {"user_id":user_id, "date":date},
		success:function(data){
			//console.log(data);
			console.log('getUserCondition success');
			ret_data = data;
		},
		error: function(request, status, error) { 
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
	return ret_data;
}

function getRankingData(user_id, category, date){
	let ret_data;
	$.ajax({
		url:"php/ranking.php",
		async: false,
		type : "GET",
		dataType:"json",
		data : {"user_id":user_id, "category":category, "date":date},
		success:function(data){
			//console.log(data);
			console.log('getRankingData success');
			ret_data = data;
		},
		error: function(request, status, error) { 
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
	return ret_data;
}

function getTimeIntervalData(user_id, date){
	let ret_data;
	$.ajax({
		url:"php/timeInterval.php",
		async: false,
		type : "GET",
		dataType:"json",
		data : {"user_id":user_id, "date":date},
		success:function(data){
			//console.log(data);
			console.log('getTimeIntervalData success');
			ret_data = data;
		},
		error: function(request, status, error) { 
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
	return ret_data;
}
