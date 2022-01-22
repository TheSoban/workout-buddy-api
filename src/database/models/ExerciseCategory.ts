import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript"

import { Exercise, User, ExerciseAndExerciseCategory } from './'

@Table
class ExerciseCategory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  category_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  author_id: number;

  @BelongsTo(() => User, 'author_id')
  author: User;

  @BelongsToMany(() => Exercise, () => ExerciseAndExerciseCategory)
  exercises: Exercise[];
}

export default ExerciseCategory;