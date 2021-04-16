var https = require('https');
var stdin = process.openStdin();
var token = 'gPSTxHJcjL8VYZbcyZHq2GSeM';
var limit = 10;
var page = 1;
var numTrucks = 1;

var date = new Date();
var curTime = date.getHours() + ":" + date.getMinutes();

console.log("\nA List of Open Food Trucks in SF at " 
            + curTime + " on " 
            + date.getDay() + "/" 
            + date.getDate() + "/" 
            + date.getFullYear() 
            + "\n");

function showFoodTrucks(offset) {
    var options = {
        hostname: 'data.sfgov.org',
        path: `/resource/jjew-r69b.json?$$app_token=${token}&dayorder=${date.getDay()}&$where=start24<='${curTime}'%20and%20end24>'${curTime}'&$select=applicant,location&$order=applicant&$limit=${limit}&$offset=${offset}`,
        method: 'GET'
    }
    
    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            var jsonObject = JSON.parse(data);
            var count = jsonObject.length;           
            
            // Print out a page number
            console.log("[Page " + page++ + "]\n");
            console.log("NAME".padEnd(78) + "ADDRESS");
            
            for (i = 0; i < count; i++) {
                // Align right for formatting
                if (numTrucks < 10) {
                    numTrucks = "0" + numTrucks;
                }
                // Display open food trucks
                console.log(numTrucks + " " + jsonObject[i].applicant.padEnd(75) + jsonObject[i].location);
                numTrucks++;
            }

            // For next page
            offset += limit;
            console.log("\nPress any key to continue...");
            nextData(count, offset);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

// Display next iteration
function nextData(count, offset) {
    if (count == limit) {
        // Display only ten food trucks
        stdin.addListener('data', function(d) {
            stdin.removeAllListeners('data');
            showFoodTrucks(offset);
        });
    }
    
    else {
        process.exit();
    }    
}

showFoodTrucks(0);
