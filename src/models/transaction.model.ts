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

  @Column({ allowNull: false, type: DataType.ENUM(...Object.values(TransactionType)) })
  public type: TransactionType;

  @Column({ allowNull: false, type: DataType.STRING })
  public amount: number;

  @Column({ allowNull: false, type: DataType.STRING })
  public currency: CurrencyEnum;

  @Column({ allowNull: true, type: DataType.STRING })
  public note: string;

  @Column({
    allowNull: true, type: DataType.STRING
  })
  public day: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(MonthEnum))
  })
  public month: MonthEnum;

  @Column({
    allowNull: false,
    type: DataType.INTEGER
  })
  public year: number;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE
  })
  public exchangeRate: number;

  @Column({ type: DataType.DATE })
  public deletedAt: Date;

  @ForeignKey(() => UserModel)
  @Column({type: DataType.UUIDV4})
  public userId: string;

  @BelongsTo(() => UserModel, 'user_id')
  public user: UserModel;

  @ForeignKey(() => CategoryModel)
  @Column({type: DataType.UUIDV4})
  public categoryId: string;

  @BelongsTo(() => CategoryModel)
  public category: CategoryModel;

  @ForeignKey(() => FinancialGoalModel)
  @Column({type: DataType.UUIDV4})
  public goalId: string;

  @BelongsTo(() => FinancialGoalModel)
  public financialGoal: FinancialGoalModel;
}

export default TransactionModel;
