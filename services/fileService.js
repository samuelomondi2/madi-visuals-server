const Upload = require('../models/Upload');

exports.createFile = (data) => Upload.create(data);

exports.getAllFiles = () => Upload.find().sort({ createdAt: -1 });

exports.getFileById = (id) => Upload.findById(id);

exports.deleteFile = (id) => Upload.findByIdAndDelete(id);

exports.getHero = (type) =>
  Upload.findOne({ is_hero: true, media_type: type });

exports.setHero = async (id, type) => {
  await Upload.updateMany({ media_type: type, is_hero: true }, { is_hero: false });
  await Upload.findByIdAndUpdate(id, { is_hero: true });
};