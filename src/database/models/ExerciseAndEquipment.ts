import { Model, Table, Column, AllowNull, DataType, ForeignKey } from "sequelize-typescript"

import { Exercise, Equipment } from './'

@Table
class ExerciseAndEquipment extends Model {
  @AllowNull(false)
  @ForeignKey(() => Exercise)
  @Column(DataType.INTEGER)
  exercise_id: number;

  @AllowNull(false)
  @ForeignKey(() => Equipment)
  @Column(DataType.INTEGER)
  equipment_id: number;
}

export default ExerciseAndEquipment;