// src/models/relationships.js
import { User } from "./user.model.js";
import { Professional } from "./professional.model.js";
import { HealthyCenter } from "./healthyCenter.model.js";
import { Invoice } from "./invoice.model.js";
import { HealthyPlan } from "./healthyPlan.model.js";
import { MedicalRecord } from "./medicalRecord.model.js";
import { MedicalAppointment } from "./medicalAppointments.model.js";
import { Affiliates } from "./affiliates.model.js";

//
//  Relación Usuario - Profesional (1:1)
//
User.hasOne(Professional, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  constraints: true,
});
Professional.belongsTo(User, {
  foreignKey: "userId",
  constraints: true,
});

//
//  Relación Usuario - Afiliado (1:1)
//
User.hasOne(Affiliates, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  constraints: true,
});
Affiliates.belongsTo(User, {
  foreignKey: "userId",
  constraints: true,
});

//
//  Relación Profesional - Centro de salud (N:1)
//
HealthyCenter.hasMany(Professional, {
  foreignKey: "centerId",
  onDelete: "CASCADE",
  constraints: true,
});
Professional.belongsTo(HealthyCenter, {
  foreignKey: "centerId",
  constraints: true,
});

//
//  Relación Afiliado - Plan de salud (N:1)
//
HealthyPlan.hasMany(Affiliates, {
  foreignKey: "healthyPlanId",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  constraints: true,
});
Affiliates.belongsTo(HealthyPlan, {
  foreignKey: "healthyPlanId",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  constraints: true,
});

//
//  Relación Afiliado - Citas médicas (1:N)
//
Affiliates.hasMany(MedicalAppointment, {
  foreignKey: "affiliateId",
  onDelete: "CASCADE",
  constraints: true,
});
MedicalAppointment.belongsTo(Affiliates, {
  foreignKey: "affiliateId",
  constraints: true,
});

//
//  Relación Profesional - Citas médicas (1:N)
//
Professional.hasMany(MedicalAppointment, {
  foreignKey: "professionalId",
  onDelete: "CASCADE",
  constraints: true,
});
MedicalAppointment.belongsTo(Professional, {
  foreignKey: "professionalId",
  constraints: true,
});

//
//  Relación Centro de Salud - Citas médicas (1:N)
//
HealthyCenter.hasMany(MedicalAppointment, {
  foreignKey: "healthyCenterId",
  onDelete: "CASCADE",
  constraints: true,
});
MedicalAppointment.belongsTo(HealthyCenter, {
  foreignKey: "healthyCenterId",
  constraints: true,
});

//
//  Relación Cita - Historial clínico (1:1)
//
MedicalAppointment.hasOne(MedicalRecord, {
  foreignKey: "medicalAppointmentId",
  onDelete: "CASCADE",
  constraints: true,
});
MedicalRecord.belongsTo(MedicalAppointment, {
  foreignKey: "medicalAppointmentId",
  constraints: true,
});

//
//  Relación Afiliado - Factura (1:N)
//
Affiliates.hasMany(Invoice, {
  foreignKey: "affiliateId",
  onDelete: "CASCADE",
  constraints: true,
});
Invoice.belongsTo(Affiliates, {
  foreignKey: "affiliateId",
  constraints: true,
});

//
//  Relación Cita - Factura (opcional 1:1)
//
MedicalAppointment.hasOne(Invoice, {
  foreignKey: "medicalAppointmentId",
  onDelete: "RESTRICT", // evita borrar un plan si hay afiliados que lo usan
  onUpdate: "CASCADE",
  constraints: true,
});
Invoice.belongsTo(MedicalAppointment, {
  foreignKey: "medicalAppointmentId",
  onDelete: "RESTRICT", // evita borrar un plan si hay afiliados que lo usan
  onUpdate: "CASCADE",
  constraints: true,
});
