import AcademicSession from './session.model.js';

export const getSessions = async (req, res) => {
  try {
    const sessions = await AcademicSession.findAll();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActiveSession = async (req, res) => {
  try {
    const session = await AcademicSession.findOne({ where: { isActive: true } });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const session = await AcademicSession.create(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    await AcademicSession.update(req.body, { where: { id } });
    const updated = await AcademicSession.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
