/**
 * Recommendation Model
 * 
 * Stores AI-generated recommendations matching donors with receivers.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User.model';

export interface RecommendationAttributes {
  id: number;
  donorId: number;
  receiverId: number;
  score: number; // Matching score from 0.0 to 1.0
  match_details?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RecommendationCreationAttributes extends Optional<RecommendationAttributes, 'id' | 'match_details' | 'createdAt' | 'updatedAt'> {}

class Recommendation extends Model<RecommendationAttributes, RecommendationCreationAttributes> implements RecommendationAttributes {
  public id!: number;
  public donorId!: number;
  public receiverId!: number;
  public score!: number;
  public match_details?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Recommendation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 1,
      },
    },
    match_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'recommendations',
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Recommendation, { foreignKey: 'donorId', as: 'donorRecommendations' });
User.hasMany(Recommendation, { foreignKey: 'receiverId', as: 'receiverRecommendations' });
Recommendation.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });
Recommendation.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export default Recommendation;

