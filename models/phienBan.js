module.exports = (sequelize, DataTypes) => {
  const PhienBan = sequelize.define('PhienBan', {
    xe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ten_phien_ban: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    gia: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    tableName: 'phien_ban',
    timestamps: false,
  });

  PhienBan.associate = (models) => {
    PhienBan.belongsTo(models.Xe, { foreignKey: 'xe_id' });
  };

  return PhienBan;
};
