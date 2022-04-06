import { Model, Table, Column, AllowNull, DataType, ForeignKey } from "sequelize-typescript"

import { Exercise, ExerciseCategory } from './'

@Table
class ExerciseAndExerciseCategory extends Model {
  @AllowNull(false)
  @ForeignKey(() => Exercise)
  @Column(DataType.INTEGER)
  exercise_id: number;

  @AllowNull(false)
  @ForeignKey(() => ExerciseCategory)
  @Column(DataType.INTEGER)
  category_id: number;
}

export default ExerciseAndExerciseCategory;