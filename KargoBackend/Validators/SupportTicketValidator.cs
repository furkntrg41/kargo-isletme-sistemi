using FluentValidation;
using KargoBackend.Models.DTOs;

namespace KargoBackend.Validators
{
    public class CreateTicketDtoValidator : AbstractValidator<CreateTicketDto>
    {
        public CreateTicketDtoValidator()
        {
            RuleFor(x => x.Subject)
                .NotEmpty().WithMessage("Subject cannot be empty.")
                .MaximumLength(200).WithMessage("Subject cannot exceed 200 characters.");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category cannot be empty.")
                .MaximumLength(100).WithMessage("Category cannot exceed 100 characters.");

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage("Message cannot be empty.")
                .MaximumLength(2000).WithMessage("Message cannot exceed 2000 characters.");
        }
    }
    public class ReplyTicketDtoValidator : AbstractValidator<ReplyTicketDto>
    {
        public ReplyTicketDtoValidator()
        {
            RuleFor(x => x.ReplyMessage)
                .NotEmpty().WithMessage("Reply message cannot be empty.")
                .MaximumLength(2000).WithMessage("Reply message cannot exceed 2000 characters.");
        }
    }
}