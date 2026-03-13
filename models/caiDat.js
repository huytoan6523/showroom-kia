module.exports = (sequelize, DataTypes) => {
  const CaiDat = sequelize.define('CaiDat', {
    ten_cong_ty: {
      type: DataTypes.STRING(255),
    },
    dia_chi: {
      type: DataTypes.STRING(255),
    },
    so_dien_thoai: {
      type: DataTypes.STRING(15),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    gio_lam_viec: {
      type: DataTypes.STRING(100),
    },
    facebook: {
      type: DataTypes.STRING(255),
    },
    zalo: {
      type: DataTypes.STRING(20),
    },
    gioi_thieu: {
      type: DataTypes.TEXT('long'),
    },
  }, {
    tableName: 'cai_dat',
    timestamps: false,
  });

  return CaiDat;
};
