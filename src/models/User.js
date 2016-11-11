import mongoose from 'mongoose';
import _ from 'lodash';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

userSchema.methods.toJSON = function () {
  return _.pick(this, ['name']);
};

export default mongoose.model('User', userSchema);
