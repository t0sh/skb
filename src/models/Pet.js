import mongoose from 'mongoose';
import _ from 'lodash';
const { Schema } = mongoose;

const petSchema = new Schema({
  type: {
    type: String,
    enum: ['cat', 'dog'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

petSchema.methods.toJSON = function () {
  return _.pick(this, ['name', 'type', 'owner']);
};

export default mongoose.model('Pet', petSchema);
