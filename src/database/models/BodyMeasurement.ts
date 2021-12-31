import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"

import { User } from './'

@Table
class BodyMeasurement extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  measurement_id: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  weight: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(5, 2))
  water_percentage: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(5, 2))
  body_fat: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  visceral_fat: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(5, 2))
  muscle: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(5, 2))
  bone_mass: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: number;

  @BelongsTo(() => User, 'user_id')
  user: User;
}

export default BodyMeasurement;