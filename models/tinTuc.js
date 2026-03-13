module.exports = (sequelize, DataTypes) => {
  const TinTuc = sequelize.define('TinTuc', {
    tieu_de: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tom_tat: {
      type: DataTypes.TEXT,
    },
    noi_dung: {
      type: DataTypes.TEXT('long'),
    },
    anh_dai_dien: {
      type: DataTypes.TEXT,
    },
    danh_muc: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    noi_bat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'tin_tuc',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  return TinTuc;
};
