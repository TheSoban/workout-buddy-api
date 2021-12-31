import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, BelongsToMany } from "sequelize-typescript"

import { Exercise, ExerciseAndExerciseCategory } from './'

@Table
class ExerciseCategory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  category_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @BelongsToMany(() => Exercise, () => ExerciseAndExerciseCategory)
  exercises: Exercise[];
}

export default ExerciseCategory;