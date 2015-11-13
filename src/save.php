<?php

$graphname = filter_input(INPUT_GET, 'graphname');
$filename = "graphs.txt";
$file = fopen($filename, "a");
if($file === false) {
	echo ("Error");
}
else {
	$graphcontents = filter_input(INPUT_GET, 'graphcontents');
	$tosave = $graphname . ": " . $graphcontents . "\n";
	$success = fwrite($file, $tosave);
	fclose($file);
	if($success) {
		echo("Success");
	}
	else {
		echo("Failed");
	}
}

?>
