module.exports = (sequelize, DataTypes) => {
  const Xe = sequelize.define('Xe', {
    ten_xe: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    loai_xe: {
      type: DataTypes.STRING(100),
    },
    nam_san_xuat: {
      type: DataTypes.INTEGER,
    },
    mo_ta: {
      type: DataTypes.TEXT,
    },
    dong_co: {
      type: DataTypes.STRING(100),
    },
    hop_so: {
      type: DataTypes.STRING(100),
    },
    nhien_lieu: {
      type: DataTypes.STRING(50),
    },
    so_cho_ngoi: {
      type: DataTypes.TINYINT,
    },
    muc_tieu_thu: {
      type: DataTypes.STRING(50),
    },
    kich_thuoc: {
      type: DataTypes.STRING(150),
    },
    anh_dai_dien: {
      type: DataTypes.TEXT,
    },
    noi_bat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'xe',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  Xe.associate = (models) => {
    Xe.hasMany(models.PhienBan, { foreignKey: 'xe_id', onDelete: 'CASCADE', hooks: true });
    Xe.hasMany(models.MauXe, { foreignKey: 'xe_id', onDelete: 'CASCADE', hooks: true });
    Xe.hasMany(models.AnhXe, { foreignKey: 'xe_id', onDelete: 'CASCADE', hooks: true });
  };

  return Xe;
};
