const express=require("express")
const path=require("path")
const userRoute=require("./routes/user")

const mongoose=require("mongoose");

mongoose.connect('mongodb://localhost:27017/blogify', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const app=express();
const PORT=8000;

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());



app.use('/user', userRoute);


app.get("/",(req,res)=>{
    res.render("Home")

})

app.listen (PORT,()=>{
    console.log(`server started at PORT:${PORT}`)
})


