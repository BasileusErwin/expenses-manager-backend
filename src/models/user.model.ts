import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { CategoryModel, FinancialGoalModel, SessionModel, TransactionModel } from '.';

@Table({
  modelName: "users",
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

  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  public email: string;

  @Column({ allowNull: false, type: DataType.STRING })
  public firstName: string;

  @Column({ allowNull: false, type: DataType.STRING })
  public lastName: string;

  @Column({ allowNull: false, type: DataType.STRING })
  public password: string;

  @Column({ type: DataType.DATE })
  public deletedAt: Date;

  @HasMany(() => SessionModel, "user_id")
  public sessions: SessionModel[];

  @HasMany(() => TransactionModel, "user_id")
  public trasactions: TransactionModel[];

  @HasMany(() => CategoryModel, "user_id")
  public categories: CategoryModel[];

  @HasMany(() => FinancialGoalModel, "user_id")
  public financialGoals: FinancialGoalModel[];
}

export default UserModel;
