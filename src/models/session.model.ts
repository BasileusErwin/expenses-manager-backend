import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserModel } from '.';

@Table({ modelName: 'sessions', paranoid: true })
export class SessionModel extends Model<SessionModel> {
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  public sessionId: string;

  @Column({ allowNull: false })
  public token: string;

  @Column
  public deletedAt: Date;

  @ForeignKey(() => UserModel)
  @Column
  public userId: string;

  @BelongsTo(() => UserModel, 'user_id')
  public user: UserModel;
}

export default SessionModel;
