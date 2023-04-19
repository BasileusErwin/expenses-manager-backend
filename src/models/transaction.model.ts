import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { TransactionType, CurrencyEnum, MonthEnum } from '../enums';
import { CategoryModel, UserModel } from '.';
import FinancialGoalModel from './financial_goals.model';

@Table({ modelName: 'transactions', paranoid: true })
export class TransactionModel extends Model<TransactionModel> {
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  public transactionId: string;

  @Column({ allowNull: false })
  public type: TransactionType;

  @Column({ allowNull: false })
  public amount: number;

  @Column({ allowNull: false })
  public currency: CurrencyEnum;

  @Column({ allowNull: true })
  public note: string;

  @Column({
    allowNull: true,
  })
  public day: number;

  @Column({
    allowNull: false,
  })
  public month: MonthEnum;

  @Column({
    allowNull: false,
  })
  public year: number;

  @Column({
    allowNull: true,
  })
  public exchangeRate: number;

  @Column
  public deletedAt: Date;

  @ForeignKey(() => UserModel)
  @Column
  public userId: string;

  @BelongsTo(() => UserModel, 'user_id')
  public user: UserModel;

  @ForeignKey(() => CategoryModel)
  @Column
  public categoryId: string;

  @BelongsTo(() => CategoryModel)
  public category: CategoryModel;

  @ForeignKey(() => FinancialGoalModel)
  @Column
  public goalId: string;

  @BelongsTo(() => FinancialGoalModel)
  public financialGoal: FinancialGoalModel;
}

export default TransactionModel;
