<?php

if(!isset($PAGEACCESS) || $PAGEACCESS===false){
    die('NO DIRECT ACCESS ALLOWED');
}

$email = $post['vetEmail'];
$refNum = $post['refNum'];
$ownerID = $post['ownerID'];
$petID = $post['petID'];
$oldVetName = $post['oldVetName'];
$hasID = false;
$hasPetID = false;
$vetName = null;

$query = "SELECT * FROM `vets` 
          WHERE `ref_ID` = '$refNum' 
          AND `email` = '$email'";

$result = mysqli_query($conn, $query);

class OwnerObj  {
    public $ownerID;
    public $petID;
}

function createNewDataObj($ownerID, $petID) {
    $tmpObj = new OwnerObj();
    $tmpObj->ownerID = $ownerID;
    $tmpObj->petID = [$petID];

    return $tmpObj;
}

function storeActivePets($res, $refNum, $conn) {
    $res = json_encode($res);

    $query = "UPDATE `vets` SET `active_pets` = '$res' 
              WHERE `ref_ID` = '$refNum'";

    $result = mysqli_query($conn, $query);
    return $result;
}

if ($result) {
    if (mysqli_num_rows($result) > 0) {
        $output['success'] = true;
        if ($result) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $petStr = $row['active_pets'];
                    $vetName = $row['name'];
                    if ($petStr === "NULL") {
                        $output['errors'][] = 'No active pets';
                        $res = createNewDataObj($ownerID, $petID);
                        $res = array($res);
                        $result = storeActivePets($res, $refNum, $conn);
                        if ($result) {
                            $output['success'] = true;
                        } else {
                            $output['success'] = false;
                        }
                    } else {
                        $petObj = json_decode($petStr);
                        $ownerCount = count($petObj);
                        for ($i = 0; $i < $ownerCount; $i++) {
                            if ($petObj[$i]->ownerID === $ownerID) {
                                $ownerIndex = $i;
                                $hasID = true;
                                $petCount = count($petObj[$ownerIndex]->petID);
                                for ($k = 0; $k < $petCount; $k++) {
                                    if ($petObj[$ownerIndex]->petID[$k] === $petID) {
                                        $hasPetID = true;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    if (!$hasID) {
                            $output['data'][] = 'new owner';
                            $res = createNewDataObj($ownerID, $petID);
                            $petObj[] = $res;
                            $result = storeActivePets($petObj, $refNum, $conn);
                            if ($result) {
                                $output['success'] = true;
                            } else {
                                $output['success'] = false;
                            }
                        } else if ($hasID && $hasPetID === false) {
                            $output['data'][] = 'same owner new pet';
                            $petObj[$ownerIndex]->petID[] = $petID;
                            $result = storeActivePets($petObj, $refNum, $conn);
                            if ($result) {
                                $output['success'] = true;
                            } else {
                                $output['success'] = false;
                            }
                        } else {
                            $output['data'][] = 'the pet is already filed under the vets account';
                        }
                    }
                }
            }
        } else {
            $output['errors'][] = 'Error in SQL query';
        }

    } else {
        $output['errors'][] = 'No data available';
    }
    //add vet name to pet table
    if ($vetName !== null) {

        $query = "UPDATE `pets` SET `vet` = '$vetName' 
                  WHERE `ID` = $petID";

        $result = mysqli_query($conn, $query);

        if ($result) {
            if (mysqli_affected_rows($conn) > 0) {
                $output['success'] = true;
            }
        } else {
            $output['errors'][] = 'Error in SQL query';
            $output['success'] = false;

        }
    }

require('./actions/update_delete_pet_from_vet.php');

?>
