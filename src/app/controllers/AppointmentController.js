import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import Patient from '../models/Patient';
import User from '../models/User';

class AppointmentController {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: { doctor_id: req.userId },
      attributes: ['id', 'description', 'date', 'patient_id', 'doctor_id'],
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: [
            'id',
            'name',
            'medical_record',
            'borned',
            'contact',
            'service',
          ],
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['name', 'profission'],
        },
      ],
    });

    res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      patient_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação dos dados' });
    }

    const patient = await Patient.findByPk(req.body.patient_id);

    if (patient.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você só pode alterar os dados das suas consultas' });
    }

    const date = new Date();
    const doctor_id = req.userId;
    const { description, patient_id } = req.body;

    const appointment = await Appointment.create({
      description,
      date,
      patient_id,
      doctor_id,
    });

    return res.json(appointment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
      patient_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação dos dados' });
    }

    const appointment = await Appointment.findByPk(req.params.id);

    if (appointment.doctor_id !== req.userId) {
      return res.status(401).json({
        error:
          'Você só pode alterar os dados das suas consultas dos seus pacientes',
      });
    }

    const {
      id,
      description,
      date,
      patient_id,
      doctor_id,
    } = await appointment.update(req.body);

    return res.json({ id, description, date, patient_id, doctor_id });
  }

  async delete(req, res) {
    // Não deletar a consulta do banco, apenas marcar como "cancelada".
    return res.json(req.body);
  }
}

export default new AppointmentController();
