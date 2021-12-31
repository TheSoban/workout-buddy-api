import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"

import { User, SetLog } from './'

@Table
class WorkoutLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  log_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: number;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @HasMany(() => SetLog)
  set_logs: SetLog[];
}

export default WorkoutLog;