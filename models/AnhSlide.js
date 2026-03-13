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
  }, {
    tableName: 'anh_slide',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return AnhSlide;
};
