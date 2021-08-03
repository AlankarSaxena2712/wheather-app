const http=require("http");
const fs=require("fs");
const axios=require('axios');
const console = require("console");

const homeFile=fs.readFileSync("home.html", "utf-8");

var d = new Date();
const getCurrDay =() =>{
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var n = weekday[d.getDay()];
    return n;
};

const getcurrTime= ()=>{
    var months=[
        "Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"
    ];
    var getmonth=d.getMonth();
    var getdate=d.getDate();

    let hrs=d.getHours();
    let min=d.getMinutes();
    let period="AM";
    if(hrs>11){
        period="PM";
    }
    if(min<10){
        min="0"+min;
    }
    if(getdate<10){
        getdate="0"+getdate
    }
    return ` ${months[getmonth]} ${getdate} | ${hrs}:${min} ${period}`
};

const replaceVal=(tempval,orgval) =>{
    let temp=tempval.replace("{%temp%}",((orgval.main.temp)-273).toFixed(2));
    temp=temp.replace("{%tempmin%}",((orgval.main.temp_min)-273).toFixed(2));
    temp=temp.replace("{%tempmax%}",((orgval.main.temp_max)-273).toFixed(2));
    temp=temp.replace("{%location%}",orgval.name);
    temp=temp.replace("{%country%}",orgval.sys.country);
    temp=temp.replace("{%currDay%}", getCurrDay());
    temp=temp.replace("{%currTime%}", getcurrTime());
    return temp;
};

const server=http.createServer( async (req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write(homeFile);
    if(req.url === "/"){
        const resp = await axios.get("http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=9c7409bca6f5eff3a6280f768ac67c62")
        const Data=[resp.data];
        const realData=Data.map((val)=>replaceVal(homeFile,val)).join("");
        
        res.write(realData);
    }
    res.end();
});

server.listen(3000, '127.0.0.1', () => {
    console.log("Server Started!!!")
});