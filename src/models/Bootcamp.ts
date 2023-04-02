import { model, Schema, Types } from "mongoose";
import slugify from "slugify";
import geocoder from "../utils/geocoder";

export interface IBootcamp {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
    formattedAddress: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  careers: string[];
  averageRating: number;
  averageCost: number;
  photo: string;
  housing: boolean;
  jobAssistance: boolean;
  jobGuarantee: boolean;
  acceptGi: boolean;
  createdAt?: Date;
  user: Types.ObjectId;
  id: string;
}

const BootcampSchema = new Schema<IBootcamp>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
/*CREATE BOOTCAMP SLUG FROM THE NAME */
BootcampSchema.pre<IBootcamp>("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**CASCADE DELETE COURSES WHEN A BOOTCAMP IS DELETED */
BootcampSchema.pre<IBootcamp>("remove", async function (next) {
  await model("Course").deleteMany({ bootcamp: this._id });
  next();
});

/*REVERSE POPULATE WITH VIRTUALS */
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

/*GEOCODE & CREATE LOCATION FIELD*/
BootcampSchema.pre<IBootcamp>("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [Number(loc[0].longitude), Number(loc[0].latitude)],
    formattedAddress: String(loc[0].formattedAddress),
    street: String(loc[0].streetName),
    city: String(loc[0].city),
    state: String(loc[0].stateCode),
    zipcode: String(loc[0].zipcode),
    country: String(loc[0].countryCode),
  };

  // Do not save address in DB
  this.address = "";
  next();
});

const Bootcamp = model<IBootcamp>("Bootcamp", BootcampSchema);
export default Bootcamp;
