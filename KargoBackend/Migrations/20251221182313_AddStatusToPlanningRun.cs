using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KargoBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToPlanningRun : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "PlanningRuns",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
