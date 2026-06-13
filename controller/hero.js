const Hero = require('../models/Hero');

exports.addHero = async (req, res, next) => {
  try {
    const { title, name, description } = req.body;

    const hero = await Hero.findOneAndUpdate(
      {},                             
      { title, name, description },
      { new: true, upsert: true, runValidators: true } 
    );

    res.status(200).json({ message: 'Hero updated successfully', hero });
  } catch (error) {
    next(error);
  }
};

exports.getHero = async (req, res, next) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) {
      return res.status(404).json({ message: 'No hero found' });
    }
    res.status(200).json(hero);
  } catch (error) {
    next(error);
  }
};