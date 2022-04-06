import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"

import { User } from './'

@Table
class LocalUser extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  local_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  username: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  avatar_url: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  password: string;

  @AllowNull(false)
  @Column(DataType.STRING(12))
  salt: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: number;

  @BelongsTo(() => User, 'user_id')
  user: User;
}

export default LocalUser;