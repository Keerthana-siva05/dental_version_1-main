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
  academicYear: {  // New field for storing the year (1, 2, 3, 4)
    type: Number,
    required: true,
    min: 1,
    max: 4
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

// Add a virtual property to get the formatted year (1st, 2nd, etc.)
resourceSchema.virtual('formattedYear').get(function() {
  const suffixes = ['st', 'nd', 'rd', 'th'];
  const suffix = this.academicYear <= 3 ? suffixes[this.academicYear - 1] : 'th';
  return `${this.academicYear}${suffix} Year`;
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;