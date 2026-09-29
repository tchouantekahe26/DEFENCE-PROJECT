import EarlyWarning from './earlyWarning.model.js';

export const getEarlyWarnings = async (req, res) => {
  try {
    const { status, riskType } = req.query;
    const where = {};
    if (status) where.status = status;
    if (riskType) where.riskType = riskType;

    const warnings = await EarlyWarning.findAll({ where });
    res.status(200).json(warnings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEarlyWarning = async (req, res) => {
  try {
    const warning = await EarlyWarning.create(req.body);
    res.status(201).json(warning);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEarlyWarning = async (req, res) => {
  try {
    const { id } = req.params;
    await EarlyWarning.update(req.body, { where: { id } });
    const updated = await EarlyWarning.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
