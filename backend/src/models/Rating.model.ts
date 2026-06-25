/**
 * Rating Model - Receivers rate donors after a completed donation
 */
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User.model';
import Donation from './Donation.model';

export interface RatingAttributes {
  id: number;
  donationId: number;
  donorId: number;
  receiverId: number;
  rating: number;   // 1-5
  comment?: string;
  createdAt?: Date;
}

interface RatingCreationAttributes extends Optional<RatingAttributes, 'id' | 'comment' | 'createdAt'> {}

class Rating extends Model<RatingAttributes, RatingCreationAttributes> implements RatingAttributes {
  public id!: number;
  public donationId!: number;
  public donorId!: number;
  public receiverId!: number;
  public rating!: number;
  public comment?: string;
  public readonly createdAt!: Date;
}

Rating.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  donationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Donation, key: 'id' } },
  donorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  receiverId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, tableName: 'ratings', timestamps: true, updatedAt: false });

Donation.hasOne(Rating, { foreignKey: 'donationId', as: 'rating' });
Rating.belongsTo(Donation, { foreignKey: 'donationId', as: 'donation' });
Rating.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });
Rating.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export default Rating;
