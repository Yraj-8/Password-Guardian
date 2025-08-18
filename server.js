const express= require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");
const cors = require("cors");
const path = require("path");


const app = express();
app.use(express.json());// use to converrt incoming data into the json 
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

function sh1(password){
    return crypto.createHash('sha1').update(password).digest("hex").toUpperCase();
}
 async function checkPassword(password){
    const hashed=sh1(password);
    const prefix=hashed.slice(0,5);
    const suffix=hashed.slice(5);
     const url = `https://api.pwnedpasswords.com/range/${prefix}`;
  const response = await fetch(url);
  const data = await response.text();
  const lines=data.split("\n");
  for (let i = 0; i < lines.length; i++) {
  const line = lines[i];               
  const parts = line.split(":");       
  const hashSuffix = parts[0];         
  const count = parts[1];              

  if (hashSuffix === suffix) {
    return parseInt(count);            
  }
}
return 0;
 }
app.post("/check",async (req,res)=>{
    try {
        const password=req.body.password
         if (!password) return res.status(400).json({ error: "Password required" });
             const count = await checkPassword(password);

         if (count > 0) {
      res.json({ breached: true, count });
    } else {
      res.json({ breached: false, count: 0 });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
    
})
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));