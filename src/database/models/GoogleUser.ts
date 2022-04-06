import { Model, Table, Column, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"

import { User } from './'

@Table
class GoogleUser extends Model {
  @PrimaryKey
  @Column(DataType.STRING(30))
  google_id: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  display_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  family_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  given_name: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  avatar_url: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  email: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: number;

  @BelongsTo(() => User, 'user_id')
  user: User;
}

export default GoogleUser;