using FluentValidation;
using KargoBackend.Models.DTOs;

namespace KargoBackend.Validators
{
    public class UpdateSettingsValidator : AbstractValidator<UpdateSettingsDto>
    {
        public UpdateSettingsValidator()
        {
            RuleFor(x => x.CostPerKm)
                .GreaterThan(0).WithMessage("Kilometre başı maliyet 0'dan büyük olmalıdır.")
                .LessThan(500).WithMessage("Maliyet değeri gerçekçi bir sınırın üzerindedir.");

            RuleFor(x => x.RentalVehicleCost)
                .GreaterThanOrEqualTo(0).WithMessage("Kiralık araç bedeli negatif olamaz.");

            RuleFor(x => x.DefaultRentalCapacityKg)
                .InclusiveBetween(10, 50000).WithMessage("Varsayılan kapasite 10kg ile 50.000kg arasında olmalıdır.");

            RuleFor(x => x.MaxStopsPerRoute)
                .InclusiveBetween(1, 100).WithMessage("Bir rota en az 1, en fazla 100 durak içerebilir.");
        }
    }
}