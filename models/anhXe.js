module.exports = (sequelize, DataTypes) => {
  const AnhXe = sequelize.define('AnhXe', {
    xe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url_anh: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thu_tu: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'anh_xe',
    timestamps: false,
  });

  AnhXe.associate = (models) => {
    AnhXe.belongsTo(models.Xe, { foreignKey: 'xe_id' });
  };

  return AnhXe;
};
