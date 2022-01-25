import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript"

import { Exercise, ExerciseAndEquipment, User } from './'

@Table
class Equipment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  equipment_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @BelongsToMany(() => Exercise, () => ExerciseAndEquipment)
  exercises: Exercise[];

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  author_id: number;

  @BelongsTo(() => User, 'author_id')
  author: User;
}

export default Equipment;