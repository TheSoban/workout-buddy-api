import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"

import { User, OrderedExercise } from './'

@Table
class WorkoutBlueprint extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  blueprint_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING(300))
  description: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  color: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: number;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @HasMany(() => OrderedExercise)
  ordered_exercises: OrderedExercise[];
}

export default WorkoutBlueprint;