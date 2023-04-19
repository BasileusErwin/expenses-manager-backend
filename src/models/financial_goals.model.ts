import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { FinancialGoalsType, CurrencyEnum, MonthEnum } from '../enums';
import { TransactionModel, UserModel } from '.';

@Table({ modelName: "financial_goals", paranoid: true })
export class FinancialGoalModel extends Model<FinancialGoalModel> {
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  public goalId: string;

  @Column({ allowNull: false })
  public type: FinancialGoalsType;

  @Column({ allowNull: false })
  public targetAmount: number;

  @Column({ allowNull: false })
  public currency: CurrencyEnum;

  @Column({ allowNull: true })
  public currentAmount: number;

  @Column({ allowNull: false })
  public name: string;

  @Column({ allowNull: true })
  public note: string;

  @Column({
    allowNull: false,
  })
  public month: MonthEnum;

  @Column({
    allowNull: false,
  })
  public year: number;

  @Column
  public deletedAt: Date;

  @ForeignKey(() => UserModel)
  @Column
  public userId: string;

  @BelongsTo(() => UserModel, "user_id")
  public user: UserModel;

  @HasMany(() => TransactionModel, "goal_id")
  public transaction: TransactionModel;
}

export default FinancialGoalModel;
