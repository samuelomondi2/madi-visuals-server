const Contact = require('../models/Contact');

exports.addContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Name, email, phone and message are required' });
    }

    const contact = await Contact.create({ name, email, phone, message });

    await emailRender.sendContactMessagesEmails({
      name,
      email,
      phone,
      message,
    });
    
    res.status(201).json({ message: 'Contact created successfully', contact });
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ is_deleted: false });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

// GET /contacts?status=reviewed&deleted=false
exports.getFilteredContacts = async (req, res, next) => {
  try {
    const { status, deleted } = req.query;

    const filter = {};
    if (status)  filter.status     = status;
    if (deleted) filter.is_deleted = deleted === 'true';

    const contacts = await Contact.find(filter);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

exports.reviewedContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'reviewed' }, 
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact marked as reviewed', contact });
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true }, 
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};