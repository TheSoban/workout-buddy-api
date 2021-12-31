import { Model, Table, Column, AutoIncrement, PrimaryKey, IsIn, AllowNull, DataType, Default, HasOne, HasMany } from "sequelize-typescript"

import { 
  GithubUser, GoogleUser, FacebookUser, LocalUser, 
  BodyMeasurement, Comment, WorkoutBlueprint, WorkoutLog,
  Exercise
} from './'

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

  @HasOne(() => GoogleUser, 'user_id')
  google_user: GoogleUser;

  @HasOne(() => FacebookUser, 'user_id')
  facebook_user: FacebookUser;

  @HasOne(() => LocalUser, 'user_id')
  local_user: LocalUser;

  @HasMany(() => BodyMeasurement)
  measurements: BodyMeasurement[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => WorkoutBlueprint)
  blueprints: WorkoutBlueprint[];

  @HasMany(() => WorkoutLog)
  workout_logs: WorkoutLog[];

  @HasMany(() => Exercise)
  created_exercises: Exercise[];
}

export default User;