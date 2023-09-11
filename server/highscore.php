<?php

header("Access-Control-Allow-Origin: *");

include "connection.php";

$sql = "SELECT * FROM highscore ORDER BY score asc LIMIT 10";

$result = mysqli_query($conn, $sql);
if (!$result) {
    printf("Error: %s\n", mysqli_error($conn));
    exit;
}
?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Highscore</title>
</head>
<style>
    body {
        background-color: #123456;
    }
    
    th, td {
        color: #ffffff;
        font-size: 35px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    table, td, th { 
        border: 2px solid white;
        border-collapse: collapse;
        padding-left: 50px;
        padding-right: 50px;
    }

    tr {
        background-color:#444444;
    }

    th {
        background-color:#336633;
    }

    p {
        text-align: center;
        font-size: 55px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #ffffff;
    }

    .container {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input[type=button], input[type=submit], input[type=reset], input[type=text] {
        background-color: #333333;
        border: 2px solid #ffffff;
        border-radius: 4px;
        color: white;
        padding: 10px 40px;
        font-size:24px;
        text-decoration: none;
        margin: 0;
        cursor: pointer;
        width: 200px;
        margin-right: 20px;
        margin-top: 20px;
    }

    .right {
        text-align: right;
    }


</style>
<body>
    <div class="container">
        <div>
            <p>Highscore</p>
            <table>
                <tr>
                    <th>Nr</td>
                    <th>Player</td>
                    <th>Score</td>
                </tr>
                <?php $nr=1;?>
                <?php while($r = mysqli_fetch_assoc($result)): ?>
                    <tr>
                        <td class="right"><?=$nr?></td>
                        <td><?=$r["player"]?></td>
                        <td class="right"><?=number_format($r["score"], 3)?></td>
                    </tr>
                    <?php $nr+=1;?>
                <?php endwhile ?>

                <?php while($nr < 11): ?>
                    <tr>
                        <td class="right"><?=$nr?></td>
                        <td>&nbsp;</td>
                        <td class="right">&nbsp;</td>
                    </tr>
                    <?php $nr+=1;?>
                <?php endwhile ?>
            </table>
            <input onclick="location.href='game.html?15'" type="button" value="Nyt spil">
        </div>
      </div>
</body>
</html>