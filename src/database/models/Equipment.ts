import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, BelongsToMany } from "sequelize-typescript"

import { Exercise, ExerciseAndEquipment } from './'

@Table
class Equipment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  equipment_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @BelongsToMany(() => Exercise, () => ExerciseAndEquipment)
  exercises: Exercise[];
}

export default Equipment;