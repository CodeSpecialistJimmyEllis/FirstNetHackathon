$(document).ready(function() {

$.ajax({
    type: 'GET',
    url: "https://api-2445581893456.production.gw.apicast.io/v2/chains/" + chainid + "/entries/last",
   // url: 'https://api-2445581893456.production.gw.apicast.io/v2/',
    //dataType: 'json'
    
    headers: {
        'user-key': '7ba6b9a4901985de2c0e59a7cdcac6df',
        'Content-Type': 'application/json'
    },
    success: function(data) {
// passed function object for data processing 
console.log("get call data");
console.log(data);

 var freedata = Base64.decode(data.data.content);
 freedata = JSON.parse(freedata);
console.log("this is the decoded data");
console.log(freedata);
console.log("calling freedata . speed");
console.log(freedata.speed);
if ( freedata.speed <= 5 )
{
    ubicharge = 10;    
}
else if ((freedata.speed >= 6)&& (freedata.speed <= 10))
{
    ubicharge = 20;
}
else if ((freedata.speed >= 11) && (freedata.speed <= 15))
{
    ubicharge = 25;
}
else if ((freedata.speed >= 16) && (freedata.speed <= 20))
{
    ubicharge = 30;
}

else 
{
    ubicharge = 35;
}

// insert code that puts ubichrage into website
$("#ubiplace").html("$" + ubicharge + ".00 <P id='pleasestyle'>The simulator has concluded that the Use Based Insurance Premium is this amount.</p>");


},
error: function(err) {
console.log('error:' + err)
}

});
                        
});     

%2F = /
https://newgentec.net/api/lab.api.two.way/v4.0/send.sms.php?auth=401593c19ef6e1bd87e4021c72cd622db78dd081&stid=HACK01&body=JESUS+IS+GOD++https%3A%2F%2Fwww.biblegateway.com&tn=%2B17739691648