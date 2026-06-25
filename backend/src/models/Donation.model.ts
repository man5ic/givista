/**
 * Donation Model
 * 
 * Defines the Donation table structure.
 * Donations are created by Donors to offer items/money.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User.model';

export interface DonationAttributes {
  id: number;
  donorId: number;
  title: string;
  category: 'Money' | 'Food' | 'Clothes' | 'Blood' | 'Other';
  quantity: number;
  description: string;
  status: 'Pending' | 'Matched' | 'Dispatched' | 'Received' | 'Completed' | 'Cancelled';
  photo_url?: string;
  isVerified?: boolean;
  verifiedBy?: number | null;
  verificationStatus?: 'Pending' | 'Approved' | 'Rejected' | null;
  verificationDate?: Date | null;
  verificationRemarks?: string | null;
  matchedAt?: Date | null;
  dispatchedAt?: Date | null;
  receivedAt?: Date | null;
  completedAt?: Date | null;
  fraudScore?: number | null;
  isFlagged?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DonationCreationAttributes extends Optional<DonationAttributes, 'id' | 'status' | 'photo_url' | 'isVerified' | 'verifiedBy' | 'verificationStatus' | 'verificationDate' | 'verificationRemarks' | 'createdAt' | 'updatedAt'> {}

class Donation extends Model<DonationAttributes, DonationCreationAttributes> implements DonationAttributes {
  public id!: number;
  public donorId!: number;
  public title!: string;
  public category!: 'Money' | 'Food' | 'Clothes' | 'Blood' | 'Other';
  public quantity!: number;
  public description!: string;
  public status!: 'Pending' | 'Matched' | 'Dispatched' | 'Received' | 'Completed' | 'Cancelled';
  public photo_url?: string;
  public isVerified?: boolean;
  public verifiedBy?: number | null;
  public verificationStatus?: 'Pending' | 'Approved' | 'Rejected' | null;
  public verificationDate?: Date | null;
  public verificationRemarks?: string | null;
  public matchedAt?: Date | null;
  public dispatchedAt?: Date | null;
  public receivedAt?: Date | null;
  public completedAt?: Date | null;
  public fraudScore?: number | null;
  public isFlagged?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Donation.init(
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('Money', 'Food', 'Clothes', 'Blood', 'Other'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Matched', 'Dispatched', 'Received', 'Completed', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: User,
        key: 'id',
      },
    },
    verificationStatus: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: true,
      defaultValue: 'Pending',
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    verificationRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    matchedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    dispatchedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    fraudScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      validate: { min: 0, max: 1 },
    },
    isFlagged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'donations',
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Donation, { foreignKey: 'donorId', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });

// Verification relationship
Donation.belongsTo(User, { foreignKey: 'verifiedBy', as: 'verifier' });

export default Donation;

