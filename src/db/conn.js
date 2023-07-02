const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology:true,
useNewUrlParser: true}).then(()=>console.log("Connection Successfull")).catch((e)=>console.log(e));