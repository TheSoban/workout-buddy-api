import { Model, Table, Column, AllowNull, DataType, ForeignKey } from "sequelize-typescript"

import { Exercise, Muscle } from './'

@Table
class ExerciseAndMuscle extends Model {
  @AllowNull(false)
  @ForeignKey(() => Exercise)
  @Column(DataType.INTEGER)
  exercise_id: number;

  @AllowNull(false)
  @ForeignKey(() => Muscle)
  @Column(DataType.INTEGER)
  muscle_id: number;
}

export default ExerciseAndMuscle;