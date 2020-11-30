<?php
$conn = @mysqli_connect("localhost", "root", "1234", "welt");

$userId = $_GET['user_id'];
$category = $_GET['category'];
$nowDate = $_GET['date'];

$userAge;
$userGender;
$sameAgeUidList = array();
$userQeury = "SELECT * FROM body_info WHERE uid = '".$userId."'";
$userData = mysqli_query($conn, $userQeury);
while($row = mysqli_fetch_array($userData)){
	$userAge = (date('Y')-$row['age'])+1;
	$userGender = $row['male'];
};
$ageRange = ($userAge-($userAge%10));
	// 같은 나이대 구하기

$ageQeury = "SELECT * FROM body_info WHERE ".date('Y')."-age BETWEEN ".$ageRange." and ".($ageRange+9)." AND male = ".$userGender;
$sameAgeUserData = mysqli_query($conn, $ageQeury);

$ranking;

switch($category){
	case '0': {
	// $ranking = getRankingStep($sameAgeUserData, $nowDate);
            $step_ranking = array();
	$currentDate = $nowDate;
	while($row = mysqli_fetch_array($sameAgeUserData)){
		$query = "SELECT sum(step) FROM ".$row['uid']." WHERE time_z LIKE '".$currentDate."%'";
		$stepData = mysqli_query($conn, $query);
                        $step_row = mysqli_fetch_row($stepData);
		$step_result = $step_row[0];
		if(empty($step_result)){
			continue;	
		}
		$step_ranking[$row['uid']] = $step_result;
	};
	// 내림차순
	arsort($step_ranking);
	$ranking = $step_ranking;
            }
	break;
	case '1': {
	//$ranking = getRankingWaist($sameAgeUserData, $nowDate, $time);
            $waist_ranking = array();
	$currentDate = $nowDate;
	while($row = mysqli_fetch_array($sameAgeUserData)){
		$query = "SELECT waist FROM ".$row['uid']." WHERE time_z Like '".$currentDate."%' AND waist > 0";
		$waistData = mysqli_query($conn, $query);
		while ($row2 = mysqli_fetch_array($waistData)) {
			$waist_ranking[$row['uid']] = $row2['waist'];
		}
	}
	asort($waist_ranking);
	$ranking = $waist_ranking;
            }
	break;
	case '2': {
	// $ranking = getRankingCalories($sameAgeUserData, $nowDate);
            $calory_ranking = array();
	$currentDate = $nowDate;
	while($row = mysqli_fetch_array($sameAgeUserData)){
		$query = "SELECT sum(step) FROM ".$row['uid']." WHERE time_z LIKE '".$currentDate."%'";
		$stepData = mysqli_query($conn, $query);
		$step_row = mysqli_fetch_row($stepData);
		$step_result = $step_row[0];
		
		$calory = $step_result*0.0003*$row['height']*$row['weight']*0.01;
		$calory_ranking[$row['uid']] = $calory;
	}
	arsort($calory_ranking);
	$ranking = $calory_ranking;
            }
	break;
}

$myRank = array();
$cnt = 1;
foreach ($ranking as $key => $value) {
	if($cnt<6){
		$rankingArray[] = array('rank' => $cnt, 'user_id' => $key, 'value' => $value);
	}
	if($key == $userId){
		array_push($myRank, $rankingArray[$cnt-1]);
	}
	$cnt++;
}

function han ($s) { return reset(json_decode('{"s":"'.$s.'"}')); }
function to_han ($str) { return preg_replace('/(\\\u[a-f0-9]+)+/e','han("$0")',$str); }

$json = array("user_rank"=>$myRank, "top5 rank"=>$rankingArray);
echo json_encode($json);

?>



