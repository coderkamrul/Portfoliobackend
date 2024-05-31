const express =require("express");
const app = express();
const cors = require("cors");
const port=5000
const mongoose = require("mongoose");
const multer =require("multer")
const path =require("path")

mongoose.connect("mongodb+srv://kamrulhasan13020:kamrulhasan13020@crud.q0y6kmc.mongodb.net/crud?retryWrites=true&w=majority&appName=crud").then(()=>{
    console.log("Server is connected");
}).catch(error=> console.log(error))



app.use(express.json());
app.use(cors(
    
));

//user schema

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        tag:{
            type:String,
            require:true
        },
        link:{
            type:String,
            require:true
        },
        desc:{
            type:String,
            require:true
        },
        photo:{
            type:String,
            require:true
        },
    },{timestamps: true}
);
const imageShcema=new mongoose.Schema(
    {
        image:{
            type:String
        }
    }
);

const User = mongoose.model("User",userSchema)
const Images = mongoose.model("Images",imageShcema)

const storage= multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./images")
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
});

const upload= multer({storage})



app.post("/createuser",upload.single('photo'), async(req, res)=>{
    try {
        const {name, tag, link, desc}= req.body;
        const photo= req.file.filename;
        const user=new User({
            name,
            tag,
            link,
            desc,
            photo
        });
        console.log(req.file);
        const userData=await user.save();
        res.send(userData)
    } catch (error) {
        res.send(error)
    }
});

app.use('/images', express.static(path.join(__dirname, 'images')));

//read all user
app.get("/readalluser",async(req, res)=>{
    try {
        const userData=await User.find({});
        res.send(userData)
    } catch (error) {
        res.send(error)
    }
});

//read single user
app.get("/read/:id",async(req, res)=>{
    try {
        const id = req.params.id;
        const user=await User.findById({_id:id});
        res.send(user)
    } catch (error) {
        res.send(error)
    }
});

//update user
app.put('/updateuser/:id', upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        if (req.file) {
            userData.photo = req.file.filename;
        }
        await User.findByIdAndUpdate(id, userData);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

//delete user
app.delete("/deleteuser/:id",async(req, res)=>{
    try {
        const id = req.params.id;
        const user=await User.findByIdAndDelete({_id:id});
        res.send(user)
    } catch (error) {
        res.send(error)
    }
});

  app.listen(port, () => {
    console.log(`Server is running ${port}`)
  })