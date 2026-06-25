/**
 * Match Model
 * Stores AI-generated matches between donors and receivers.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User.model';

export interface MatchAttributes {
  id: number;
  donorId: number;
  receiverId: number;
  matchScore: number; // 0..1
  status: 'Pending Approval' | 'Confirmed' | 'Rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

interface MatchCreationAttributes extends Optional<MatchAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Match extends Model<MatchAttributes, MatchCreationAttributes> implements MatchAttributes {
  public id!: number;
  public donorId!: number;
  public receiverId!: number;
  public matchScore!: number;
  public status!: 'Pending Approval' | 'Confirmed' | 'Rejected';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Match.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    matchScore: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM('Pending Approval', 'Confirmed', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending Approval',
    },
  },
  { sequelize, tableName: 'matches', timestamps: true }
);

// Relations (optional, for includes)
Match.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });
Match.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export default Match;
