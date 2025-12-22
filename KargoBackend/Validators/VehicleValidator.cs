using FluentValidation;
using KargoBackend.Enums;
using KargoBackend.Models.DTOs;

namespace KargoBackend.Validators
{
    public class CreateVehicleDtoValidator : AbstractValidator<CreateVehicleDto>
    {
        public CreateVehicleDtoValidator()
        {
            RuleFor(x => x.PlateNumber)
                .NotEmpty().WithMessage("Plaka zorunludur.")
                .MinimumLength(5).WithMessage("Geçersiz plaka formatı.");

            RuleFor(x => x.Type)
                .IsInEnum().WithMessage("Geçersiz araç tipi.");

            RuleFor(x => x.CapacityKg)
                .GreaterThan(0).WithMessage("Kapasite 0'dan büyük olmalıdır.");

            RuleFor(x => x.FixedRentalCost)
                .GreaterThanOrEqualTo(0).WithMessage("Maliyet negatif olamaz.");
        }
    }

    public class UpdateVehicleDtoValidator : AbstractValidator<UpdateVehicleDto>
    {
        public UpdateVehicleDtoValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz araç ID'si.");
            RuleFor(x => x.PlateNumber).NotEmpty().WithMessage("Plaka zorunludur.").MinimumLength(5).WithMessage("Geçersiz plaka formatı.");
            RuleFor(x => x.Type).IsInEnum().WithMessage("Geçersiz araç tipi.");
            RuleFor(x => x.CapacityKg).GreaterThan(0).WithMessage("Kapasite 0'dan büyük olmalıdır.");
            RuleFor(x => x.FixedRentalCost).GreaterThanOrEqualTo(0).WithMessage("Maliyet negatif olamaz.");
        }
    }
}