import mongoose from 'mongoose';
import _ from 'lodash';
const { Schema } = mongoose;

const petSchema = new Schema({
  type: String,
  name: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});
petSchema.methods.toJSON = function() {
  return _.pick(this, ['name', 'type', 'owner'])
}

export default mongoose.model('Pet', petSchema)
