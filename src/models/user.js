import mongoose from "./index.js";

let UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      maxlength: 20,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 5,
      select: true, //Exclude from select query results by default(When any developer writes a select query ,then password field is excluded from the result)
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (value) => validateEmail(value),
      },
    },
    mobileNumber: {
      type: Number,
      required: [true, "MobileNumber is required"],
      trim: true,
    },
    role: {
      type: [String],
      default: ["admin"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  });
  
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  
  export const UserModel = mongoose.model("User", UserSchema);