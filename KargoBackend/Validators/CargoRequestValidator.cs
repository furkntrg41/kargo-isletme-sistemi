using FluentValidation;
using KargoBackend.Enums;
using KargoBackend.Models.DTOs;

namespace KargoBackend.Validators
{
    public class CreateCargoRequestDtoValidator : AbstractValidator<CreateCargoRequestDto>
    {
        public CreateCargoRequestDtoValidator()
        {
            RuleFor(x => x.FromStationId)
                .GreaterThan(0).WithMessage("FromStationId must be greater than 0.");

            RuleFor(x => x.ToStationId)
                .GreaterThan(0).WithMessage("ToStationId must be greater than 0.");
    
            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0.");

            RuleFor(x => x.Weight)
                .GreaterThan(0).WithMessage("Weight must be greater than 0.");
        }
    }

    public class UpdateCargoRequestStatusDtoValidator : AbstractValidator<UpdateCargoRequestStatusDto>
    {
        public UpdateCargoRequestStatusDtoValidator()
        {
            // Status zaten bir Enum (CargoStatus) olduğu için IsInEnum yeterlidir
            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Kargo durumu boş olamaz.")
                .IsInEnum().WithMessage("Geçersiz kargo durumu.");

            // Reddedildiğinde neden belirtme zorunluluğu
            When(x => x.Status == CargoStatus.Cancelled || x.Status == CargoStatus.Rejected, () =>
            {
                RuleFor(x => x.RejectionReason)
                    .NotEmpty().WithMessage("Kargo reddedildiğinde neden belirtmek zorunludur.");
            });
            // Reddedilmediyse neden alanı boş olmalı
            When(x => x.Status != CargoStatus.Cancelled && x.Status != CargoStatus.Rejected, () =>
            {
                RuleFor(x => x.RejectionReason)
                    .Empty().WithMessage("Red nedeni sadece kargo reddedildiğinde doldurulabilir.");
            });
        }
    }
}