// index.js (fuera de src)
import app from "./src/app.js";
import { sequelize } from "./src/db.js";
import "./src/models/relationships.model.js";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    await sequelize.sync({ alter: true });
    console.log("🔄 Modelos sincronizados");

    app.listen(3000, () => {
      console.log("🚀 Servidor corriendo en http://localhost:3000");
    });
  } catch (error) {
    console.error("❌ Error al iniciar la app:", error);
  }
}

main();
