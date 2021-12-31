import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"

import { WorkoutLog, ExerciseAndExcerciseGroup } from './'

@Table
class SetLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  set_id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  in_exercise_order: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  repetitions: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  value: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  unit: string;

  @ForeignKey(() => WorkoutLog)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  log_id: number;

  @BelongsTo(() => WorkoutLog, 'log_id')
  workout_log: WorkoutLog;

  @ForeignKey(() => ExerciseAndExcerciseGroup)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  junction_id: number;

  @BelongsTo(() => ExerciseAndExcerciseGroup, 'junction_id')
  exercise_and_exercise_group: ExerciseAndExcerciseGroup;
}

export default SetLog;