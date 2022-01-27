import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript"

import { WorkoutBlueprint, Exercise } from './'

@Table
class OrderedExercise extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  ordered_exercise_id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  order: number;

  @ForeignKey(() => WorkoutBlueprint)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  blueprint_id: number;

  @BelongsTo(() => WorkoutBlueprint, 'blueprint_id')
  blueprint: WorkoutBlueprint;

  @ForeignKey(() => Exercise)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  exercise_id: number;

  @BelongsTo(() => Exercise, 'exercise_id')
  exercise: Exercise;
}

export default OrderedExercise;