const { sequelize } = require('../models');
async function migrate() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS anh_slide (
      id INT AUTO_INCREMENT PRIMARY KEY,
      url_anh TEXT NOT NULL,
      thu_tu INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table anh_slide created');
  process.exit();
}
migrate().catch(err => { console.error(err); process.exit(1); });
