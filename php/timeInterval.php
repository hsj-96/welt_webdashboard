<?php

$date = $_GET['date'];
$userId = $_GET['user_id'];

//$cat = 1 : step, 2 : waist, 3 : calory

for($cat = 1; $cat<4; $cat++){
	$total_day = getDataset_day($userId, $date, $cat);
	$StepRet[] = array("data"=>$total_day[0], "date"=>$total_day[1]);
	$total_week = getDataset_week($userId, $date, $cat);
	$StepRet[] = array("data"=>$total_week[0], "date"=>$total_week[1]);
	$total_month = getDataset_month($userId, $date, $cat);
	$StepRet[] = array("data"=>$total_month[0], "date"=>$total_month[1]);

	$timeIntervalDate[] = array("menu".$cat => $StepRet);
	unset($StepRet);
}
echo json_encode($timeIntervalDate);

// 하루 데이터 구하기
function getDataset_day($uid, $date, $cat){
    $conn = @mysqli_connect("localhost", "root", "1234", "welt");
    $cat = $cat;
    $date = $date;
    $date_num = date('w',strtotime($date));

    $step_array = array();//걸음수
    $originMonth = date('m',strtotime($date));
    $yoil = array("일","월","화","수","목","금","토");//요일
    $realYoil = array();
    for($i = 0; $i<=$date_num; $i++){
    	$num = 1;
    	if($i != 0){
    		$date = date('Y-m-d',strtotime($date." -".$num." days"));
    	}    	
    	if(date('m',strtotime($date))==$originMonth){
    		if($cat == 1 || $cat == 3){
    			$sql = "SELECT sum(step) FROM ".$uid." WHERE time_z LIKE '".$date."%' AND waist > 0";
    		}elseif ($cat == 2) {
    			$sql = "SELECT avg(waist) FROM ".$uid." WHERE time_z LIKE '".$date."%' AND  waist> 0";
    		}
    		// $userData = mysql_query($sql);
    		// $step_result = (int)mysql_result($userData, 0,0);
    		$userData = mysqli_query($conn, $sql);
    		$step_result_row = mysqli_fetch_row($userData);
    		$step_result = (int)$step_result_row[0];
    		if($step_result == null){
    			$step_result = 0;
    		}
    		if($cat == 3){
    			$sql = "SELECT height, weight FROM body_info WHERE uid = '".$uid."'";
    			// $ret = mysql_query($sql);
    			$retData = mysqli_query($conn, $sql);
    			$ret_result_row = mysqli_fetch_row($retData);
    			$height = (int)$ret_result_row[0];
    			$weight = (int)$ret_result_row[1];
    			$step_result = $step_result*0.0003*$height*$weight*0.01;
    		}
    		array_push($step_array, $step_result);
    		array_push($realYoil,$yoil[date('w',strtotime($date))]);
    	}
    }
    $step_array = array_reverse($step_array);
    $realYoil = array_reverse($realYoil);
    $return_array = array($step_array, $realYoil);
    return $return_array;
}

// 주간별
function getDataset_week($uid,$date, $cat){
	$date = $date;
	$date_num = date('w',strtotime($date)); //4
	$week_data  = array();
	$originMonth = date('m',strtotime($date)); // 06
	$cnt = 0;

	$realYoil = array();
	while(date('m',strtotime($date))==$originMonth){ // 06 == 06
		$currentWeek = getDataset_day($uid, $date, $cat);

		if($cat == 2){
			$waistData = $currentWeek[0];
			$arrayCnt = count($waistData);
			$sum = 0;
			$cnt = 0;
			for($i = 0; $i<$arrayCnt; $i++){
				if($waistData[$i] != 0){
					$sum += $waistData[$i];
					$cnt++;
				}
			}
			if($cnt == 0){
				$currentWeek = 0;
			}else{
				$currentWeek = $sum/$cnt;
			}
		}else{
			$currentWeek = array_sum($currentWeek[0]);
		}
		array_push($week_data, $currentWeek);
		$date_num = date('w',strtotime($date));
		$date = date("Y-m-d", strtotime($date." -".($date_num+1)."days"));
	}
	for($i = count($week_data); $i>0; $i--){
		$ju = $originMonth."-".$i;
		array_push($realYoil, $ju);
	}
	$week_data = array_reverse($week_data);
	$realYoil = array_reverse($realYoil);
	$result = array($week_data, $realYoil);

	return $result;
}


// 월별
function getDataset_month($uid,$date, $cat){
	$date = $date;
	$month_data  = array();
	$originYear = date('Y',strtotime($date)); // 2019
	$monthStr = array();
	while(date('Y',strtotime($date))==$originYear){
		$currentMonth = getDataset_week($uid, $date, $cat); //6월 걸음 수

		if($cat == 2){
			$waistData = $currentMonth[0];
			$arrayCnt = count($waistData);
			$sum = 0;
			$cnt = 0;
			for($i = 0; $i<$arrayCnt; $i++){
				if($waistData[$i] != 0){
					$sum += $waistData[$i];
					$cnt++;
				}
			}
			if($cnt == 0){
				$currentMonth = 0;
			}else{
				$currentMonth = $sum/$cnt;
			}
		}else{
			$currentMonth = array_sum($currentMonth[0]);
		}

		array_push($month_data, $currentMonth);
		array_push($monthStr, date('n',strtotime($date)));
		if(date('m',strtotime($date))=='01'){
			break;
		}
		$date = date("Y-m", strtotime($date))."-1"; // 2019-06-01
		$date = date("Y-m-d", strtotime($date." -1 month")); // 2019-05-01
		$last = date("t", strtotime($date)); // 31
		$date = date("Y-m", strtotime($date))."-".$last; // 2019-05-31

	}
	$month_data = array_reverse($month_data);
	$monthStr = array_reverse($monthStr);
	$result = array($month_data, $monthStr);
	return $result;
}

?>