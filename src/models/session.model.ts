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

  @Column({ allowNull: false, type: DataType.STRING })
  public token: string;

  @Column({ type: DataType.DATE })
  public deletedAt: Date;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUIDV4 })
  public userId: string;

  @BelongsTo(() => UserModel, 'user_id')
  public user: UserModel;
}

export default SessionModel;
