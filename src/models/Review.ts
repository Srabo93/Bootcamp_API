import { model, Schema, Model, Document, Types } from "mongoose";

export interface IReview {
  title: string;
  text: string;
  rating: number;
  createdAt?: Date;
  bootcamp: Types.ObjectId;
  user: Types.ObjectId;
}

interface ReviewModel extends Model<IReview> {
  getAverageRating(bootcampId: Schema.Types.ObjectId): string;
  bootcamp: Schema.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview, ReviewModel>({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1-10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.static("getAverageRating", async function getAverageRating(
  bootcampId
) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
});

const Review = model<IReview, ReviewModel>("Review", ReviewSchema);

/*Call getAverageRating after save */
ReviewSchema.post<ReviewModel>("save", function (next) {
  this.getAverageRating(this.bootcamp);
  next();
});

/*Call getAverageRating before remove */
ReviewSchema.pre<ReviewModel>("remove", function (next) {
  this.getAverageRating(this.bootcamp);
  next();
});
export default Review;
