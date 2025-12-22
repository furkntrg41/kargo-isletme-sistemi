using KargoBackend.Enums;

namespace KargoBackend.Models.DTOs
{
    public class RunOptimizationDto
    {
        public DateTime Date { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public PlanningMode Mode {get;set;}
        public OptimizationObjective Objective { get; set; } 
        public bool IsSimulation { get; set; } = false;
        public string? Notes { get; set; } 
    }
}