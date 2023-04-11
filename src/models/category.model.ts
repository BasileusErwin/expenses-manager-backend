import { TransactionModel, UserModel } from '.';
import { TransactionType } from '../enums';
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';

@Table({ modelName: 'categories', paranoid: true })
export class CategoryModel extends Model<CategoryModel> {
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  public categoryId: string;

  @Column({
    allowNull: false,
  })
  public type: TransactionType;

  @Column({
    allowNull: false,
  })
  public name: string;

  @Column({ allowNull: true })
  public note: string;

  @HasMany(() => TransactionModel, 'category_id')
  public trasactions: TransactionModel[];

  @ForeignKey(() => UserModel)
  @Column
  public userId: string;

  @BelongsTo(() => UserModel, 'user_id')
  public user: UserModel;
}

export default CategoryModel;
