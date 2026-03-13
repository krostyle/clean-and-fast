import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    color: "#1f2937",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1d4ed8",
  },
  companyName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1d4ed8",
  },
  companyInfo: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 4,
  },
  budgetTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
    textAlign: "right",
  },
  budgetNumber: {
    fontSize: 12,
    color: "#1d4ed8",
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    marginTop: 4,
  },
  budgetDate: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 2,
  },
  infoSection: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 4,
  },
  infoLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
  },
  infoSub: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1d4ed8",
    padding: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderText: {
    color: "white",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  col1: { flex: 4 },
  col2: { flex: 1, textAlign: "right" },
  col3: { flex: 1.5, textAlign: "right" },
  col4: { flex: 1.5, textAlign: "right" },
  totalsSection: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: 200,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  totalsLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  totalsValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    backgroundColor: "#1d4ed8",
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  totalFinalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "white",
  },
  totalFinalValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "white",
  },
  notes: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#fef9c3",
    borderRadius: 4,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: "#78350f",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
  statusBadge: {
    padding: "3 8",
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 4,
  },
});

function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CL").format(new Date(date));
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#64748b",
  SENT: "#2563eb",
  ACCEPTED: "#16a34a",
  REJECTED: "#dc2626",
  INVOICED: "#7c3aed",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  ACCEPTED: "Aceptado",
  REJECTED: "Rechazado",
  INVOICED: "Facturado",
};

interface BudgetPDFProps {
  budget: {
    number: string;
    status: string;
    createdAt: Date | string;
    validUntil?: Date | string | null;
    notes?: string | null;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    client: {
      name: string;
      company?: string | null;
      email?: string | null;
      phone?: string | null;
      address?: string | null;
    };
    items: {
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }[];
  };
  company: {
    name: string;
    taxId?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
  };
}

export function BudgetPDFDocument({ budget, company }: BudgetPDFProps) {
  const statusColor = STATUS_COLORS[budget.status] ?? "#64748b";
  const statusLabel = STATUS_LABELS[budget.status] ?? budget.status;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company.name}</Text>
            {company.taxId && <Text style={styles.companyInfo}>RUT: {company.taxId}</Text>}
            {company.address && <Text style={styles.companyInfo}>{company.address}</Text>}
            {company.phone && <Text style={styles.companyInfo}>{company.phone}</Text>}
            {company.email && <Text style={styles.companyInfo}>{company.email}</Text>}
          </View>
          <View>
            <Text style={styles.budgetTitle}>PRESUPUESTO</Text>
            <Text style={styles.budgetNumber}>{budget.number}</Text>
            <Text style={styles.budgetDate}>Fecha: {formatDate(budget.createdAt)}</Text>
            {budget.validUntil && (
              <Text style={styles.budgetDate}>Válido hasta: {formatDate(budget.validUntil)}</Text>
            )}
            <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
              <Text style={{ fontSize: 8, color: statusColor, fontFamily: "Helvetica-Bold" }}>
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Destinatario</Text>
            <Text style={styles.infoValue}>{budget.client.name}</Text>
            {budget.client.company && <Text style={styles.infoSub}>{budget.client.company}</Text>}
            {budget.client.email && <Text style={styles.infoSub}>{budget.client.email}</Text>}
            {budget.client.phone && <Text style={styles.infoSub}>{budget.client.phone}</Text>}
            {budget.client.address && <Text style={styles.infoSub}>{budget.client.address}</Text>}
          </View>
        </View>

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.col1]}>Descripción</Text>
          <Text style={[styles.tableHeaderText, styles.col2]}>Cant.</Text>
          <Text style={[styles.tableHeaderText, styles.col3]}>P. Unitario</Text>
          <Text style={[styles.tableHeaderText, styles.col4]}>Total</Text>
        </View>

        {/* Items */}
        {budget.items.map((item, idx) => (
          <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={[{ fontSize: 9 }, styles.col1]}>{item.description}</Text>
            <Text style={[{ fontSize: 9 }, styles.col2]}>{item.quantity}</Text>
            <Text style={[{ fontSize: 9 }, styles.col3]}>{formatCLP(item.unitPrice)}</Text>
            <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.col4]}>
              {formatCLP(item.total)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{formatCLP(budget.subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>IVA ({budget.taxRate}%)</Text>
              <Text style={styles.totalsValue}>{formatCLP(budget.taxAmount)}</Text>
            </View>
            <View style={styles.totalFinalRow}>
              <Text style={styles.totalFinalLabel}>TOTAL</Text>
              <Text style={styles.totalFinalValue}>{formatCLP(budget.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {budget.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>NOTAS</Text>
            <Text style={styles.notesText}>{budget.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {company.name} — Documento generado el {formatDate(new Date())} — {budget.number}
        </Text>
      </Page>
    </Document>
  );
}
