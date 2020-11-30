<?php
/*
$conn = @mysqli_connect("localhost", "root", "1234", "welt");

$user_id = $_GET['user_id'];
$date = $_GET['date'];
$time = $_GET['time'];

$q = "SELECT sum(step) FROM ".$user_id." WHERE time_z LIKE '".$date."%'";
$data = mysqli_query($conn, $q);
$row = mysqli_fetch_row($data);

if($data) {
echo $row[0];
}
else {
echo "조회 실패";
}

mysqli_close($conn);
*/

$result = getUserData($user_id, $date, $time);
echo json_encode($result);




function getUserData($uid, $date, $time){
   $conn = @mysqli_connect("localhost", "root", "1234", "welt");

   $user_id = $_GET['user_id'];
   $date = $_GET['date'];
   $time = $_GET['time'];

   $q1 = "SELECT sum(step) FROM ".$user_id." WHERE time_z LIKE '".$date."%'";
   $data1 = mysqli_query($conn, $q1);
   $total_step_row = mysqli_fetch_row($data1);
   $total_step = $total_step_row[0];

   $q2 = "SELECT waist FROM ".$user_id." WHERE time_z like '".$date." ".$time."'";
   $waistData = mysqli_query($conn, $q2);
   $current_waist_row = mysqli_fetch_row($waistData);
   $current_waist = $current_waist_row[0];
   
   $q3 = "SELECT * FROM ".$user_id." WHERE waist>0 AND step >=0 AND time_z LIKE '".$date."%'";
   $sittingData = mysqli_query($conn, $q3);
   $cnt_sit = 0;
   while($row = mysqli_fetch_array($sittingData)){
      $cnt_sit+=$row['sitting'];
   }
   $total_sitting = $cnt_sit*30;

   $sql = "SELECT * FROM body_info WHERE uid like '".$user_id."'";
   $userData = mysqli_query($conn, $sql);
   while($row = mysqli_fetch_array($userData)){
      $total_distance += $row['height']*0.00037*$total_step*0.01;
      $total_kal += $total_step*0.0003*$row['height']*$row['weight']*0.01;
   };

   $data = array('calory' => $total_kal, 'step' => (int)$total_step, 'distance' => $total_distance, 'sitting' => $total_sitting, 'waist' => $current_waist);
   mysqli_close($conn);

   return $data;
}

function getUserCurruntWaist($uid, $date, $time){
    $query = "SELECT waist FROM ".$uid." WHERE time_z like '".$date." ".$time."'";
    $userData = mysql_query($query);
    $userData = mysql_result($userData, 0,0);
    return $userData;
}

function getUserSittingTime($uid, $date){
   $sql = "SELECT * FROM ".$uid." WHERE waist>0 AND step >=0 AND time_z LIKE '".$date."%'";
   $userData = mysql_query($sql);

   $cnt_sit = 0;
   while($row = mysql_fetch_array($userData)){
      $cnt_sit+=$row['sitting'];
   }

   return $cnt_sit*30;
}

?>