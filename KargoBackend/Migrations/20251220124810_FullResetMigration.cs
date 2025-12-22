using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KargoBackend.Migrations
{
    /// <inheritdoc />
    public partial class FullResetMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CargoRequests_Stations_TargetStationId",
                table: "CargoRequests");

            migrationBuilder.RenameColumn(
                name: "TargetStationId",
                table: "CargoRequests",
                newName: "ToStationId");

            migrationBuilder.RenameIndex(
                name: "IX_CargoRequests_TargetStationId",
                table: "CargoRequests",
                newName: "IX_CargoRequests_ToStationId");

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 864, DateTimeKind.Local).AddTicks(5360));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6330));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6330));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6340));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6340));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6340));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6340));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6340));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6340));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6340));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6350));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 48, 9, 868, DateTimeKind.Local).AddTicks(6350));

            migrationBuilder.AddForeignKey(
                name: "FK_CargoRequests_Stations_ToStationId",
                table: "CargoRequests",
                column: "ToStationId",
                principalTable: "Stations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CargoRequests_Stations_ToStationId",
                table: "CargoRequests");

            migrationBuilder.RenameColumn(
                name: "ToStationId",
                table: "CargoRequests",
                newName: "TargetStationId");

            migrationBuilder.RenameIndex(
                name: "IX_CargoRequests_ToStationId",
                table: "CargoRequests",
                newName: "IX_CargoRequests_TargetStationId");

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 904, DateTimeKind.Local).AddTicks(2250));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3920));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3930));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3930));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3930));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3930));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940));

            migrationBuilder.UpdateData(
                table: "Stations",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 20, 15, 40, 56, 908, DateTimeKind.Local).AddTicks(3940));

            migrationBuilder.AddForeignKey(
                name: "FK_CargoRequests_Stations_TargetStationId",
                table: "CargoRequests",
                column: "TargetStationId",
                principalTable: "Stations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
