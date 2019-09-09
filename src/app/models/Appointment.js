import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        date: Sequelize.DATE,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    // this.hasMany(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
    this.belongsTo(models.User, { foreignKey: 'doctor_id', as: 'doctor' });
  }
}

export default Appointment;
