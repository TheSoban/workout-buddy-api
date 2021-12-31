import { Model, Table, Column, AutoIncrement, PrimaryKey, AllowNull, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"

import { User, Exercise } from './'

@Table
class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  comment_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(300))
  content: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  author_id: number;

  @BelongsTo(() => User, 'author_id')
  author: User;

  @ForeignKey(() => Exercise)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  exercise_id: number;

  @BelongsTo(() => Exercise, 'exercise_id')
  exercise: Exercise;
}

export default Comment;