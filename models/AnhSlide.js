module.exports = (sequelize, DataTypes) => {
  const AnhSlide = sequelize.define('AnhSlide', {
    url_anh: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thu_tu: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    vi_tri: {
      type: DataTypes.STRING,
      defaultValue: 'khach_hang', // 'hero' hoặc 'khach_hang'
    },
    hien_thi: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'anh_slide',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return AnhSlide;
};
