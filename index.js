// index.js (fuera de src)
import app from "./src/app.js";
import { sequelize } from "./src/db.js";
import "./src/models/relationships.model.js";
import { seedInitUserAdmin } from "./src/seeds/auth.seed.js";
import { seedInitHealthPlans } from "./src/seeds/healthPlans.seed.js";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    await sequelize.sync({ alter: true });
    console.log("🔄 Modelos sincronizados");

    await seedInitHealthPlans();

    await seedInitUserAdmin();

    app.listen(3000, () => {
      console.log("🚀 Servidor corriendo");
    });
  } catch (error) {
    console.error("❌ Error al iniciar la app:", error);
  }
}

main();
