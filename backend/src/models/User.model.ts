/**
 * User Model
 * 
 * Defines the User table structure in the database.
 * Users can be Donors, Receivers, or Admins.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Define user attributes
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'Donor' | 'Receiver' | 'Admin';
  location: string;
  photo_url?: string;
  isVerified?: boolean;
  verificationType?: 'email' | 'phone' | 'id' | null;
  kycDocument?: string | null;
  phone?: string | null;
  badges?: string[];
  points?: number;
  showEmail?: boolean;
  showPhone?: boolean;
  showLocation?: boolean;
  allowLeaderboardVisibility?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes that can be set during creation (password_hash is optional in input)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'password_hash' | 'photo_url' | 'isVerified' | 'verificationType' | 'kycDocument' | 'phone' | 'createdAt' | 'updatedAt'> {}

// Define User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: 'Donor' | 'Receiver' | 'Admin';
  public location!: string;
  public photo_url?: string;
  public isVerified?: boolean;
  public verificationType?: 'email' | 'phone' | 'id' | null;
  public kycDocument?: string | null;
  public phone?: string | null;
  public badges?: string[];
  public points?: number;
  public showEmail?: boolean;
  public showPhone?: boolean;
  public showLocation?: boolean;
  public allowLeaderboardVisibility?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize User model with Sequelize
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Donor', 'Receiver', 'Admin'),
      allowNull: false,
      defaultValue: 'Donor',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
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
    verificationType: {
      type: DataTypes.ENUM('email', 'phone', 'id'),
      allowNull: true,
      defaultValue: null,
    },
    kycDocument: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    badges: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    showEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    showPhone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    showLocation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    allowLeaderboardVisibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;

