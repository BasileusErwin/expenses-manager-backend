import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { SessionModel,TransactionModel } from '.';

@Table({
  modelName: 'users',
  paranoid: true,
})
export class UserModel extends Model<UserModel> {
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  public userId: string;

  @Column({ allowNull: false, unique: true })
  public email: string;

  @Column({ allowNull: false })
  public firstName: string;

  @Column({ allowNull: false })
  public lastName: string;

  @Column({ allowNull: false })
  public password: string;

  @Column
  public deletedAt: Date;

  @HasMany(() => SessionModel, 'user_id')
  public sessions: SessionModel[];

  @HasMany(() => TransactionModel, 'user_id')
  public trasactions: TransactionModel[];
}

export default UserModel;
