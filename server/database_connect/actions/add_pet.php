<?php

if(!isset($PAGEACCESS) || $PAGEACCESS===false){
    die('NO DIRECT ACCESS ALLOWED');
}

$query = "INSERT INTO `pets` 
          SET `name` = '$post[name]', `ownerID` = '$post[ownerID]', `avatar` = '$post[avatar]', `created` = CURRENT_TIMESTAMP, 
          `status` = 'active', `DOB` = '$post[dob]', `animal_type` = '$post[breed]', `metadata` = 0, `vet` = 'No vet connected'";

$result = mysqli_query($conn, $query);

if ($result) {
    if (mysqli_affected_rows($conn) > 0) {
        $output['success'] = true;
        $petID = mysqli_insert_id($conn);
        $output['data'] = $petID;
    } else {$output['errors'][] = 'no data available';}
}
else {$output['errors'][] = 'error in query';}
?>