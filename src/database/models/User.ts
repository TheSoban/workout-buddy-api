import { Model, Table, Column, AutoIncrement, PrimaryKey, IsIn, AllowNull, DataType, Default, HasOne } from "sequelize-typescript"

import { GithubUser } from './'

@Table
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  user_id: number;

  @AllowNull(false)
  @IsIn([["local", "github", "facebook", "google"]])
  @Column(DataType.STRING(8))
  provider: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  disabled: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  completed: boolean;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  role: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  height: number;

  @AllowNull(true)
  @IsIn([["M", "F", "O"]])
  @Column(DataType.STRING(1))
  sex: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  date_of_birth: string;

  @HasOne(() => GithubUser, 'user_id')
  github_user: GithubUser;
}

export default User;