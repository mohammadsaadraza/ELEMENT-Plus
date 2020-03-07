const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const users=[]
const queries = []

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/home', (req,res)=>{
    res.sendFile(__dirname + '/public/home.html')
})

app.post('/contact', (req, res) => {
  try {
    const query = { email: req.body.email, query: req.body.query }
    queries.push(query)
    console.log(queries)
    // res.redirect('/home')
    res.send("YOUR QUERY HAS BEEN SUBMITTED. WE WILL GET BACK TO YOU SOON!!")
  } catch {
    res.status(500).send("");
  }
});

app.post('/users', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 5)
      const user = { name: req.body.name, email: req.body.email, password: hashedPassword }
      users.push(user)
      console.log(users)
      res.redirect('/home')
    } catch {
      res.status(500).send("");
    }
});
  
app.post('/users/login', async(req, res) => {
    const user = users.find(user => user.email === req.body.email);
    if (user == null) {
      return res.status(400).send('Cannot find user');
    }
    try {
      if( await bcrypt.compare(req.body.password, user.password)) {
        
        res.redirect('/home')
      } else {
        res.send('Not Allowed');
      }
    } catch {
      res.status(500).send();
    }
});


app.use('/video/stream', require('./routes/stream'));

app.use(logger);
app.use(express.static(path.join(__dirname,'public')));

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});