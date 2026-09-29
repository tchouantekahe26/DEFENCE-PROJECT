import EmergencyReport from './emergency.model.js';

export const getEmergencies = async (req, res) => {
  try {
    const { status, emergencyType } = req.query;
    const where = {};
    if (status) where.status = status;
    if (emergencyType) where.emergencyType = emergencyType;

    const emergencies = await EmergencyReport.findAll({
      where,
      order: [['id', 'DESC']],
    });
    res.status(200).json(emergencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEmergency = async (req, res) => {
  try {
    const emergency = await EmergencyReport.create(req.body);
    res.status(201).json(emergency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;

    await EmergencyReport.update(updateData, { where: { id } });
    const updated = await EmergencyReport.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
