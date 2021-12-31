import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"

import { Exercise, ExerciseGroup, SetLog } from '.'

@Table
class ExerciseAndExcerciseGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  junction_id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  in_exercise_order: number;

  @ForeignKey(() => Exercise)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  exercise_id: number;

  @BelongsTo(() => Exercise, 'exercise_id')
  exercise: Exercise;

  @ForeignKey(() => ExerciseGroup)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  group_id: number;

  @BelongsTo(() => ExerciseGroup, 'group_id')
  group: ExerciseGroup;

  @HasMany(() => SetLog)
  set_logs: SetLog[];
}

export default ExerciseAndExcerciseGroup;