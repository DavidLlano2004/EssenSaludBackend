import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";
import { v4 as uuidv4 } from "uuid";
import { Invoice } from "../models/invoice.model.js";

export const createInvoice = async (req, res) => {
  const { affiliateId, medicalAppointmentId, cost, payment_status } = req.body;
  const id = uuidv4();

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
  const fieldsToUpdate = req.body;

  try {
    const [updatedCount] = await Invoice.update(fieldsToUpdate, {
      where: { id: id },
    });

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ message: "Factura no encontrada o sin cambios" });
    }

    const updateInvoice = await Invoice.findOne({
      where: { id: id },
    });

    res.status(200).json({
      message: "Factura actualizada correctamente",
      response: updateInvoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar la factura",
      error: error.message || error,
    });
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

export const getInvoicesByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const results = await sequelize.query(
      `SELECT 
	      i.*,
          JSON_OBJECT(
            'userId', p.userId,
            'specialty', p.specialty,
            'license_number', p.license_number,
            'user', JSON_OBJECT(
              'name', up.name,
              'email', up.email
              )
          ) AS infoProfessional,
          JSON_OBJECT(
            'date', m.date,
            'time', m.time
          ) AS infoAppointment,
           h.name AS nameCenter
        FROM invoices i
        LEFT JOIN medical_appointments m ON i.medicalAppointmentId = m.id
        LEFT JOIN professionals p ON m.professionalId = p.userId
        LEFT JOIN affiliates a ON m.affiliateId = a.userId
        LEFT JOIN healthy_centers h ON m.healthyCenterId = h.id
        LEFT JOIN users up ON p.userId = up.id
        WHERE i.affiliateId = :id
        ORDER BY createdAt DESC
       `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
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

export const getTotalPendingByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await sequelize.query(
      `
      SELECT 
        COALESCE(SUM(cost), 0) AS totalPending
      FROM invoices
      WHERE affiliateId = :id
        AND payment_status = 'Pendiente'
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Monto total de facturas pendientes",
      totalPending: result.totalPending, // será 0 si no hay facturas pendientes
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
