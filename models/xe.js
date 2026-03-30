module.exports = (sequelize, DataTypes) => {
  const Xe = sequelize.define('Xe', {
    ten_xe: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    loai_xe: {
      type: DataTypes.STRING(100),
    },
    mo_ta_ngan: {
      type: DataTypes.TEXT,
    },
    mo_ta: {
      type: DataTypes.TEXT,
    },
    giam_gia_max: {
      type: DataTypes.BIGINT,
    },
    anh_dai_dien: {
      type: DataTypes.TEXT,
    },
    noi_bat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    thu_tu: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
