<?php
$conn = @mysqli_connect("localhost", "root", "1234", "welt");

$user_id = $_GET['user_id'];
$date = $_GET['date'];
$time = $_GET['time'];


// $sitting_condition = getUserCondition_sitting($user_id, $date);
$q1 = "SELECT * FROM ".$user_id." WHERE waist > 0 AND step >=0 AND time_z LIKE '".$date."%'";
$sittingData = mysqli_query($conn, $q1);
$cnt_sit=0;
while($row = mysqli_fetch_array($sittingData)) {
    if($row['sitting']==1) {
        $cnt_sit+=1;
        if($cnt_sit==4) {
            $cnt_sit = 1;
            break;
        }
    } else {
        $cnt_sit=0;
    }
}
$sitting_condition = $cnt_sit;

// $waist_condition = getUserCondition_waist($user_id, $date);
$q2 = "select * from ".$user_id." where waist>0 and step >=0 and time_z like '".$date."%'";
$waistData = mysqli_query($conn, $q2);
$cnt_waist=0;
$waist_array = array();

while($row = mysqli_fetch_array($waistData)){
    array_push($waist_array,$row['waist']);
}

$max = max($waist_array);
$min = min($waist_array);
$waist_condition = 0;
if($max-$min>=2) {
    $waist_condition = 1;
}

$condition = array('sitting' => $sitting_condition, 'waist' => $waist_condition);
echo json_encode($condition);

?>