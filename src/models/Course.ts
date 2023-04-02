import { model, Schema, Model, Types } from "mongoose";

export interface ICourse {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  weeks: string;
  tuition: string;
  minimumSkill: string;
  scholarshipAvailable: boolean;
  createdAt?: Date;
  user: Types.ObjectId;
  bootcamp: Types.ObjectId;
  id: string;
}

interface CourseModel extends Model<ICourse> {
  getAverageCost(bootcampId: Schema.Types.ObjectId): string;
  bootcamp: Schema.Types.ObjectId;
}

const CourseSchema = new Schema<ICourse, CourseModel>({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a course description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: String,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum Skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
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
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

CourseSchema.static("getAverageCost", async function getAverageCost(
  bootcampId
) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
    await model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
});

const Course = model<ICourse, CourseModel>("Course", CourseSchema);

/*Call getAverageCost after save */
CourseSchema.post<CourseModel>("save", function () {
  this.getAverageCost(this.bootcamp);
});

/*Call getAverageCost before remove */
CourseSchema.pre<CourseModel>("remove", function (next) {
  this.getAverageCost(this.bootcamp);
  next();
});

export default Course;
