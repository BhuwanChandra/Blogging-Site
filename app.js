const express = require('express');
const app = express();


app.get('/',(req, res) => {
    res.send("This is Home Page");
})

app.listen(1234,()=>{
    console.log("Blogger.tech server started on the port 1234 ");
})
