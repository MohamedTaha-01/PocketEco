import { useTheme } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionContext } from "../context/TransactionContext";
import { CATEGORIES } from "../util/categories";
import { CONSTANTS } from "../util/constants";

const OverviewScreen = () => {
  const { transactionsLoading, getCurrentMonthTotal } = useTransactionContext();
  const { colors } = useTheme();

  const currentMonthTotal = getCurrentMonthTotal();

  const { totalEarning, totalSpending, totalEarningPercentage, totalSpendingPercentage } = calculateTotals(currentMonthTotal);

  const screenwidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      {transactionsLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <ScrollView>
          <View style={[styles.section, { backgroundColor: colors.primary }]}>
            <Text style={[styles.title, { color: colors.light }]}>Resumen</Text>
            <Text style={[styles.subtitle, { color: colors.light }]}>mes actual</Text>
            <View style={[styles.totalWrapper, { backgroundColor: colors.light }]}>
              <Text style={styles.totalTitle}>TOTAL</Text>
              <PieChart
                showText
                textColor={colors.light}
                radius={72}
                textSize={16}
                data={[
                  { value: totalEarning, color: "#7986CB", text: `${totalEarningPercentage}%` },
                  { value: totalSpending, color: "#e57373", text: `${totalSpendingPercentage}%` },
                ]}
                isAnimated
              />
              <View style={styles.totalValues}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#7986CB" }]} />
                  <Text>Ingresos {totalEarning}€</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#e57373" }]} />
                  <Text>Gastos {totalSpending}€</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Categorías</Text>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryText}>&lt; Gastos</Text>
            <Text style={styles.categoryText}>Ingresos &gt;</Text>
          </View>
          <View style={styles.categoryContainer}>
            {Object.keys(CATEGORIES).map((categoryKey, index) => {
              const valueIngresos = currentMonthTotal[categoryKey]?.Ingresos ?? 0;
              const valueGastos = Math.abs(currentMonthTotal[categoryKey]?.Gastos ?? 0);
              if (valueGastos === 0 && valueIngresos === 0) return null;
              return (
                <View key={index}>
                  <Text style={styles.chartLabel}>{categoryKey}</Text>
                  <PopulationPyramid
                    data={[
                      {
                        left: valueGastos,
                        right: valueIngresos,
                      },
                    ]}
                    maxValue={Math.max(valueIngresos, valueGastos) || 500}
                    allCornersRounded
                    height={10}
                    width={screenwidth - 50}
                    leftBarColor="#e57373"
                    rightBarColor="#7986CB"
                    xAxisColor="#616161"
                    yAxisColor="#616161"
                    rulesColor="#616161"
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

/**
 * Calcular valores totales
 */
const calculateTotals = (currentMonthTotal) => {
  let totalEarning = 0;
  let totalSpending = 0;

  Object.values(currentMonthTotal).forEach(({ Ingresos, Gastos }) => {
    totalEarning += Ingresos;
    totalSpending += Gastos;
  });

  const total = totalEarning + Math.abs(totalSpending);
  const totalEarningPercentage = Math.round((totalEarning / total) * 100);
  const totalSpendingPercentage = Math.round((Math.abs(totalSpending) / total) * 100);

  return { totalEarning, totalSpending: Math.abs(totalSpending), totalEarningPercentage, totalSpendingPercentage };
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingBottom: 0 },
  loadingIndicator: { marginTop: 32 },
  section: { padding: 16 },
  title: {
    fontSize: CONSTANTS.fontSize_xl,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  subtitle: {
    fontSize: CONSTANTS.fontSize_sm,
    fontWeight: "bold",
    letterSpacing: 1.1,
  },
  totalWrapper: {
    justifyContent: "center",
    alignItems: "center",
    margin: 24,
    paddingVertical: 12,
    borderRadius: CONSTANTS.borderRadius,
  },
  totalTitle: { marginBottom: 12, fontWeight: "bold" },
  totalValues: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 8,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendColor: { width: 8, height: 8, marginRight: 4 },
  sectionTitle: {
    textAlign: "center",
    margin: 12,
    marginTop: 24,
    fontSize: CONSTANTS.fontSize_md,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  categoryHeader: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 4,
  },
  categoryText: { fontWeight: "bold" },
  categoryContainer: { flex: 1, paddingHorizontal: 12, paddingBottom: 8 },
  chartLabel: { textTransform: "capitalize", marginBottom: 4, marginTop: 8 },
});

export default OverviewScreen;
