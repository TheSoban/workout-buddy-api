import { Model, Table, Column, IsIn, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"

import { WorkoutLog, Exercise } from './'

@Table
class SetLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  set_id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  order: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  repetitions: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  value: number;

  @AllowNull(false)
  @IsIn([['kg', 'lbs']])
  @Column(DataType.STRING(3))
  unit: string;

  @ForeignKey(() => WorkoutLog)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  log_id: number;

  @BelongsTo(() => WorkoutLog, 'log_id')
  workout_log: WorkoutLog;

  @ForeignKey(() => Exercise)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  exercise_id: number;

  @BelongsTo(() => Exercise, 'exercise_id')
  exercise: Exercise;
}

export default SetLog;