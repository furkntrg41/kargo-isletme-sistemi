using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace KargoBackend.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20251221 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.CreateTable(
                name: "GlobalSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CostPerKm = table.Column<double>(type: "REAL", nullable: false),
                    RentalVehicleCost = table.Column<double>(type: "REAL", nullable: false),
                    DefaultRentalCapacityKg = table.Column<double>(type: "REAL", nullable: false),
                    MaxStopsPerRoute = table.Column<int>(type: "INTEGER", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GlobalSettings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GlobalSettings");

            migrationBuilder.InsertData(
                table: "Stations",
                columns: new[] { "Id", "CreatedAt", "IsActive", "IsDepot", "Latitude", "Longitude", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, true, 40.821899999999999, 29.921099999999999, "Umuttepe Kampüsü (Merkez Depo)", null },
                    { 2, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.7667, 29.916699999999999, "İzmit Merkez", null },
                    { 3, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.802700000000002, 29.430700000000002, "Gebze", null },
                    { 4, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.716799999999999, 29.817499999999999, "Gölcük", null },
                    { 5, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.778100000000002, 29.7364, "Körfez", null },
                    { 6, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.753399999999999, 30.023399999999999, "Kartepe", null },
                    { 7, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.706699999999998, 29.932500000000001, "Başiskele", null },
                    { 8, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.756399999999999, 29.8306, "Derince", null },
                    { 9, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.690800000000003, 29.615300000000001, "Karamürsel", null },
                    { 10, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 41.068300000000001, 30.149999999999999, "Kandıra", null },
                    { 11, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.785299999999999, 29.5442, "Dilovası", null },
                    { 12, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 40.8247, 29.3736, "Çayırova", null }
                });

            migrationBuilder.InsertData(
                table: "Vehicles",
                columns: new[] { "Id", "CapacityKg", "CreatedAt", "FixedRentalCost", "IsActive", "PlateNumber", "Type", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 500.0, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 0.0, true, "41KRG01", 0, null },
                    { 2, 750.0, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 0.0, true, "41KRG02", 0, null },
                    { 3, 1000.0, new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 0.0, true, "41KRG03", 0, null }
                });
        }
    }
}
