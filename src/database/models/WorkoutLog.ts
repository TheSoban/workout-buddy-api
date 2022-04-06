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

  @AllowNull(false)
  @Column(DataType.DATE)
  date: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  author_id: number;

  @BelongsTo(() => User, 'author_id')
  author: User;

  @HasMany(() => SetLog)
  set_logs: SetLog[];
}

export default WorkoutLog;