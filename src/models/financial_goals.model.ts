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

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(FinancialGoalsType)),
  })
  public type: FinancialGoalsType;

  @Column({ allowNull: false, type: DataType.DOUBLE })
  public targetAmount: number;

  @Column({ allowNull: false, type: DataType.ENUM(...Object.values(CurrencyEnum)) })
  public currency: CurrencyEnum;

  @Column({ allowNull: true, type: DataType.DOUBLE })
  public currentAmount: number;

  @Column({ allowNull: false, type: DataType.STRING })
  public name: string;

  @Column({ allowNull: true, type: DataType.STRING })
  public note: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(MonthEnum)),
  })
  public month: MonthEnum;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public year: number;

  @Column({
    type: DataType.DATE,
  })
  public deletedAt: Date;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUIDV4,
  })
  public userId: string;

  @BelongsTo(() => UserModel, "user_id")
  public user: UserModel;

  @HasMany(() => TransactionModel, "goal_id")
  public transaction: TransactionModel;
}

export default FinancialGoalModel;
