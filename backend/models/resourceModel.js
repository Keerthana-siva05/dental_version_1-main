import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'video']
  },
  courseType: {
    type: String,
    required: true,
    enum: ['BDS', 'MDS'],
    default: 'BDS'
  },
  filePath: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;