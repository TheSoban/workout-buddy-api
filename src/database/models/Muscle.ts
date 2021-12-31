import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, BelongsToMany } from "sequelize-typescript"

import { Exercise, ExerciseAndMuscle } from './'

@Table
class Muscle extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  muscle_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @BelongsToMany(() => Exercise, () => ExerciseAndMuscle)
  exercises: Exercise[];
}

export default Muscle;