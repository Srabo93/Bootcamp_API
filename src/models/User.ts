import { model, Schema, Model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import * as crypto from "crypto";
import { JWT_EXPIRE, JWT_SECRET } from "../config/config";

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: string;
  createdAt?: Date;
  id: string;
}

interface UserMethods {
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): string;
  getResetPasswordToken(): string;
}

type UserModel = Model<IUser, {}, UserMethods>;

const UserSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please use a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.getSignedJwtToken = function () {
  return sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  /*Hash token and set to resetPasswordToken field */
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  /*Set Expiration */
  this.resetPasswordExpire = String(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
