const express = require('express');
const https = require('node:https');    

const app = express();

const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname + '/assets/images')); 
app.use(express.static(__dirname + '/css')); 

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});


app.post('/',(req,res)=>{
    const {email,firstname,lastname} = req.body;

    console.log(email,firstname,lastname);


    const Data = {
        members:[
            {
                email_address:email,
                email_type:"html",
                status: "subscribed",
                merge_fields:{
                    FNAME:firstname,
                    LNAME:lastname
                }
            }
        ]
    }

    const jsonData = JSON.stringify(Data);

const URL  = "https://us8.api.mailchimp.com/3.0/lists/19f1055a50"
const options = {
    method: "POST",
    auth: "ariana:a7a3d7e98a4885f0f109e7fba5fec830-us8",
}
   const request = https.request(URL,options,(response)=>{  
     if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }else{
                res.sendFile(__dirname + "/failure.html");
            } 
        response.on('data',(data)=>{
            let responseData = JSON.parse(data);
            console.log(responseData);

           
        })
     
       
    })
     

    request.write(jsonData);
    request.end();
})


app.post('/failure',(req,res)=>{
    res.redirect("/");
})





app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is running on port ${PORT}`);
})