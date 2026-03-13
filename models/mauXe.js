module.exports = (sequelize, DataTypes) => {
  const MauXe = sequelize.define('MauXe', {
    xe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ten_mau: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ma_hex: {
      type: DataTypes.STRING(7),
    },
    anh_mau: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'mau_xe',
    timestamps: false,
  });

  MauXe.associate = (models) => {
    MauXe.belongsTo(models.Xe, { foreignKey: 'xe_id' });
  };

  return MauXe;
};
