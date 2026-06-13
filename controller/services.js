const Service = require('../models/Services');

exports.addService = async (req, res, next) => {
    try {
        const { name, duration, base_price, delivery, category, is_active } = req.body;

        if (!name || !base_price) {
            return res.status(400).json({ message: 'Name, duration and base_price are required' });
        }

        const service = await Service.create({ name, duration, base_price, delivery, category, is_active });

        res.status(201).json({ message: 'Service added successfully', service });
    } catch (error) {
        next(error);
    }
};

exports.getAllServices = async (req, res, next) => {
    try {
      const services = await Service.find({ is_active: true });
      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
};

exports.getServiceById = async (req, res, next) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
};

exports.updateService = async (req, res, next) => {
    try {
      const { name, duration, base_price, delivery, category, is_active } = req.body;
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        { name, duration, base_price, delivery, category, is_active },
        { new: true, runValidators: true }
      );
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json({ message: 'Service updated successfully', service });
    } catch (error) {
      next(error);
    }
};

exports.deleteService = async (req, res, next) => {
    try {
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        { is_active: false }, 
        { new: true }
      );
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      next(error);
    }
};