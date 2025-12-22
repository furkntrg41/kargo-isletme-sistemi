using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KargoBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FromStationId",
                table: "CargoRequests",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 904, DateTimeKind.Local).AddTicks(2250), 40.821899999999999, 29.921099999999999, "Umuttepe Kampüsü (Merkez Depo)" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3920), 40.7667, 29.916699999999999, "İzmit Merkez" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3930), 40.802700000000002, 29.430700000000002, "Gebze" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3930), 40.716799999999999, 29.817499999999999, "Gölcük" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3930), 40.778100000000002, 29.7364, "Körfez" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3930), 40.753399999999999, 30.023399999999999, "Kartepe" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940), 40.706699999999998, 29.932500000000001, "Başiskele" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940), 40.756399999999999, 29.8306, "Derince" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940), 40.690800000000003, 29.615300000000001, "Karamürsel" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940), 41.068300000000001, 30.149999999999999, "Kandıra" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940), 40.785299999999999, 29.5442, "Dilovası" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940), 40.8247, 29.3736, "Çayırova" });

            migrationBuilder.CreateIndex(
                name: "IX_CargoRequests_FromStationId",
                table: "CargoRequests",
                column: "FromStationId");

            migrationBuilder.AddForeignKey(
                name: "FK_CargoRequests_Stations_FromStationId",
                table: "CargoRequests",
                column: "FromStationId",
                principalTable: "Stations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CargoRequests_Stations_FromStationId",
                table: "CargoRequests");

            migrationBuilder.DropIndex(
                name: "IX_CargoRequests_FromStationId",
                table: "CargoRequests");

            migrationBuilder.DropColumn(
                name: "FromStationId",
                table: "CargoRequests");

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.7667, 29.916699999999999, "İzmit (Merkez Depo)" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.802700000000002, 29.430700000000002, "Gebze" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.716799999999999, 29.817499999999999, "Gölcük" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.778100000000002, 29.7364, "Körfez" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.753399999999999, 30.023399999999999, "Kartepe" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.706699999999998, 29.932500000000001, "Başiskele" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.756399999999999, 29.8306, "Derince" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.690800000000003, 29.615300000000001, "Karamürsel" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 41.068300000000001, 30.149999999999999, "Kandıra" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.785299999999999, 29.5442, "Dilovası" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.8247, 29.3736, "Çayırova" });

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Latitude", "Longitude", "Name" },
                values: new object[] { new DateTime(2025, 12, 19, 0, 0, 0, 0, DateTimeKind.Utc), 40.773600000000002, 29.4039, "Darıca" });
        }
    }
}
