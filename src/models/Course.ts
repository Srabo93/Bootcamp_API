import { model, Schema, Model, Types } from "mongoose";

interface Course {
  title: string;
  description: string;
  weeks: string;
  tuition: string;
  minimumSkill: string;
  scholarshipAvailable: boolean;
  createdAt?: Date;
  user: Types.ObjectId;
  bootcamp: Types.ObjectId;
}

interface CourseModel extends Model<Course> {
  getAverageCost(bootcampId: Schema.Types.ObjectId): string;
  bootcamp: Schema.Types.ObjectId;
}

const CourseSchema = new Schema<Course, CourseModel>({
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

const Course = model<Course, CourseModel>("Course", CourseSchema);

/*Call getAverageCost after save */
CourseSchema.post<CourseModel>("save", function (next) {
  this.getAverageCost(this.bootcamp);
  next();
});

/*Call getAverageCost before remove */
CourseSchema.pre<CourseModel>("remove", function (next) {
  this.getAverageCost(this.bootcamp);
  next();
});

export default Course;
