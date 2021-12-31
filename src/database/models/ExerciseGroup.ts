import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"

import { WorkoutBlueprint, ExerciseAndExcerciseGroup } from './'

@Table
class ExerciseGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  group_id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  order: number;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  name: string;

  @ForeignKey(() => WorkoutBlueprint)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  blueprint_id: number;

  @BelongsTo(() => WorkoutBlueprint, 'blueprint_id')
  blueprint: WorkoutBlueprint;

  @HasMany(() => ExerciseAndExcerciseGroup)
  exercise_and_exercise_groups: ExerciseAndExcerciseGroup[];
}

export default ExerciseGroup;