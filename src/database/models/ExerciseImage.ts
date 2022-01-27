import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"

import { Exercise } from './'

@Table
class ExerciseImage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  image_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  url: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  is_main: boolean;

  @ForeignKey(() => Exercise)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  exercise_id: number;

  @BelongsTo(() => Exercise, 'exercise_id')
  exercise: Exercise;
}

export default ExerciseImage;