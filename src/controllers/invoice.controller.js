import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";
import { v4 as uuidv4 } from "uuid";
const id = uuidv4();

export const createInvoice = async (req, res) => {
  const { affiliateId, medicalAppointmentId, cost, payment_status } = req.body;

  try {
    await sequelize.query(
      `
      INSERT INTO invoices (id , affiliateId, medicalAppointmentId, cost, payment_status ,  createdAt, updatedAt)
      VALUES (:id , :affiliateId , :medicalAppointmentId , :cost , :payment_status , NOW(), NOW())
      `,
      {
        replacements: {
          id,
          affiliateId,
          medicalAppointmentId,
          cost,
          payment_status,
        },
      }
    );

    const results = await sequelize.query(
      `SELECT * FROM invoices WHERE affiliateId = :affiliateId`,
      {
        replacements: { affiliateId },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "Factura no encontrada después del registro" });
    }

    const invoiceData = results[0];

    res.status(200).json({
      message: "Factura registrada correctamente",
      response: invoiceData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.errors[0].message });
  }
};

export const updateInvoice = async (req, res) => {
  const { id } = req.params;
  const { affiliateId, medicalAppointmentId, cost, payment_status } = req.body;

  try {
    // 1. Actualizar usuario
    await sequelize.query(
      `
      UPDATE invoices
      SET affiliateId = :affiliateId,
          medicalAppointmentId = :medicalAppointmentId,
          cost = :cost,
          payment_status = :payment_status,
          updatedAt = NOW()
      WHERE id = :id
      `,
      {
        replacements: {
          affiliateId,
          medicalAppointmentId,
          cost,
          payment_status,
          updatedAt,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [updateInvoice] = await sequelize.query(
      `
      SELECT *
      FROM invoices
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!updateInvoice) {
      return res
        .status(404)
        .json({ message: "Factura no encontrado despues de actualizar" });
    }

    res.status(200).json({
      message: "Factura actualizada correctamente",
      response: updateInvoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la factura" });
  }
};

export const getOneInvoice = async (req, res) => {
  const { id } = req.params;

  const [invoice] = await sequelize.query(
    `
      SELECT *
      FROM invoices
      WHERE id = :id
      `,
    {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    }
  );
  if (!invoice)
    return res.status(400).json({ message: "Factura no encontrada" });

  return res.status(200).json({
    message: "Factura encontrada",
    response: invoice,
  });
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await sequelize.query(
      `
      SELECT *
      FROM invoices
      ORDER BY createdAt DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Facturas encontradas",
      response: invoices,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en encontrar facturas" });
  }
};

export const deleteInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    //
    const [result] = await sequelize.query(
      `
      DELETE FROM invoices
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    // Sequelize no devuelve filas eliminadas, así que verificamos si el usuario existía antes
    return res.status(200).json({
      message: `Factura con ID ${id} eliminado correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el factura" });
  }
};

export const getPendingInvoices = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      `SELECT u.name, f.amount, f.issue_date
       FROM invoices f
       JOIN affiliates a ON f.affiliateId = a.userId
       JOIN users u ON u.id = a.userId
       WHERE f.payment_status = 'pendiente'`
    );
    return res.status(200).json({
      message: "Facturas pendientes encontradas",
      response: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getTotalBillingByPlan = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      `SELECT hp.name, SUM(f.amount) AS total
       FROM invoices f
       JOIN affiliates a ON f.affiliateId = a.userId
       JOIN healthy_plans hp ON hp.id = a.healthyPlanId
       GROUP BY hp.name`
    );
    return res.status(200).json({
      message: "Facturacion total por plan de salud",
      response: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
