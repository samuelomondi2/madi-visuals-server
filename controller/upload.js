const cloudinary    = require('../config/cloudinary');
const filesService  = require('../services/fileService'); 

exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map((file) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      })
    );

    const results    = await Promise.all(uploadPromises);
    const savedFiles = await Promise.all(
      results.map((file) =>
        filesService.createFile({
          media_url:  file.secure_url,
          media_type: file.resource_type === 'video' ? 'video' : 'image',
          public_id:  file.public_id,
          size:       file.bytes,
          is_hero:    false,
        })
      )
    );

    res.status(200).json({ success: true, message: 'Files uploaded successfully', data: savedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await filesService.getAllFiles();
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch files', error: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await filesService.getFileById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    await cloudinary.uploader.destroy(file.public_id, {
      resource_type: file.media_type === 'video' ? 'video' : 'image',
    });

    await filesService.deleteFile(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
};

exports.getHero = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type || !['image', 'video'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Valid type (image or video) is required' });
    }
    const hero = await filesService.getHero(type);
    res.status(200).json({ success: true, hero });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch hero' });
  }
};

exports.setHero = async (req, res) => {
  try {
    const { id, type } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'Media ID is required' });
    if (!type || !['image', 'video'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Valid type (image or video) is required' });
    }

    const file = await filesService.getFileById(id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    await filesService.setHero(id, type);
    res.status(200).json({ success: true, message: 'Hero updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to set hero' });
  }
};