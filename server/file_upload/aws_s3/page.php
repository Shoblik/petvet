<?php
$PAGEACCESS = true;

if (!class_exists('S3'))require_once('S3.php');

require_once('credential.php');

if (!defined('awsAccessKey')) define('awsAccessKey', $accessKey);
if (!defined('awsSecretKey')) define('awsSecretKey', $secretKey);


$s3 = new S3(awsAccessKey, awsSecretKey);
$bucketName = 'petvetlfz';


if(isset($_POST['upload'])){

    $fileName = time() . $_FILES['file']['name'];
    $fileTempName = $_FILES['file']['tmp_name'];

    if(!isset($bucketName)){
        $s3->putBucket($bucketName, S3::ACL_PUBLIC_READ);
    }

    if ($s3->putObjectFile($fileTempName, $bucketName, $fileName, S3::ACL_PUBLIC_READ)) {
        echo "We successfully uploaded your file.";
    }else{
        echo "Something went wrong while uploading your file... sorry.";
    }
}

//require_once ('./credential.php');
require_once ('../../file_upload/update_avatar_link_db.php');

//$url = "http://{$bucketName}.s3.amazonaws.com/".$fileName;


?>