// const mongoose = require('mongoose');

// const { Types } = require("mongoose");

// Import Mongoose

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// Define a schema
const { randomBytes, createHmac } = require('crypto');
const mongoose = require("mongoose");
const { Schema } = mongoose;



const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true // Make sure this option is set if fullName is required
  },
  email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      // required: true // Make sure this option is set if salt is required
  },
password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/face-heroes.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const  salt=randomBytes(16).toString();
  
  const hashedPassword=createHmac("sha256",salt).update(user.password)
  .update(user.password)
  .digest("hex")
  this.salt=salt;
  this.password=hashedPassword;
  next()

});

userSchema.statics.matchPassword = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found!');

  const { salt, password: hashedPassword } = user;

  const userProvidedHash = crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');

  if (hashedPassword !== userProvidedHash) throw new Error('Incorrect Password!');
  
  return { ...user.toObject(), password: undefined, salt: undefined };
};


// userSchema.pre("save", function (next) {
//   const user = this;
//   if (!user.isModified("password")) return;
//   const salt = randomBytes(16).toString();
  
//   const hashedPassword = createHmac("sha256", salt)
//     .update(user.password)
//     .digest("hex");
  
//   user.salt = salt;
//   user.password = hashedPassword;
//   next();
// });

// Create a model


const User = mongoose.model("user", userSchema);

module.exports = User;
