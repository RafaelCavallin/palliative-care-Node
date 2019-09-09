import * as Yup from 'yup';
import Patient from '../models/Patient';

class PatientController {
  async show(req, res) {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      return res.status(401).json({ error: 'Paciente não encontrado' });
    }

    if (patient.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você só pode visualizar os dados dos seus pacientes' });
    }

    const { id, name, medical_record, borned, contact, service } = patient;

    return res.json({ id, name, medical_record, borned, contact, service });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const AllPatients = await Patient.findAll({
      where: { user_id: req.userId },
      order: ['name'],
      attributes: ['name', 'medical_record', 'borned', 'contact', 'service'],
      limit: 5,
      offset: (page - 1) * 5,
    });

    return res.json(AllPatients);
  }

  async store(req, res) {
    // Validação de dados com Yup.
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      medical_record: Yup.string(),
      borned: Yup.date(),
      contact: Yup.string(),
      service: Yup.string(),
      user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação dos dados' });
    }

    const patient = await Patient.create(req.body);

    const { name, medical_record, borned, contact, service } = patient;

    return res.json({
      name,
      medical_record,
      borned,
      contact,
      service,
    });
  }

  async update(req, res) {
    // Validação de dados com Yup.
    const schema = Yup.object().shape({
      name: Yup.string(),
      medical_record: Yup.string(),
      borned: Yup.date(),
      contact: Yup.string(),
      service: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação dos dados' });
    }

    const patient = await Patient.findByPk(req.params.id);

    if (patient.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você só pode alterar os dados dos seus pacientes' });
    }

    const {
      id,
      name,
      medical_record,
      borned,
      contact,
      service,
    } = await patient.update(req.body);

    return res.json({ id, name, medical_record, borned, contact, service });
  }

  async delete(req, res) {
    const patient = await Patient.findByPk(req.params.id);

    if (patient.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você só pode deletar seus pacientes' });
    }

    patient.destroy();

    return res.json(true);
  }
}

export default new PatientController();
