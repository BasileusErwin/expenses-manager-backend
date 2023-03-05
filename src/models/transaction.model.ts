import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { TransactionType, CurrencyEnum } from '../enums';
import { CategoryModel, UserModel } from '.';

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
  public date: Date;

  @Column({ allowNull: false })
  public currency: CurrencyEnum;

  @Column({ allowNull: false })
  public note: string;

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
}

export default TransactionModel;
