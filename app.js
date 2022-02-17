const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { sendfile } = require('express/lib/response');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/sign-up.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }]  
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/cd55a8967b";

    const options = {
        method: "POST",
        auth: "Tony1:12f4a41d4dff7e6f67b12adf20738cb2-us14"
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        }else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end()
});

app.post("/failure", (req, res) => {
    res.redirect("/")
});

app.listen(port, () => {
    console.log("Server is currently running on port " + port);
});

// API KEY
// 12f4a41d4dff7e6f67b12adf20738cb2 - us14

// LIST ID
// cd55a8967b