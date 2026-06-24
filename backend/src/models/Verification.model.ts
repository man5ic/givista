/**
 * Verification Model
 * 
 * Stores temporary OTP codes and pending verification requests.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User.model';

export interface VerificationAttributes {
  id: number;
  userId: number;
  type: 'email' | 'phone' | 'id';
  otp?: string;
  otpExpiresAt?: Date;
  documentUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'verified';
  createdAt?: Date;
  updatedAt?: Date;
}

interface VerificationCreationAttributes extends Optional<VerificationAttributes, 'id' | 'otp' | 'otpExpiresAt' | 'documentUrl' | 'status' | 'createdAt' | 'updatedAt'> {}

class Verification extends Model<VerificationAttributes, VerificationCreationAttributes> implements VerificationAttributes {
  public id!: number;
  public userId!: number;
  public type!: 'email' | 'phone' | 'id';
  public otp?: string;
  public otpExpiresAt?: Date;
  public documentUrl?: string;
  public status!: 'pending' | 'approved' | 'rejected' | 'verified';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Verification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('email', 'phone', 'id'),
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    documentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'verified'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'verifications',
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Verification, { foreignKey: 'userId', as: 'verifications' });
Verification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Verification;

