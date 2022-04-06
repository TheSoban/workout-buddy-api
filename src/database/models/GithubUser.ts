import { Model, Table, Column, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"

import { User } from './'

@Table
class GithubUser extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  github_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  username: string;

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

export default GithubUser;