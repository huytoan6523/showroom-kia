module.exports = (sequelize, DataTypes) => {
  const DatLich = sequelize.define('DatLich', {
    ho_ten: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    so_dien_thoai: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
    },
    xe_quan_tam: {
      type: DataTypes.STRING(255),
    },
    ngay_hen: {
      type: DataTypes.DATE,
    },
    ghi_chu: {
      type: DataTypes.TEXT,
    },
    trang_thai: {
      type: DataTypes.STRING(50),
      defaultValue: 'Chờ xử lý',
    },
  }, {
    tableName: 'dat_lich',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  return DatLich;
};
