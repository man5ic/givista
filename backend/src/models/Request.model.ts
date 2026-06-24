/**
 * Request Model
 * 
 * Defines the Request table structure.
 * Requests are created by Receivers who need help.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User.model';

export interface RequestAttributes {
  id: number;
  receiverId: number;
  title: string;
  description: string;
  category: 'Money' | 'Food' | 'Clothes' | 'Blood' | 'Other';
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Fulfilled' | 'Expired';
  createdAt?: Date;
  updatedAt?: Date;
}

interface RequestCreationAttributes extends Optional<RequestAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Request extends Model<RequestAttributes, RequestCreationAttributes> implements RequestAttributes {
  public id!: number;
  public receiverId!: number;
  public title!: string;
  public description!: string;
  public category!: 'Money' | 'Food' | 'Clothes' | 'Blood' | 'Other';
  public urgency!: 'Low' | 'Medium' | 'High';
  public status!: 'Open' | 'Fulfilled' | 'Expired';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Request.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('Money', 'Food', 'Clothes', 'Blood', 'Other'),
      allowNull: false,
    },
    urgency: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      allowNull: false,
      defaultValue: 'Medium',
    },
    status: {
      type: DataTypes.ENUM('Open', 'Fulfilled', 'Expired'),
      allowNull: false,
      defaultValue: 'Open',
    },
  },
  {
    sequelize,
    tableName: 'requests',
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Request, { foreignKey: 'receiverId', as: 'requests' });
Request.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export default Request;

