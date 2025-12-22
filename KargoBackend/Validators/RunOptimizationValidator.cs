using FluentValidation;
using KargoBackend.Models.DTOs;

namespace KargoBackend.Validators
{
    public class RunOptimizationDtoValidator : AbstractValidator<RunOptimizationDto>
    {
        public RunOptimizationDtoValidator()
        {
            RuleFor(x => x.PlanName).NotEmpty().WithMessage("PlanName cannot be empty.").MaximumLength(100).WithMessage("PlanName cannot exceed 100 characters.");
            RuleFor(x => x.Mode).IsInEnum().WithMessage("Invalid PlanningMode value.");
            RuleFor(x => x.Objective).IsInEnum().WithMessage("Invalid OptimizationObjective value.");
        }
    }
}