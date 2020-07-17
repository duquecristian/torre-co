<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8"> 
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connect to the World</title>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    
    <style>
        body{
            background: #010101;
        }
        main{
            text-align: center;
        }
        .slogan {
            font-weight: bold;
            font-size: 1.4em;
        }
        .features {
            padding: 1em;
            position: relative;
        }
        .feature-title {
            color: #333;
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        #filter{
            height: 3em;
            width: 26em;
        }
    </style>
</head>
<body>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
    <main>
    <header class="page-header header container-fluid">
        <img src="images/Torre_icon.png"/>
        <br/>
        <label class="slogan">Looking for job? or filling a vacancy?</label>
    </header>
    
    <input type="text" id="filter" placeholder="keywords" class="txtBig"/>
    <button class="btn btn-outline-secondary btn-lg" id="search" onclick="bio()">Find</button>

    <div class="features card-deck mb-3">
        <div class="card mb-4">
            <div class="card-header">
                <h3 class="feature-title">People</h3>
            </div>
            <div class="card-body">
                content
            </div>
        </div>
        <div class="card mb-4">
        <div class="card-header">
                <h3 class="feature-title">Opportunities</h3>
            </div>
            <div class="card-body">
                content
            </div>
        </div>
    </div>

    </main>
</body>
</html>