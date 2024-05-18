const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path as needed

// Render the sign-in page
router.get("/signin", (req, res) => {
    return res.render("signin");
});

// Render the sign-up page
router.get("/signup", (req, res) => {
    return res.render("signup");
});


router.post("/signin",async(req,res)=>{
    const {email,password}=req.body;
    const user=User.matchPassword(email,password);
    

    console.log("User",user)
    return res.redirect("/")
})

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Assuming matchPassword returns a Promise
        const user = await User.matchPassword(email, password);

        console.log("User", user);
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        // Handle error appropriately
        return res.status(500).send("Internal Server Error");
    }
});




router.post("/signup", async (req, res) => {
     const { fullName, email, password } = req.body;
    await User.create({
        fullName, email, password
    });
     return res.redirect("/");
})

module.exports = router;


