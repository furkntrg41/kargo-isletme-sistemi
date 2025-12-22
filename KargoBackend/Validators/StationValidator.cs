using System.Data;
using FluentValidation;
using KargoBackend.Models.DTOs;

namespace KargoBackend.Validators
{
    // Create için Doğrulayıcı
    public class CreateStationDtoValidator : AbstractValidator<CreateStationDto>
    {
        public CreateStationDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Station name is required.")
                .MaximumLength(100).WithMessage("Station name cannot exceed 100 characters.");

            RuleFor(x => x.Latitude)
                .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90.");

            RuleFor(x => x.Longitude)
                .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180.");
        }
    }

    // Update için Doğrulayıcı
    public class UpdateStationDtoValidator : AbstractValidator<UpdateStationDto>
    {
        public UpdateStationDtoValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Geçerli bir istasyon ID'si gereklidir.");
            
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("İstasyon adı zorunludur.")
                .MaximumLength(100).WithMessage("İstasyon adı 100 karakteri geçemez.");

            RuleFor(x => x.Latitude)
                .InclusiveBetween(-90, 90).WithMessage("Enlem -90 ile 90 arasında olmalıdır.");

            RuleFor(x => x.Longitude)
                .InclusiveBetween(-180, 180).WithMessage("Boylam -180 ile 180 arasında olmalıdır.");
        }
    }
    public class StationToggleDtoValidator : AbstractValidator<StationToggleDto>
    {
        public StationToggleDtoValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Geçerli bir istasyon ID'si gereklidir.");
            RuleFor(x => x.IsActive)
                .NotNull().WithMessage("IsActive alanı zorunludur.");
        }
    }
}

