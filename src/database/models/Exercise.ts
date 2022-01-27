import { Model, Table, Column, Index, AutoIncrement, PrimaryKey, AllowNull, DataType, HasMany, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript"

import { 
  Comment, ExerciseImage, Equipment, ExerciseAndEquipment, 
  Muscle, ExerciseAndMuscle, ExerciseCategory, ExerciseAndExerciseCategory,
  OrderedExercise, User, SetLog
} from './'

@Table
class Exercise extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  exercise_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  @Index({ type: 'FULLTEXT' })
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING(300))
  description: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  version: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  author_id: number;

  @BelongsTo(() => User, 'author_id')
  author: User;

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => ExerciseImage)
  images: ExerciseImage[];

  @HasMany(() => OrderedExercise)
  ordered_exercises: OrderedExercise[];

  @HasMany(() => SetLog)
  set_logs: SetLog[];

  @BelongsToMany(() => Equipment, () => ExerciseAndEquipment)
  equipment: Equipment[];

  @BelongsToMany(() => Muscle, () => ExerciseAndMuscle)
  muscles: Muscle[];

  @BelongsToMany(() => ExerciseCategory, () => ExerciseAndExerciseCategory)
  categories: ExerciseCategory[];
}

export default Exercise;