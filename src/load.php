<?php

$graphname = filter_input(INPUT_GET, 'graphname');
$filename = "graphs.txt";
$file = fopen($filename, "r");
if($file == false) {
	echo ("Error");
}
else {
	$filesize = filesize($filename);
	$filecontents = fread($file, $filesize);
	fclose($file);
	echo ($filecontents);
}

?>
